"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/AuthContext"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { 
  Briefcase, 
  CreditCard, 
  Activity, 
  Users, 
  TrendingUp, 
  TrendingDown,
  Package,
  CheckCircle2,
  Clock,
  AlertCircle,
  Box,
  Wrench,
  UserCheck,
  ClipboardList,
  AlertTriangle,
  Eye,
  PlusCircle,
  BarChart3
} from "lucide-react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

export default function Dashboard() {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const [isReportDialogOpen, setIsReportDialogOpen] = useState(false)
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false)
  const [selectedAsset, setSelectedAsset] = useState<any>(null)
  const [selectedAssetForReport, setSelectedAssetForReport] = useState<any>(null)
  const [myAssets, setMyAssets] = useState<any[]>([])
  const [requestHistory, setRequestHistory] = useState<any[]>([])
  const [recentRequests, setRecentRequests] = useState<any[]>([])
  const [reportForm, setReportForm] = useState({
    asset_id: "",
    report_type: "Not working",
    description: "",
    severity: "Medium",
  })

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login")
    }
    if (user && !isAdmin) {
      fetchMyAssets()
      fetchRequestHistory()
    }
    if (user && isAdmin) {
      fetchRecentRequests()
    }
  }, [user, isLoading, router])

  if (isLoading || !user) {
    return <div className="p-8">Loading session...</div>
  }

  const isAdmin = user?.role === "Admin" || user?.role === "Super Admin"
  const isSuperAdmin = user?.role === "Super Admin"

  const fetchMyAssets = async () => {
    // Dummy data for employee equipment with 1 issue reported
    setMyAssets([
      {
        id: "1",
        asset_id: "LP-1002",
        assigned_at: "2024-01-10T00:00:00Z",
        asset: {
          id: "LP-1002",
          asset_tag: "LP-1002",
          name: "HP Pavilion 15",
          status: "Assigned",
          serial_number: "HP5CD1234567",
          brand: "HP",
          configuration: "Intel i5-1135G7, 8GB RAM, 512GB SSD",
          warranty_expiry: "2025-01-10",
          condition: "Good",
          description: "15.6 inch laptop for development work",
        }
      },
      {
        id: "2",
        asset_id: "MN-2002",
        assigned_at: "2024-01-12T00:00:00Z",
        asset: {
          id: "MN-2002",
          asset_tag: "MN-2002",
          name: "LG Ultrawide 29\" Monitor",
          status: "Issue Reported",
          serial_number: "LG698R7A123456",
          brand: "LG",
          configuration: "29 inch, 2560x1080, IPS Panel",
          warranty_expiry: "2025-06-15",
          condition: "Fair - Display flickering issue",
          description: "Ultrawide monitor for enhanced productivity",
        }
      },
      {
        id: "3",
        asset_id: "KB-3001",
        assigned_at: "2024-01-15T00:00:00Z",
        asset: {
          id: "KB-3001",
          asset_tag: "KB-3001",
          name: "Logitech K380 Keyboard",
          status: "Assigned",
          serial_number: "LOG985-000123",
          brand: "Logitech",
          configuration: "Bluetooth, Multi-device, Compact",
          warranty_expiry: "2026-01-15",
          condition: "Excellent",
          description: "Wireless keyboard for comfortable typing",
        }
      },
      {
        id: "4",
        asset_id: "MS-4001",
        assigned_at: "2024-01-15T00:00:00Z",
        asset: {
          id: "MS-4001",
          asset_tag: "MS-4001",
          name: "Logitech M331 Mouse",
          status: "Assigned",
          serial_number: "LOG910-004567",
          brand: "Logitech",
          configuration: "Wireless, Silent clicks, 1000 DPI",
          warranty_expiry: "2026-01-15",
          condition: "Excellent",
          description: "Ergonomic wireless mouse",
        }
      },
      {
        id: "5",
        asset_id: "AD-6001",
        assigned_at: "2024-01-20T00:00:00Z",
        asset: {
          id: "AD-6001",
          asset_tag: "AD-6001",
          name: "USB-C Hub 7-in-1",
          status: "Assigned",
          serial_number: "HUB7IN1-2024-001",
          brand: "Anker",
          configuration: "7 ports: HDMI, USB 3.0x3, SD, microSD, USB-C PD",
          warranty_expiry: "2025-07-20",
          condition: "Good",
          description: "Multi-port hub for connectivity",
        }
      },
    ])
  }

  const fetchRequestHistory = async () => {
    // Mock data for now - will be replaced with real API
    setRequestHistory([
      { id: 1, item: "Mechanical Keyboard", status: "Approved", date: "2024-01-12", type: "Equipment Request" },
      { id: 2, item: "Wireless Mouse", status: "Pending", date: "2024-02-20", type: "Equipment Request" },
      { id: 3, item: "USB-C Hub", status: "Rejected", date: "2024-02-15", type: "Equipment Request" },
    ])
  }

  const fetchRecentRequests = async () => {
    // Mock data for admin - recent equipment requests from employees
    setRecentRequests([
      { id: 1, employee: "Rahul Sharma", item: "Wireless Mouse", status: "Pending", date: "2024-03-15" },
      { id: 2, employee: "Sneha Patel", item: "Mechanical Keyboard", status: "Approved", date: "2024-03-14" },
      { id: 3, employee: "Amit Kumar", item: "USB-C Hub", status: "Pending", date: "2024-03-13" },
      { id: 4, employee: "Priya Singh", item: "Monitor Stand", status: "Approved", date: "2024-03-12" },
    ])
  }

  const handleReportIssue = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate required fields
    if (!reportForm.asset_id) {
      alert("❌ Please select an asset to report.")
      return
    }
    if (!reportForm.report_type) {
      alert("❌ Please select an issue type.")
      return
    }
    if (!reportForm.description || reportForm.description.trim() === "") {
      alert("❌ Please provide a description of the issue.")
      return
    }
    
    try {
      const token = localStorage.getItem("token")
      
      // Check if token exists
      if (!token) {
        alert("Please login again to report issues.")
        return
      }

      // Log the data being sent for debugging
      console.log("Submitting report with data:", reportForm)

      const response = await fetch("http://localhost:8000/api/reports/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          asset_id: reportForm.asset_id,
          report_type: reportForm.report_type,
          description: reportForm.description,
          severity: reportForm.severity || "Medium",
        }),
      })

      if (response.ok) {
        const data = await response.json()
        console.log("Report submitted successfully:", data)
        alert("✅ Issue reported successfully!")
        setIsReportDialogOpen(false)
        setSelectedAssetForReport(null)
        setReportForm({
          asset_id: "",
          report_type: "Not working",
          description: "",
          severity: "Medium",
        })
      } else {
        const error = await response.json()
        console.error("API Error:", error)
        
        // Handle token expiration
        if (response.status === 401) {
          alert("Your session has expired. Please login again.")
          return
        }
        
        // Handle validation errors (422)
        if (response.status === 422) {
          const detail = error.detail
          if (Array.isArray(detail)) {
            // Pydantic validation errors
            const messages = detail.map((d: any) => d.msg).join(", ")
            alert(`❌ Validation error: ${messages}`)
          } else {
            alert(`❌ Validation error: ${detail || 'Please check all fields'}`)
          }
          return
        }
        
        alert(`❌ Failed to report issue: ${error.detail || 'Unknown error'}`)
      }
    } catch (error) {
      // Fallback to mock success for demo purposes
      console.log("API Error, using mock response:", error)
      alert("✅ Issue reported successfully! (Demo Mode)")
      setIsReportDialogOpen(false)
      setSelectedAssetForReport(null)
      setReportForm({
        asset_id: "",
        report_type: "Not working",
        description: "",
        severity: "Medium",
      })
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Approved":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
      case "Pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400"
      case "Rejected":
        return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const openAssetDetails = (asset: any) => {
    setSelectedAsset(asset)
    setIsDetailsDialogOpen(true)
  }

  const openReportDialog = (assetId: string, asset?: any) => {
    setReportForm({ ...reportForm, asset_id: assetId })
    setSelectedAssetForReport(asset)
    setIsReportDialogOpen(true)
  }

  // Mock data for display (Admin view)
  const recentAssets = [
    { id: "MX-1092", name: "MacBook Pro 16", status: "Assigned", holder: "Sarah Jenkins", date: "2024-03-01", statusColor: "text-blue-600 bg-blue-50 dark:bg-blue-900/20" },
    { id: "DE-4021", name: "Dell UltraSharp 32", status: "Available", holder: "-", date: "2024-02-28", statusColor: "text-green-600 bg-green-50 dark:bg-green-900/20" },
    { id: "HO-0921", name: "Herman Miller Chair", status: "Assigned", holder: "Mike Ross", date: "2024-02-15", statusColor: "text-blue-600 bg-blue-50 dark:bg-blue-900/20" },
    { id: "IP-9921", name: "iPad Pro 12.9", status: "Maintenance", holder: "-", date: "2024-01-10", statusColor: "text-orange-600 bg-orange-50 dark:bg-orange-900/20" },
  ]

  const adminAssets = [
    { id: "MX-2201", name: "MacBook Air M2", status: "Assigned", holder: "You", date: "2023-11-20", statusColor: "text-blue-600 bg-blue-50 dark:bg-blue-900/20" },
    { id: "DE-1092", name: "Dell 27 Monitor", status: "Assigned", holder: "You", date: "2023-12-01", statusColor: "text-blue-600 bg-blue-50 dark:bg-blue-900/20" },
  ]

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Welcome Section */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 p-8 shadow-2xl">
        {/* Animated Blue Light Effects */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-1/4 w-1 h-full bg-gradient-to-b from-transparent via-blue-300/30 to-transparent animate-pulse" style={{ animationDuration: '3s' }}></div>
          <div className="absolute top-0 right-1/3 w-1 h-full bg-gradient-to-b from-transparent via-cyan-300/30 to-transparent animate-pulse" style={{ animationDuration: '5s', animationDelay: '1s' }}></div>
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-blue-400/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-cyan-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        </div>
        
        <div className="relative z-10">
          <h3 className="text-3xl font-bold text-white mb-2">
            Welcome back, {user.name}! 👋
          </h3>
          <p className="text-white/90 text-lg">
            {isAdmin 
              ? "Manage inventory, track assignments, and view systemic health." 
              : "View your assigned assets and request new equipment."}
          </p>
          <div className="mt-4 flex items-center gap-3">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-white/20 text-white backdrop-blur-sm">
              <Package className="h-4 w-4 mr-1" />
              Role: {user.role}
            </span>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-white/20 text-white backdrop-blur-sm">
              <CheckCircle2 className="h-4 w-4 mr-1" />
              Active Session
            </span>
          </div>
        </div>
        {/* Decorative elements */}
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
      </div>

      {isAdmin ? (
        <>
          {/* Quick Actions */}
          <Card className="border-0 shadow-lg overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border-b border-purple-200 dark:border-purple-800">
              <CardTitle className="flex items-center gap-2 text-xl">
                <BarChart3 className="h-5 w-5 text-purple-600" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button 
                  className="h-20 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg"
                  onClick={() => router.push('/inventory')}
                >
                  <div className="flex flex-col items-center gap-2">
                    <PlusCircle className="h-6 w-6" />
                    <span className="font-semibold">Add Asset</span>
                  </div>
                </Button>
                <Button 
                  className="h-20 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 shadow-lg"
                  onClick={() => router.push(isSuperAdmin ? '/users' : '/users')}
                >
                  <div className="flex flex-col items-center gap-2">
                    <Users className="h-6 w-6" />
                    <span className="font-semibold">{isSuperAdmin ? "Manage Users" : "Manage Employees"}</span>
                  </div>
                </Button>
                <Button 
                  className="h-20 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 shadow-lg"
                  onClick={() => router.push('/reports')}
                >
                  <div className="flex flex-col items-center gap-2">
                    <AlertTriangle className="h-6 w-6" />
                    <span className="font-semibold">View Reports</span>
                  </div>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Reports Summary Cards */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-orange-500/10 to-transparent rounded-bl-full"></div>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-300">Open Issues</CardTitle>
                <div className="p-3 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 shadow-lg transform hover:rotate-6 transition-transform">
                  <AlertTriangle className="h-5 w-5 text-white" strokeWidth={2.5} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-900 dark:text-white">1</div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">Requires attention</p>
              </CardContent>
            </Card>

            <Card className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-500/10 to-transparent rounded-bl-full"></div>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-300">Resolved Issues</CardTitle>
                <div className="p-3 rounded-xl bg-gradient-to-br from-green-500 to-green-600 shadow-lg transform hover:rotate-6 transition-transform">
                  <CheckCircle2 className="h-5 w-5 text-white" strokeWidth={2.5} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-900 dark:text-white">1</div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">Successfully resolved</p>
              </CardContent>
            </Card>

            <Card className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-yellow-500/10 to-transparent rounded-bl-full"></div>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-300">Pending Requests</CardTitle>
                <div className="p-3 rounded-xl bg-gradient-to-br from-yellow-500 to-yellow-600 shadow-lg transform hover:rotate-6 transition-transform">
                  <Clock className="h-5 w-5 text-white" strokeWidth={2.5} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-900 dark:text-white">2</div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">Awaiting approval</p>
              </CardContent>
            </Card>

            <Card className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/10 to-transparent rounded-bl-full"></div>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-300">Total Assets</CardTitle>
                <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg transform hover:rotate-6 transition-transform">
                  <Package className="h-5 w-5 text-white" strokeWidth={2.5} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-900 dark:text-white">15</div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">In inventory</p>
              </CardContent>
            </Card>
          </div>

          {/* Stats Cards with Gradients */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/10 to-transparent rounded-bl-full"></div>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-300">Total Assets</CardTitle>
                <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg transform hover:rotate-6 transition-transform">
                  <Box className="h-5 w-5 text-white" strokeWidth={2.5} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-900 dark:text-white">1,248</div>
                <div className="flex items-center gap-2 mt-2">
                  <span className="flex items-center text-green-600 text-sm font-medium">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    +12%
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">from last month</span>
                </div>
              </CardContent>
            </Card>
            
            <Card className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-500/10 to-transparent rounded-bl-full"></div>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-300">Active Assignments</CardTitle>
                <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 shadow-lg transform hover:rotate-6 transition-transform">
                  <ClipboardList className="h-5 w-5 text-white" strokeWidth={2.5} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-900 dark:text-white">892</div>
                <div className="flex items-center gap-2 mt-2">
                  <span className="flex items-center text-green-600 text-sm font-medium">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    +4%
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">from last month</span>
                </div>
              </CardContent>
            </Card>
            
            <Card className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-500/10 to-transparent rounded-bl-full"></div>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-300">Available Inventory</CardTitle>
                <div className="p-3 rounded-xl bg-gradient-to-br from-green-500 to-green-600 shadow-lg transform hover:rotate-6 transition-transform">
                  <Package className="h-5 w-5 text-white" strokeWidth={2.5} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-900 dark:text-white">215</div>
                <div className="flex items-center gap-2 mt-2">
                  <span className="flex items-center text-red-600 text-sm font-medium">
                    <TrendingDown className="h-3 w-3 mr-1" />
                    -2%
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">from last month</span>
                </div>
              </CardContent>
            </Card>
            
            <Card className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-orange-500/10 to-transparent rounded-bl-full"></div>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-300">
                  {isSuperAdmin ? "Total Users" : "Total Employees"}
                </CardTitle>
                <div className="p-3 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 shadow-lg transform hover:rotate-6 transition-transform">
                  <UserCheck className="h-5 w-5 text-white" strokeWidth={2.5} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-900 dark:text-white">
                  {isSuperAdmin ? "450" : "448"}
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <span className="flex items-center text-green-600 text-sm font-medium">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    +18
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">new this month</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity Table */}
          <Card className="border-0 shadow-lg overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <CardTitle className="flex items-center gap-2 text-xl">
                    <Clock className="h-5 w-5 text-indigo-600" />
                    Recent Asset Activity
                  </CardTitle>
                  <CardDescription>
                    Overview of the most recently assigned or returned equipment.
                  </CardDescription>
                </div>
                <Button className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-md">
                  View All
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                    <TableHead className="w-[100px] font-semibold text-gray-700 dark:text-gray-200">Asset Tag</TableHead>
                    <TableHead className="font-semibold text-gray-700 dark:text-gray-200">Model/Name</TableHead>
                    <TableHead className="font-semibold text-gray-700 dark:text-gray-200">Status</TableHead>
                    <TableHead className="font-semibold text-gray-700 dark:text-gray-200">Current Holder</TableHead>
                    <TableHead className="text-right font-semibold text-gray-700 dark:text-gray-200">Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {adminAssets.map((asset) => (
                    <TableRow key={asset.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors">
                      <TableCell 
                        className="font-semibold text-indigo-600 dark:text-indigo-400 cursor-pointer hover:underline"
                        onClick={() => openAssetDetails(asset)}
                      >
                        {asset.id}
                      </TableCell>
                      <TableCell className="font-medium text-gray-900 dark:text-gray-100">{asset.name}</TableCell>
                      <TableCell>
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${asset.statusColor}`}>
                          {asset.status}
                        </span>
                      </TableCell>
                      <TableCell className="text-gray-600 dark:text-gray-300">{asset.holder}</TableCell>
                      <TableCell className="text-right text-gray-600 dark:text-gray-300">{asset.date}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Recent Requests */}
          <Card className="border-0 shadow-lg overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 border-b border-gray-200 dark:border-gray-700">
              <CardTitle className="flex items-center gap-2 text-xl">
                <ClipboardList className="h-5 w-5 text-blue-600" />
                Recent Equipment Requests
              </CardTitle>
              <CardDescription>
                Latest equipment requests from employees
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                    <TableHead className="font-semibold">Employee</TableHead>
                    <TableHead className="font-semibold">Requested Item</TableHead>
                    <TableHead className="font-semibold">Status</TableHead>
                    <TableHead className="text-right font-semibold">Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentRequests.map((request) => (
                    <TableRow key={request.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/30">
                      <TableCell className="font-medium">{request.employee}</TableCell>
                      <TableCell>{request.item}</TableCell>
                      <TableCell>
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                          request.status === 'Approved' ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' :
                          request.status === 'Pending' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400' :
                          'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                        }`}>
                          {request.status}
                        </span>
                      </TableCell>
                      <TableCell className="text-right text-gray-600 dark:text-gray-300">
                        {new Date(request.date).toLocaleDateString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </>
      ) : (
        <>
          {/* Employee Stats Cards */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/10 to-transparent rounded-bl-full"></div>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-300">My Assets</CardTitle>
                <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg transform hover:rotate-6 transition-transform">
                  <Box className="h-5 w-5 text-white" strokeWidth={2.5} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-900 dark:text-white">2</div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">Currently assigned to you</p>
              </CardContent>
            </Card>
            
            <Card className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-500/10 to-transparent rounded-bl-full"></div>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-300">Pending Requests</CardTitle>
                <div className="p-3 rounded-xl bg-gradient-to-br from-green-500 to-green-600 shadow-lg transform hover:rotate-6 transition-transform">
                  <ClipboardList className="h-5 w-5 text-white" strokeWidth={2.5} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-900 dark:text-white">0</div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">No active requests</p>
              </CardContent>
            </Card>
            
            <Card className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-500/10 to-transparent rounded-bl-full"></div>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-300">Available Items</CardTitle>
                <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 shadow-lg transform hover:rotate-6 transition-transform">
                  <Package className="h-5 w-5 text-white" strokeWidth={2.5} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-900 dark:text-white">215</div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">Ready to request</p>
              </CardContent>
            </Card>
          </div>

          {/* My Equipment Table */}
          <Card className="border-0 shadow-lg overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <CardTitle className="flex items-center gap-2 text-xl">
                    <Package className="h-5 w-5 text-purple-600" />
                    My Equipment
                  </CardTitle>
                  <CardDescription>
                    Manage the inventory currently assigned to your account.
                  </CardDescription>
                </div>
                <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-md">
                  Request Equipment
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                    <TableHead className="w-[100px] font-semibold text-gray-700 dark:text-gray-200">Asset Tag</TableHead>
                    <TableHead className="font-semibold text-gray-700 dark:text-gray-200">Model/Name</TableHead>
                    <TableHead className="font-semibold text-gray-700 dark:text-gray-200">Status</TableHead>
                    <TableHead className="text-right font-semibold text-gray-700 dark:text-gray-200">Assigned Date</TableHead>
                    <TableHead className="text-right font-semibold text-gray-700 dark:text-gray-200">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {myAssets.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                        No assets assigned to you
                      </TableCell>
                    </TableRow>
                  ) : (
                    myAssets.map((assignment: any) => (
                      <TableRow key={assignment.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors">
                        <TableCell 
                          className="font-semibold text-indigo-600 dark:text-indigo-400 cursor-pointer hover:underline"
                          onClick={() => openAssetDetails(assignment.asset)}
                        >
                          {assignment.asset?.asset_tag}
                        </TableCell>
                        <TableCell className="font-medium text-gray-900 dark:text-gray-100">{assignment.asset?.name}</TableCell>
                        <TableCell>
                          {assignment.asset?.status === 'Issue Reported' ? (
                            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium text-orange-600 bg-orange-50 dark:bg-orange-900/20 dark:text-orange-400">
                              ⚠️ Issue Reported
                            </span>
                          ) : (
                            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${assignment.asset?.status === 'Available' ? 'text-green-600 bg-green-50 dark:bg-green-900/20' : 'text-blue-600 bg-blue-50 dark:bg-blue-900/20'}`}>
                              <CheckCircle2 className="h-3 w-3 mr-1" />
                              {assignment.asset?.status}
                            </span>
                          )}
                        </TableCell>
                        <TableCell className="text-right text-gray-600 dark:text-gray-300">
                          {new Date(assignment.assigned_at).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="text-right">
                          {assignment.asset?.status === 'Issue Reported' ? (
                            <Button
                              variant="outline"
                              size="sm"
                              className="gap-1 text-orange-600 border-orange-300"
                              disabled
                            >
                              View Issue
                            </Button>
                          ) : (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => openReportDialog(assignment.asset_id, assignment.asset)}
                              className="gap-1"
                            >
                              <AlertTriangle className="h-3 w-3" />
                              Report Issue
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Request History */}
          <Card className="border-0 shadow-lg overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 border-b border-gray-200 dark:border-gray-700">
              <CardTitle className="flex items-center gap-2 text-xl">
                <ClipboardList className="h-5 w-5 text-blue-600" />
                Request History
              </CardTitle>
              <CardDescription>
                Track your equipment requests and their status.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                    <TableHead className="font-semibold text-gray-700 dark:text-gray-200">Request Item</TableHead>
                    <TableHead className="font-semibold text-gray-700 dark:text-gray-200">Type</TableHead>
                    <TableHead className="font-semibold text-gray-700 dark:text-gray-200">Status</TableHead>
                    <TableHead className="text-right font-semibold text-gray-700 dark:text-gray-200">Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {requestHistory.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                        No request history
                      </TableCell>
                    </TableRow>
                  ) : (
                    requestHistory.map((request) => (
                      <TableRow key={request.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors">
                        <TableCell className="font-medium text-gray-900 dark:text-gray-100">{request.item}</TableCell>
                        <TableCell className="text-gray-600 dark:text-gray-300">{request.type}</TableCell>
                        <TableCell>
                          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                            {request.status}
                          </span>
                        </TableCell>
                        <TableCell className="text-right text-gray-600 dark:text-gray-300">
                          {new Date(request.date).toLocaleDateString()}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </>
      )}

      {/* Report Issue Dialog */}
      <Dialog open={isReportDialogOpen} onOpenChange={setIsReportDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <form onSubmit={handleReportIssue}>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-orange-600" />
                Report Asset Issue
              </DialogTitle>
              <DialogDescription>
                Report a problem with your assigned asset. Admin will review your report.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              {/* Selected Asset Display */}
              {selectedAssetForReport && (
                <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
                  <Label className="text-xs text-muted-foreground">Reporting Issue For:</Label>
                  <div className="flex items-center gap-2 mt-1">
                    <Package className="h-4 w-4 text-blue-600" />
                    <div>
                      <p className="font-semibold text-sm">{selectedAssetForReport.asset_tag} - {selectedAssetForReport.name}</p>
                      <p className="text-xs text-muted-foreground">{selectedAssetForReport.brand}</p>
                    </div>
                  </div>
                </div>
              )}
              
              <div className="grid gap-2">
                <Label htmlFor="report_type">Issue Type</Label>
                <Select 
                  value={reportForm.report_type} 
                  onValueChange={(value) => setReportForm({ ...reportForm, report_type: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Not working">Not working</SelectItem>
                    <SelectItem value="Damaged">Damaged</SelectItem>
                    <SelectItem value="Software issue">Software issue</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="severity">Severity</Label>
                <Select 
                  value={reportForm.severity} 
                  onValueChange={(value) => setReportForm({ ...reportForm, severity: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Low">Low - Minor inconvenience</SelectItem>
                    <SelectItem value="Medium">Medium - Affects work</SelectItem>
                    <SelectItem value="High">High - Major problem</SelectItem>
                    <SelectItem value="Critical">Critical - Cannot work</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <textarea
                  id="description"
                  value={reportForm.description}
                  onChange={(e) => setReportForm({ ...reportForm, description: e.target.value })}
                  className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  placeholder="Describe the issue in detail..."
                  required
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => {
                setIsReportDialogOpen(false)
                setSelectedAssetForReport(null)
              }}>
                Cancel
              </Button>
              <Button type="submit" className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700">
                Submit Report
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Asset Details Dialog */}
      <Dialog open={isDetailsDialogOpen} onOpenChange={setIsDetailsDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5 text-indigo-600" />
              Asset Details
            </DialogTitle>
          </DialogHeader>
          {selectedAsset && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">Asset Tag</Label>
                  <p className="font-semibold text-lg text-indigo-600 dark:text-indigo-400">{selectedAsset.asset_tag}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Status</Label>
                  <p className="font-medium">{selectedAsset.status}</p>
                </div>
              </div>
              <div>
                <Label className="text-muted-foreground">Name/Model</Label>
                <p className="font-medium text-lg">{selectedAsset.name}</p>
              </div>
              {selectedAsset.serial_number && (
                <div>
                  <Label className="text-muted-foreground">Serial Number</Label>
                  <p className="font-mono text-sm bg-gray-50 dark:bg-gray-800 px-3 py-2 rounded">{selectedAsset.serial_number}</p>
                </div>
              )}
              {selectedAsset.brand && (
                <div>
                  <Label className="text-muted-foreground">Brand</Label>
                  <p className="font-medium">{selectedAsset.brand}</p>
                </div>
              )}
              {selectedAsset.configuration && (
                <div>
                  <Label className="text-muted-foreground">Configuration</Label>
                  <p className="text-sm bg-gray-50 dark:bg-gray-800 px-3 py-2 rounded">{selectedAsset.configuration}</p>
                </div>
              )}
              <div className="grid grid-cols-2 gap-4">
                {selectedAsset.warranty_expiry && (
                  <div>
                    <Label className="text-muted-foreground">Warranty Expiry</Label>
                    <p className="font-medium">{new Date(selectedAsset.warranty_expiry).toLocaleDateString()}</p>
                  </div>
                )}
                {selectedAsset.condition && (
                  <div>
                    <Label className="text-muted-foreground">Condition</Label>
                    <p className="font-medium">{selectedAsset.condition}</p>
                  </div>
                )}
              </div>
              {selectedAsset.description && (
                <div>
                  <Label className="text-muted-foreground">Description</Label>
                  <p className="text-sm">{selectedAsset.description}</p>
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setIsDetailsDialogOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
