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

interface Asset {
  id: string
  asset_tag: string
  name: string
  category: string
  status: string
  brand: string
  condition: string
  assigned_to?: string
  purchase_date: string
  warranty_expiry: string
}

export default function InventoryPage() {
  const [assets, setAssets] = useState<Asset[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const { user } = useAuth()

  const isAdmin = user?.role === "Admin" || user?.role === "Super Admin"
  const isEmployee = user?.role === "Employee"

  useEffect(() => {
    fetchAssets()
  }, [])

  const fetchAssets = async () => {
    try {
      const token = localStorage.getItem("token")
      const response = await fetch("http://localhost:8000/api/assets/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        setAssets(data)
      } else {
        loadDummyAssets()
      }
    } catch (error) {
      console.error("Error fetching assets, using dummy data:", error)
      loadDummyAssets()
    } finally {
      setLoading(false)
    }
  }

  const loadDummyAssets = () => {
    if (isEmployee) {
      // Employee sees only their assigned assets
      setAssets([
        {
          id: "1",
          asset_tag: "LP-1002",
          name: "HP Pavilion 15",
          category: "Laptop",
          status: "Assigned",
          brand: "HP",
          condition: "Good",
          assigned_to: user?.name,
          purchase_date: "2023-01-15",
          warranty_expiry: "2025-01-15"
        },
        {
          id: "2",
          asset_tag: "MN-2002",
          name: "LG Ultrawide 29\" Monitor",
          category: "Monitor",
          status: "Assigned",
          brand: "LG",
          condition: "Fair",
          assigned_to: user?.name,
          purchase_date: "2023-06-20",
          warranty_expiry: "2025-06-20"
        },
        {
          id: "3",
          asset_tag: "KB-3001",
          name: "Logitech K380 Keyboard",
          category: "Keyboard",
          status: "Assigned",
          brand: "Logitech",
          condition: "Excellent",
          assigned_to: user?.name,
          purchase_date: "2024-01-10",
          warranty_expiry: "2026-01-10"
        },
        {
          id: "4",
          asset_tag: "MS-4001",
          name: "Logitech M331 Mouse",
          category: "Mouse",
          status: "Assigned",
          brand: "Logitech",
          condition: "Excellent",
          assigned_to: user?.name,
          purchase_date: "2024-01-10",
          warranty_expiry: "2026-01-10"
        },
        {
          id: "5",
          asset_tag: "AD-6001",
          name: "USB-C Hub 7-in-1",
          category: "Accessory",
          status: "Assigned",
          brand: "Anker",
          condition: "Good",
          assigned_to: user?.name,
          purchase_date: "2024-01-20",
          warranty_expiry: "2025-07-20"
        }
      ])
    } else {
      // Admin/Super Admin sees all inventory
      setAssets([
        {
          id: "1",
          asset_tag: "LP-1001",
          name: "MacBook Pro 16\"",
          category: "Laptop",
          status: "Available",
          brand: "Apple",
          condition: "Excellent",
          purchase_date: "2023-11-01",
          warranty_expiry: "2025-11-01"
        },
        {
          id: "2",
          asset_tag: "LP-1002",
          name: "HP Pavilion 15",
          category: "Laptop",
          status: "Assigned",
          brand: "HP",
          condition: "Good",
          assigned_to: "Rahul Sharma",
          purchase_date: "2023-01-15",
          warranty_expiry: "2025-01-15"
        },
        {
          id: "3",
          asset_tag: "LP-1003",
          name: "Dell XPS 13",
          category: "Laptop",
          status: "Assigned",
          brand: "Dell",
          condition: "Good",
          assigned_to: "Sneha Patel",
          purchase_date: "2023-03-20",
          warranty_expiry: "2025-03-20"
        },
        {
          id: "4",
          asset_tag: "MN-2001",
          name: "Dell UltraSharp 27\"",
          category: "Monitor",
          status: "Available",
          brand: "Dell",
          condition: "Excellent",
          purchase_date: "2023-05-10",
          warranty_expiry: "2025-05-10"
        },
        {
          id: "5",
          asset_tag: "MN-2002",
          name: "LG Ultrawide 29\" Monitor",
          category: "Monitor",
          status: "Assigned",
          brand: "LG",
          condition: "Fair",
          assigned_to: "Amit Kumar",
          purchase_date: "2023-06-20",
          warranty_expiry: "2025-06-20"
        },
        {
          id: "6",
          asset_tag: "KB-3001",
          name: "Logitech K380 Keyboard",
          category: "Keyboard",
          status: "Assigned",
          brand: "Logitech",
          condition: "Excellent",
          assigned_to: "Priya Singh",
          purchase_date: "2024-01-10",
          warranty_expiry: "2026-01-10"
        },
        {
          id: "7",
          asset_tag: "KB-3002",
          name: "Mechanical Keyboard RGB",
          category: "Keyboard",
          status: "Available",
          brand: "Corsair",
          condition: "Excellent",
          purchase_date: "2024-02-15",
          warranty_expiry: "2026-02-15"
        },
        {
          id: "8",
          asset_tag: "MS-4001",
          name: "Logitech M331 Mouse",
          category: "Mouse",
          status: "Assigned",
          brand: "Logitech",
          condition: "Excellent",
          assigned_to: "Vikram Reddy",
          purchase_date: "2024-01-10",
          warranty_expiry: "2026-01-10"
        },
        {
          id: "9",
          asset_tag: "MS-4002",
          name: "MX Master 3",
          category: "Mouse",
          status: "Available",
          brand: "Logitech",
          condition: "Excellent",
          purchase_date: "2024-02-20",
          warranty_expiry: "2026-02-20"
        },
        {
          id: "10",
          asset_tag: "AD-6001",
          name: "USB-C Hub 7-in-1",
          category: "Accessory",
          status: "Assigned",
          brand: "Anker",
          condition: "Good",
          assigned_to: "Neha Gupta",
          purchase_date: "2024-01-20",
          warranty_expiry: "2025-07-20"
        },
        {
          id: "11",
          asset_tag: "HP-7001",
          name: "Herman Miller Chair",
          category: "Furniture",
          status: "Available",
          brand: "Herman Miller",
          condition: "Excellent",
          purchase_date: "2022-08-15",
          warranty_expiry: "2034-08-15"
        },
        {
          id: "12",
          asset_tag: "PR-8001",
          name: "Epson Projector",
          category: "Equipment",
          status: "Maintenance",
          brand: "Epson",
          condition: "Fair",
          purchase_date: "2021-05-10",
          warranty_expiry: "2024-05-10"
        }
      ])
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

  const filteredAssets = assets.filter(
    (asset) =>
      asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      asset.asset_tag.toLowerCase().includes(searchTerm.toLowerCase()) ||
      asset.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (asset.assigned_to && asset.assigned_to.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  return (
    <ProtectedRoute requiredPermission="view:assets">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-2xl font-bold tracking-tight">
              {isEmployee ? "My Assets" : "Inventory Management"}
            </h3>
            <p className="text-muted-foreground">
              {isEmployee
                ? "View equipment currently assigned to you."
                : "Track and manage all organizational assets."}
            </p>
          </div>
          {isAdmin && (
            <Button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800">
              <PlusCircle className="h-4 w-4 mr-2" />
              Add Asset
            </Button>
          )}
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Assets</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{assets.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Available</CardTitle>
              <CheckCircle2 className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {assets.filter(a => a.status === "Available").length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Assigned</CardTitle>
              <Package className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {assets.filter(a => a.status === "Assigned").length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Maintenance</CardTitle>
              <AlertTriangle className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">
                {assets.filter(a => a.status === "Maintenance").length}
              </div>
            </CardContent>
          </Card>
        </div>

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
                      <TableCell>{asset.category}</TableCell>
                      <TableCell>{getStatusBadge(asset.status)}</TableCell>
                      {isAdmin && (
                        <TableCell>{asset.assigned_to || "-"}</TableCell>
                      )}
                      <TableCell>{asset.condition}</TableCell>
                      <TableCell>
                        {new Date(asset.warranty_expiry).toLocaleDateString()}
                      </TableCell>
                      {isAdmin && (
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Trash2 className="h-4 w-4" />
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
      </div>
    </ProtectedRoute>
  )
}
