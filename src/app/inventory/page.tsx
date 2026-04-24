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
import { Search, PlusCircle, Eye, Edit, Trash2, Package, CheckCircle2, AlertTriangle } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"

interface Asset {
  id: string
  asset_tag: string
  name: string
  category: string
  status: string
  brand: string
  condition: string
  assigned_to?: {
    id: string
    name: string
    email: string
    role_id: string
    role?: {
      name: string
    }
  } | string
  purchase_date: string
  warranty_expiry: string
}

export default function InventoryPage() {
  const [assets, setAssets] = useState<Asset[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const { user } = useAuth()
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [newAsset, setNewAsset] = useState({ asset_tag: "", name: "", category_id: "" })
  const [alerts, setAlerts] = useState<any[]>([])
  
  // View/Edit modal states
  const [isViewOpen, setIsViewOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null)
  const [editAsset, setEditAsset] = useState({ asset_tag: "", name: "", category: "", status: "", condition: "" })

  const isAdmin = user?.role === "Admin" || user?.role === "Super Admin"
  const isEmployee = user?.role === "Employee"

  useEffect(() => {
    fetchAssets()
    if (isAdmin) {
      fetchAlerts()
    }
  }, [isAdmin])

  const fetchAlerts = async () => {
    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'https://asset-management-system-1-cm2v.onrender.com'}/api/assets/inventory-alerts`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (response.ok) {
        const data = await response.json()
        setAlerts(data.alerts || [])
      }
    } catch(e) {}
  }

  const fetchAssets = async () => {
    try {
      const token = localStorage.getItem("token")
      
      if (isEmployee && user?.id) {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'https://asset-management-system-1-cm2v.onrender.com'}/api/users/${user.id}/assignments`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        if (response.ok) {
          const assignments = await response.json()
          setAssets(assignments.map((a: any) => a.asset).filter(Boolean))
        }
      } else {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'https://asset-management-system-1-cm2v.onrender.com'}/api/assets/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (response.ok) {
          const data = await response.json()
          setAssets(data)
        }
      }
    } catch (error) {
      console.error("Error fetching assets:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddAsset = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'https://asset-management-system-1-cm2v.onrender.com'}/api/assets/`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify({ asset_tag: newAsset.asset_tag, name: newAsset.name })
      })
      if (response.ok) {
        alert("Asset added successfully!")
        setIsAddOpen(false)
        setNewAsset({ asset_tag: "", name: "", category_id: "" })
        fetchAssets()
      } else {
        const error = await response.json()
        alert(`Failed to add asset: ${error.detail}`)
      }
    } catch (err) {
      alert("Failed to connect.")
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this asset?")) return
    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'https://asset-management-system-1-cm2v.onrender.com'}/api/assets/${id}/deactivate`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` }
      })
      if (response.ok) fetchAssets()
    } catch(e) {}
  }

  const handleView = (asset: Asset) => {
    setSelectedAsset(asset)
    setIsViewOpen(true)
  }

  const handleEdit = (asset: Asset) => {
    setSelectedAsset(asset)
    setEditAsset({
      asset_tag: asset.asset_tag,
      name: asset.name,
      category: asset.category || "",
      status: asset.status,
      condition: asset.condition
    })
    setIsEditOpen(true)
  }

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedAsset) return
    
    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'https://asset-management-system-1-cm2v.onrender.com'}/api/assets/${selectedAsset.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify(editAsset)
      })
      
      if (response.ok) {
        alert("✅ Asset updated successfully!")
        setIsEditOpen(false)
        fetchAssets()
      } else {
        const error = await response.json()
        alert(`❌ Failed to update asset: ${error.detail}`)
      }
    } catch (err) {
      alert("❌ Failed to connect to server.")
    }
  }

  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Available":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100 flex items-center gap-1"><CheckCircle2 className="w-3 h-3" />Available</Badge>
      case "Assigned":
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100 flex items-center gap-1"><Package className="w-3 h-3" />Assigned</Badge>
      case "Maintenance":
        return <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-100 flex items-center gap-1"><AlertTriangle className="w-3 h-3" />Maintenance</Badge>
      case "Retired":
        return <Badge variant="outline">Retired</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const getAssignedToName = (assignedTo: Asset['assigned_to']) => {
    if (!assignedTo) return '-'
    if (typeof assignedTo === 'string') return assignedTo
    return assignedTo.name || 'Unknown'
  }

  const getAssignedToEmail = (assignedTo: Asset['assigned_to']) => {
    if (!assignedTo || typeof assignedTo === 'string') return ''
    return assignedTo.email || ''
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return 'No date available'
    const date = new Date(dateString)
    if (isNaN(date.getTime())) return 'No date available'
    return date.toLocaleDateString()
  }

  const filteredAssets = assets.filter(
    (asset) => {
      const searchLower = searchTerm.toLowerCase()
      return (
        (asset.name?.toLowerCase() || '').includes(searchLower) ||
        (asset.asset_tag?.toLowerCase() || '').includes(searchLower) ||
        (asset.category?.toLowerCase() || '').includes(searchLower) ||
        (asset.assigned_to && getAssignedToName(asset.assigned_to).toLowerCase().includes(searchLower))
      )
    }
  )

  return (
    <ProtectedRoute requiredPermission="view:assets">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-3xl font-bold tracking-tight text-white">
              {isEmployee ? "My Assets" : "Asset Directory"}
            </h3>
            <p className="text-gray-400 mt-2 text-sm">
              {isEmployee
                ? "View equipment currently assigned to you."
                : "Track and manage all organizational assets."}
            </p>
          </div>
          {isAdmin && (
            <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
              <Button 
                className="transition-all hover:scale-105 hover:shadow-[0_0_30px_rgba(59,130,246,0.6)]" 
                style={{
                  background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                  border: '1px solid rgba(59,130,246,0.5)',
                  boxShadow: '0 4px 20px rgba(59,130,246,0.4)',
                  borderRadius: '12px',
                  padding: '12px 24px'
                }}
                onClick={() => setIsAddOpen(true)}
              >
                <PlusCircle className="h-4 w-4 mr-2" />
                Add Asset
              </Button>
              <DialogContent>
                <form onSubmit={handleAddAsset}>
                  <DialogHeader>
                    <DialogTitle>Add New Asset</DialogTitle>
                    <DialogDescription>Register a new asset into the system inventory.</DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="asset_tag">Asset Tag</Label>
                      <Input id="asset_tag" required value={newAsset.asset_tag} onChange={e => setNewAsset({...newAsset, asset_tag: e.target.value})} placeholder="e.g. LP-1001" />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="name">Asset Name/Model</Label>
                      <Input id="name" required value={newAsset.name} onChange={e => setNewAsset({...newAsset, name: e.target.value})} placeholder="e.g. MacBook Pro 16" />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="button" variant="outline" onClick={() => setIsAddOpen(false)}>Cancel</Button>
                    <Button type="submit">Add Asset</Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          )}
        </div>

        {/* Alerts Section */}
        {isAdmin && alerts.length > 0 && (
          <div className="space-y-2">
            {alerts.map((alert, idx) => (
              <div key={idx} className="bg-red-50 text-red-800 p-3 rounded-md border border-red-200 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  <span><strong>Low Stock:</strong> {alert.message}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Stats Cards */}
        {isEmployee ? (
          <div className="grid gap-6 md:grid-cols-3">
            <div className="futuristic-card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-cyan-300/70 mb-1">Total My Assets</p>
                  <p className="text-3xl font-bold gradient-text">{assets.length}</p>
                </div>
                <div className="p-3 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/30">
                  <Package className="h-6 w-6 text-cyan-400" />
                </div>
              </div>
            </div>
            <div className="futuristic-card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-300/70 mb-1">Active Assets</p>
                  <p className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                    {assets.filter(a => a.status !== "Issue Reported" && a.status !== "Maintenance" && a.status !== "Retired").length}
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-blue-500/30">
                  <CheckCircle2 className="h-6 w-6 text-blue-400" />
                </div>
              </div>
            </div>
            <div className="futuristic-card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-orange-300/70 mb-1">Reported Issues</p>
                  <p className="text-3xl font-bold bg-gradient-to-r from-orange-400 to-yellow-400 bg-clip-text text-transparent">
                    {assets.filter(a => a.status === "Issue Reported").length}
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-gradient-to-br from-orange-500/20 to-yellow-500/20 border border-orange-500/30">
                  <AlertTriangle className="h-6 w-6 text-orange-400" />
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-4">
            <div className="futuristic-card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-cyan-300/70 mb-1">Total Assets</p>
                  <p className="text-3xl font-bold gradient-text">{assets.length}</p>
                </div>
                <div className="p-3 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/30">
                  <Package className="h-6 w-6 text-cyan-400" />
                </div>
              </div>
            </div>
            <div className="futuristic-card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-300/70 mb-1">Available</p>
                  <p className="text-3xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                    {assets.filter(a => a.status === "Available").length}
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-gradient-to-br from-green-500/20 to-emerald-500/20 border border-green-500/30">
                  <CheckCircle2 className="h-6 w-6 text-green-400" />
                </div>
              </div>
            </div>
            <div className="futuristic-card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-300/70 mb-1">Assigned</p>
                  <p className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                    {assets.filter(a => a.status === "Assigned").length}
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-blue-500/30">
                  <Package className="h-6 w-6 text-blue-400" />
                </div>
              </div>
            </div>
            <div className="futuristic-card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-orange-300/70 mb-1">Maintenance</p>
                  <p className="text-3xl font-bold bg-gradient-to-r from-orange-400 to-yellow-400 bg-clip-text text-transparent">
                    {assets.filter(a => a.status === "Maintenance").length}
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-gradient-to-br from-orange-500/20 to-yellow-500/20 border border-orange-500/30">
                  <AlertTriangle className="h-6 w-6 text-orange-400" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Assets Table */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>{isEmployee ? "My Equipment" : "All Assets"}</CardTitle>
                <CardDescription>
                  {filteredAssets.length} asset{filteredAssets.length !== 1 ? "s" : ""}
                </CardDescription>
              </div>
              <div className="relative w-64">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search assets..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8 text-muted-foreground">Loading assets...</div>
            ) : filteredAssets.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                {isEmployee ? "No assets assigned to you" : "No assets found"}
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Asset Tag</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Status</TableHead>
                    {isAdmin && <TableHead>Assigned To</TableHead>}
                    <TableHead>Condition</TableHead>
                    <TableHead>Warranty</TableHead>
                    {isAdmin && <TableHead className="text-right">Actions</TableHead>}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAssets.map((asset) => (
                    <TableRow key={asset.id}>
                      <TableCell className="font-semibold text-indigo-600">
                        {asset.asset_tag}
                      </TableCell>
                      <TableCell className="font-medium">{asset.name}</TableCell>
                      <TableCell>{asset.category || "-"}</TableCell>
                      <TableCell>{getStatusBadge(asset.status)}</TableCell>
                      {isAdmin && (
                        <TableCell>
                          <div>
                            <div className="font-medium">{getAssignedToName(asset.assigned_to)}</div>
                            {getAssignedToEmail(asset.assigned_to) && (
                              <div className="text-xs text-muted-foreground">{getAssignedToEmail(asset.assigned_to)}</div>
                            )}
                          </div>
                        </TableCell>
                      )}
                      <TableCell>{asset.condition}</TableCell>
                      <TableCell>
                        {formatDate(asset.warranty_expiry)}
                      </TableCell>
                      {isAdmin && (
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button variant="outline" size="sm" className="text-blue-600 bg-blue-50 border-blue-200 hover:bg-blue-100" onClick={() => handleView(asset)}>
                              <Eye className="h-4 w-4 mr-1" />
                              View
                            </Button>
                            <Button variant="outline" size="sm" className="text-indigo-600 bg-indigo-50 border-indigo-200 hover:bg-indigo-100" onClick={() => handleEdit(asset)}>
                              <Edit className="h-4 w-4 mr-1" />
                              Edit
                            </Button>
                            <Button variant="outline" size="sm" className="text-red-600 bg-red-50 border-red-200 hover:bg-red-100" onClick={() => handleDelete(asset.id)}>
                              <Trash2 className="h-4 w-4 mr-1" />
                              Delete
                            </Button>
                          </div>
                        </TableCell>
                      )}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* View Asset Modal */}
        <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Package className="h-5 w-5 text-blue-600" />
                Asset Details
              </DialogTitle>
              <DialogDescription>Complete information about this asset</DialogDescription>
            </DialogHeader>
            {selectedAsset && (
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                    <Label className="text-xs text-gray-500">Asset Tag</Label>
                    <p className="font-semibold text-lg">{selectedAsset.asset_tag}</p>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                    <Label className="text-xs text-gray-500">Status</Label>
                    <p className="font-semibold">{getStatusBadge(selectedAsset.status)}</p>
                  </div>
                </div>
                <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                  <Label className="text-xs text-gray-500">Asset Name</Label>
                  <p className="font-medium text-lg">{selectedAsset.name}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                    <Label className="text-xs text-gray-500">Category</Label>
                    <p className="font-medium">{selectedAsset.category || "N/A"}</p>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                    <Label className="text-xs text-gray-500">Condition</Label>
                    <p className="font-medium">{selectedAsset.condition}</p>
                  </div>
                </div>
                {selectedAsset.assigned_to && (
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg border border-blue-200">
                    <Label className="text-xs text-blue-600">Assigned To</Label>
                    <p className="font-medium text-blue-900 dark:text-blue-100">
                      {getAssignedToName(selectedAsset.assigned_to)}
                      {getAssignedToEmail(selectedAsset.assigned_to) && (
                        <span className="block text-xs text-blue-600 dark:text-blue-400 mt-1">
                          {getAssignedToEmail(selectedAsset.assigned_to)}
                        </span>
                      )}
                    </p>
                  </div>
                )}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                    <Label className="text-xs text-gray-500">Purchase Date</Label>
                    <p className="font-medium">{new Date(selectedAsset.purchase_date).toLocaleDateString()}</p>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                    <Label className="text-xs text-gray-500">Warranty Expiry</Label>
                    <p className="font-medium">{formatDate(selectedAsset.warranty_expiry)}</p>
                  </div>
                </div>
              </div>
            )}
            <DialogFooter>
              <Button onClick={() => setIsViewOpen(false)}>Close</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit Asset Modal */}
        <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
          <DialogContent>
            <form onSubmit={handleSaveEdit}>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Edit className="h-5 w-5 text-indigo-600" />
                  Edit Asset
                </DialogTitle>
                <DialogDescription>Update asset information</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit_asset_tag">Asset Tag</Label>
                  <Input 
                    id="edit_asset_tag" 
                    required 
                    value={editAsset.asset_tag} 
                    onChange={e => setEditAsset({...editAsset, asset_tag: e.target.value})} 
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit_name">Asset Name</Label>
                  <Input 
                    id="edit_name" 
                    required 
                    value={editAsset.name} 
                    onChange={e => setEditAsset({...editAsset, name: e.target.value})} 
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit_category">Category</Label>
                  <Input 
                    id="edit_category" 
                    value={editAsset.category} 
                    onChange={e => setEditAsset({...editAsset, category: e.target.value})} 
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="edit_status">Status</Label>
                    <Select value={editAsset.status} onValueChange={val => setEditAsset({...editAsset, status: val})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Available">Available</SelectItem>
                        <SelectItem value="Assigned">Assigned</SelectItem>
                        <SelectItem value="Maintenance">Maintenance</SelectItem>
                        <SelectItem value="Retired">Retired</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="edit_condition">Condition</Label>
                    <Select value={editAsset.condition} onValueChange={val => setEditAsset({...editAsset, condition: val})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="New">New</SelectItem>
                        <SelectItem value="Good">Good</SelectItem>
                        <SelectItem value="Fair">Fair</SelectItem>
                        <SelectItem value="Poor">Poor</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsEditOpen(false)}>Cancel</Button>
                <Button type="submit" className="bg-gradient-to-r from-indigo-600 to-purple-600">
                  Save Changes
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </ProtectedRoute>
  )
}
