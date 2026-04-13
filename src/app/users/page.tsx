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
import { Search, UserCheck, UserX, Shield, ShieldCheck } from "lucide-react"

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

  const isSuperAdmin = user?.role === "Super Admin"
  const isAdmin = user?.role === "Admin"

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token")
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
        fetchUsers() // Refresh the list
      } else {
        console.error("Failed to deactivate user")
      }
    } catch (error) {
      console.error("Error deactivating user:", error)
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
        <div>
          <h3 className="text-2xl font-bold tracking-tight">
            {isSuperAdmin ? "User Directory" : "Employee Directory"}
          </h3>
          <p className="text-muted-foreground">
            {isSuperAdmin
              ? "Manage system users, view roles, and control access."
              : "View and manage all employees in the organization."}
          </p>
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

        {/* Users/Employees Table */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>
                  {isSuperAdmin ? "All Users" : "All Employees"}
                </CardTitle>
                <CardDescription>
                  {users.length} total user{users.length !== 1 ? "s" : ""}
                  {isAdmin && " (Employees only)"}
                </CardDescription>
              </div>
              <div className="relative w-64">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder={isSuperAdmin ? "Search users..." : "Search employees..."}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8 text-muted-foreground">
                Loading users...
              </div>
            ) : filteredUsers.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No users found
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{getRoleBadge(user.role.name)}</TableCell>
                      <TableCell>
                        {user.is_active ? (
                          <Badge className="bg-green-100 text-green-800 hover:bg-green-100 flex items-center gap-1 w-fit">
                            <UserCheck className="w-3 h-3" />
                            Active
                          </Badge>
                        ) : (
                          <Badge variant="destructive" className="flex items-center gap-1 w-fit">
                            <UserX className="w-3 h-3" />
                            Inactive
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        {new Date(user.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right">
                        {user.is_active && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeactivate(user.id)}
                          >
                            Deactivate
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </ProtectedRoute>
  )
}
