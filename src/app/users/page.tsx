"use client"

import { useState, useEffect } from "react"
import { ProtectedRoute } from "@/components/ProtectedRoute"
import { useAuth } from "@/context/AuthContext"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Search, UserCheck, UserX, Shield, ShieldCheck, PlusCircle } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface Role {
  id: string
  name: string
  permissions: string[]
}

interface User {
  id: string
  name: string
  email: string
  is_active: boolean
  created_at: string
  role: Role
  secondary_role?: Role | null
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const { user } = useAuth()
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [newEmp, setNewEmp] = useState({ name: "", email: "", password: "", role_id: "" })
  const [roles, setRoles] = useState<{id: string, name: string}[]>([])

  const isSuperAdmin = user?.role === "Super Admin"
  const isAdmin = user?.role === "Admin"

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token")
      
      const rolesRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/roles/`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (rolesRes.ok) {
        const allRoles = await rolesRes.json()
        
        // Filter roles based on user permissions
        let filteredRoles = allRoles
        if (isAdmin) {
          // Admin can only create Employees
          filteredRoles = allRoles.filter((r: any) => r.name.toLowerCase() === "employee")
        } else if (isSuperAdmin) {
          // Super Admin can create Admin or Employee (not Super Admin to prevent privilege escalation)
          filteredRoles = allRoles.filter((r: any) => 
            r.name.toLowerCase() === "admin" || r.name.toLowerCase() === "employee"
          )
        }
        
        setRoles(filteredRoles)
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/users/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      
      if (response.ok) {
        const data = await response.json()
        // Super Admin sees all users (Admin + Employee)
        // Admin sees only Employees
        if (isSuperAdmin) {
          setUsers(data)
        } else if (isAdmin) {
          const employeesOnly = data.filter(
            (u: User) => u.role.name.toLowerCase() === "employee"
          )
          setUsers(employeesOnly)
        } else {
          setUsers(data)
        }
      } else {
        console.error("Failed to fetch users")
      }
    } catch (error) {
      console.error("Error fetching users:", error)
    } finally {
      setLoading(false)
    }
  }

  
  const handleAddEmployee = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validation
    if (!newEmp.name || !newEmp.email || !newEmp.password || !newEmp.role_id) {
      alert("❌ Please fill in all required fields.")
      return
    }
    
    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/users/`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify({
          name: newEmp.name,
          email: newEmp.email,
          password: newEmp.password,
          role_id: newEmp.role_id,
          is_active: true
        })
      })
      
      if (response.ok) {
        alert("✅ User added successfully!")
        setIsAddOpen(false)
        setNewEmp({ name: "", email: "", password: "", role_id: "" })
        fetchUsers()
      } else {
        const error = await response.json()
        if (response.status === 422) {
          const detail = error.detail
          if (Array.isArray(detail)) {
            const messages = detail.map((d: any) => d.msg).join(", ")
            alert(`❌ Validation error: ${messages}`)
          } else {
            alert(`❌ Validation error: ${detail || 'Please check all fields'}`)
          }
        } else {
          alert(`❌ Failed to add user: ${error.detail || 'Unknown error'}`)
        }
      }
    } catch (err) {
      alert("❌ Failed to connect to server. Please try again.")
      console.error(err)
    }
  }

  const handleDeactivate = async (userId: string) => {
    if (!confirm("Are you sure you want to deactivate this user?")) {
      return
    }

    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/users/${userId}/deactivate`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        alert("✅ User deactivated successfully")
        fetchUsers()
      } else {
        const error = await response.json()
        alert(`❌ Failed to deactivate: ${error.detail || 'Unknown error'}`)
      }
    } catch (error) {
      console.error("Error deactivating user:", error)
      alert("❌ Failed to deactivate user")
    }
  }

  const handleActivate = async (userId: string) => {
    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/users/${userId}/activate`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` }
      })
      if (response.ok) {
        alert("✅ User activated successfully")
        fetchUsers()
      } else {
        const error = await response.json()
        alert(`❌ Failed to activate: ${error.detail || 'Unknown error'}`)
      }
    } catch (error) {
       console.error("Error activating user", error)
       alert("❌ Failed to activate user")
    }
  }

  const handleDelete = async (userId: string) => {
    if (!confirm("⚠️ Are you sure you want to permanently delete this user? This action cannot be undone!")) return
    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/users/${userId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      })
      if (response.ok) {
        alert("✅ User deleted successfully")
        fetchUsers()
      } else {
        const error = await response.json()
        alert(`❌ Failed to delete: ${error.detail || 'Unknown error'}`)
      }
    } catch (error) {
       console.error("Error deleting user", error)
       alert("❌ Failed to delete user")
    }
  }

  const getRoleBadge = (roleName: string) => {
    switch (roleName.toLowerCase()) {
      case "super admin":
        return (
          <Badge className="bg-purple-600 hover:bg-purple-700 text-white flex items-center gap-1">
            <ShieldCheck className="w-3 h-3" />
            Super Admin
          </Badge>
        )
      case "admin":
        return (
          <Badge className="bg-red-600 hover:bg-red-700 text-white flex items-center gap-1">
            <Shield className="w-3 h-3" />
            Admin
          </Badge>
        )
      case "employee":
        return (
          <Badge variant="secondary" className="flex items-center gap-1">
            Employee
          </Badge>
        )
      default:
        return <Badge variant="outline">{roleName}</Badge>
    }
  }

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.role.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const adminUsers = users.filter(
    (user) =>
      user.role.name.toLowerCase() === "admin" ||
      user.role.name.toLowerCase() === "super admin"
  )

  const employeeUsers = users.filter(
    (user) => user.role.name.toLowerCase() === "employee"
  )

  return (
    <ProtectedRoute requiredPermission="view:users">
      <div className="space-y-6">
        <div className="flex justify-between items-center w-full">
        <div>
          <h3 className="text-3xl font-bold tracking-tight text-white">
            {isSuperAdmin ? "User Directory" : "Employee Directory"}
          </h3>
          <p className="text-gray-400 mt-2 text-sm">
            {isSuperAdmin
              ? "Manage system users, view roles, and control access."
              : "View and manage all employees in the organization."}
          </p>
        </div>
          {(isAdmin || isSuperAdmin) && (
            <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
              <Button 
                className="transition-all hover:scale-105 hover:shadow-[0_0_30px_rgba(168,85,247,0.6)]" 
                style={{
                  background: 'linear-gradient(135deg, #a855f7 0%, #8b5cf6 100%)',
                  border: '1px solid rgba(168,85,247,0.5)',
                  boxShadow: '0 4px 20px rgba(168,85,247,0.4)',
                  borderRadius: '12px',
                  padding: '12px 24px'
                }}
                onClick={() => setIsAddOpen(true)}
              >
                <PlusCircle className="h-4 w-4 mr-2" />
                Add User
              </Button>
              <DialogContent>
                <form onSubmit={handleAddEmployee}>
                  <DialogHeader>
                    <DialogTitle>Add New Employee/User</DialogTitle>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label>Full Name</Label>
                      <Input required value={newEmp.name} onChange={e => setNewEmp({...newEmp, name: e.target.value})} placeholder="e.g. John Doe" />
                    </div>
                    <div className="grid gap-2">
                      <Label>Email</Label>
                      <Input type="email" required value={newEmp.email} onChange={e => setNewEmp({...newEmp, email: e.target.value})} placeholder="e.g. john@company.com" />
                    </div>
                    <div className="grid gap-2">
                      <Label>Temporary Password</Label>
                      <Input type="password" required value={newEmp.password} onChange={e => setNewEmp({...newEmp, password: e.target.value})} placeholder="e.g. temporary123" />
                    </div>
                    <div className="grid gap-2">
                      <Label>Role</Label>
                      <Select required value={newEmp.role_id} onValueChange={val => setNewEmp({...newEmp, role_id: val})}>
                        <SelectTrigger><SelectValue placeholder="Select Role" /></SelectTrigger>
                        <SelectContent>
                          {roles.map(r => <SelectItem key={r.id} value={r.id}>{r.name}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="button" variant="outline" onClick={() => setIsAddOpen(false)}>Cancel</Button>
                    <Button type="submit">Add User</Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          )}
        </div>

        {/* Admin Summary Card - Only shown to Super Admin */}
        {isSuperAdmin && adminUsers.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-purple-600" />
                Administrators
              </CardTitle>
              <CardDescription>
                Users with administrative privileges ({adminUsers.length})
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {adminUsers.map((user) => (
                  <div
                    key={user.id}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg bg-muted"
                  >
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    <span className="text-sm font-medium">{user.name}</span>
                    {getRoleBadge(user.role.name)}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Users/Employees Card Grid */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-2xl font-bold text-white tracking-tight">
                {isSuperAdmin ? "All Users" : "All Employees"}
              </h3>
              <p className="text-gray-400 text-sm mt-1">
                {users.length} total user{users.length !== 1 ? "s" : ""}
                {isAdmin && " (Employees only)"}
              </p>
            </div>
            <div className="relative w-72">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
              <Input
                placeholder={isSuperAdmin ? "Search users..." : "Search employees..."}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-[#0f172a]/80 border-purple-500/20 text-white placeholder:text-gray-500 rounded-xl"
              />
            </div>
          </div>
          
          {loading ? (
            <div className="text-center py-16 text-gray-400">
              <div className="animate-pulse">Loading users...</div>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="text-center py-16 text-gray-400">
              No users found
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredUsers.map((user) => (
                <div
                  key={user.id}
                  className="bg-[#0b1120]/80 backdrop-blur-xl border border-purple-500/20 rounded-2xl p-6 shadow-[0_0_30px_rgba(168,85,247,0.1)] hover:shadow-[0_0_40px_rgba(168,85,247,0.2)] hover:scale-[1.02] transition-all duration-300"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h4 className="text-white text-lg font-semibold mb-1">
                        {user.name}
                      </h4>
                      <p className="text-gray-500 text-xs uppercase tracking-wider">
                        CODE: {user.id.substring(0, 8).toUpperCase()}
                      </p>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500/20 to-blue-500/20 border border-purple-500/30 flex items-center justify-center">
                      <span className="text-purple-300 font-bold text-sm">
                        {user.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-3 mb-4">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400 text-sm">Email:</span>
                      <span className="text-gray-300 text-sm">{user.email}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400 text-sm">Position:</span>
                      <span className="text-gray-300 text-sm">{user.role.name}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-purple-500/10">
                    <div className="flex items-center gap-2">
                      {user.is_active ? (
                        <span className="px-3 py-1 bg-green-500/20 border border-green-500/30 text-green-400 rounded-full text-xs font-medium">
                          ACTIVE CLEARANCE
                        </span>
                      ) : (
                        <span className="px-3 py-1 bg-red-500/20 border border-red-500/30 text-red-400 rounded-full text-xs font-medium">
                          INACTIVE
                        </span>
                      )}
                    </div>
                    
                    <div className="flex gap-2">
                      {user.is_active ? (
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-xs h-7 px-2 border-yellow-500/30 text-yellow-400 hover:bg-yellow-500/10"
                          onClick={() => handleDeactivate(user.id)}
                        >
                          Deactivate
                        </Button>
                      ) : (
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-xs h-7 px-2 border-green-500/30 text-green-400 hover:bg-green-500/10"
                          onClick={() => handleActivate(user.id)}
                        >
                          Activate
                        </Button>
                      )}
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="text-xs h-7 px-2 border-red-500/30 text-red-400 hover:bg-red-500/10"
                        onClick={() => handleDelete(user.id)}
                      >
                         Delete
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  )
}
