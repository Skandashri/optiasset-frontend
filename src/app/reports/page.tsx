"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/context/AuthContext"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { AlertCircle, CheckCircle2, FileText, PlusCircle, Eye } from "lucide-react"

interface Asset {
    id: string
    asset_tag: string
    name: string
    status: string
}

interface Report {
    id: string
    asset_id: string
    reported_by_id: string
    report_type: string
    description: string
    severity: string
    status: string
    created_at: string
    resolved_at?: string
    admin_notes?: string
    asset?: Asset
    reported_by?: any
}

export default function ReportsPage() {
    const { user } = useAuth()
    const [reports, setReports] = useState<Report[]>([])
    const [assets, setAssets] = useState<Asset[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [selectedReport, setSelectedReport] = useState<Report | null>(null)
    
    // Form state
    const [formData, setFormData] = useState({
        asset_id: "",
        report_type: "Damaged",
        description: "",
        severity: "Medium",
    })

    const isAdmin = user?.role === "Admin" || user?.role === "Super Admin"

    useEffect(() => {
        fetchReports()
        if (!isAdmin) {
            fetchAssets()
        }
    }, [])

    const fetchReports = async () => {
        try {
            const token = localStorage.getItem("token")
            const url = isAdmin 
                ? "http://localhost:8000/api/reports/"
                : "http://localhost:8000/api/reports/my-reports"
            
            const response = await fetch(url, {
                headers: {
                    "Authorization": `Bearer ${token}`,
                },
            })
            
            if (response.ok) {
                const data = await response.json()
                setReports(data)
            } else {
                // Fallback to dummy data
                loadDummyReports()
            }
        } catch (error) {
            console.error("Failed to fetch reports, using dummy data:", error)
            loadDummyReports()
        } finally {
            setIsLoading(false)
        }
    }

    const loadDummyReports = () => {
        if (isAdmin) {
            // Admin/Super Admin sees all reports
            setReports([
                {
                    id: "1",
                    asset_id: "LP-1002",
                    reported_by_id: "emp1",
                    report_type: "Not working",
                    description: "Screen flickering issue started 2 days ago",
                    severity: "High",
                    status: "Pending",
                    created_at: "2024-03-15T10:30:00Z",
                    asset: {
                        id: "LP-1002",
                        asset_tag: "LP-1002",
                        name: "HP Pavilion 15",
                        status: "Issue Reported"
                    },
                    reported_by: { name: "Rahul Sharma", email: "rahul@company.com" }
                },
                {
                    id: "2",
                    asset_id: "MN-2002",
                    reported_by_id: "emp2",
                    report_type: "Damaged",
                    description: "Monitor stand is broken",
                    severity: "Medium",
                    status: "Under Review",
                    created_at: "2024-03-14T14:20:00Z",
                    asset: {
                        id: "MN-2002",
                        asset_tag: "MN-2002",
                        name: "LG Ultrawide 29\" Monitor",
                        status: "Issue Reported"
                    },
                    reported_by: { name: "Sneha Patel", email: "sneha@company.com" }
                },
                {
                    id: "3",
                    asset_id: "KB-3001",
                    reported_by_id: "emp3",
                    report_type: "Software issue",
                    description: "Keyboard connectivity issues with Bluetooth",
                    severity: "Low",
                    status: "Resolved",
                    created_at: "2024-03-10T09:15:00Z",
                    resolved_at: "2024-03-12T16:00:00Z",
                    admin_notes: "Repaired Bluetooth driver issue",
                    asset: {
                        id: "KB-3001",
                        asset_tag: "KB-3001",
                        name: "Logitech K380 Keyboard",
                        status: "Assigned"
                    },
                    reported_by: { name: "Amit Kumar", email: "amit@company.com" }
                },
                {
                    id: "4",
                    asset_id: "MS-4001",
                    reported_by_id: "emp4",
                    report_type: "Not working",
                    description: "Mouse left click not responding",
                    severity: "Medium",
                    status: "Pending",
                    created_at: "2024-03-16T11:45:00Z",
                    asset: {
                        id: "MS-4001",
                        asset_tag: "MS-4001",
                        name: "Logitech M331 Mouse",
                        status: "Issue Reported"
                    },
                    reported_by: { name: "Priya Singh", email: "priya@company.com" }
                },
                {
                    id: "5",
                    asset_id: "AD-6001",
                    reported_by_id: "emp5",
                    report_type: "Damaged",
                    description: "USB-C hub HDMI port not working",
                    severity: "High",
                    status: "Rejected",
                    created_at: "2024-03-08T13:30:00Z",
                    admin_notes: "Physical damage not covered under warranty",
                    asset: {
                        id: "AD-6001",
                        asset_tag: "AD-6001",
                        name: "USB-C Hub 7-in-1",
                        status: "Assigned"
                    },
                    reported_by: { name: "Vikram Reddy", email: "vikram@company.com" }
                }
            ])
        } else {
            // Employee sees only their reports
            setReports([
                {
                    id: "1",
                    asset_id: "LP-1002",
                    reported_by_id: "current_user",
                    report_type: "Not working",
                    description: "Screen flickering issue started 2 days ago",
                    severity: "High",
                    status: "Pending",
                    created_at: "2024-03-15T10:30:00Z",
                    asset: {
                        id: "LP-1002",
                        asset_tag: "LP-1002",
                        name: "HP Pavilion 15",
                        status: "Issue Reported"
                    }
                },
                {
                    id: "2",
                    asset_id: "MN-2002",
                    reported_by_id: "current_user",
                    report_type: "Damaged",
                    description: "Monitor stand is broken",
                    severity: "Medium",
                    status: "Under Review",
                    created_at: "2024-03-14T14:20:00Z",
                    asset: {
                        id: "MN-2002",
                        asset_tag: "MN-2002",
                        name: "LG Ultrawide 29\" Monitor",
                        status: "Issue Reported"
                    }
                },
                {
                    id: "3",
                    asset_id: "KB-3001",
                    reported_by_id: "current_user",
                    report_type: "Software issue",
                    description: "Keyboard connectivity issues with Bluetooth",
                    severity: "Low",
                    status: "Resolved",
                    created_at: "2024-03-10T09:15:00Z",
                    resolved_at: "2024-03-12T16:00:00Z",
                    admin_notes: "Repaired Bluetooth driver issue",
                    asset: {
                        id: "KB-3001",
                        asset_tag: "KB-3001",
                        name: "Logitech K380 Keyboard",
                        status: "Assigned"
                    }
                }
            ])
        }
    }

    const fetchAssets = async () => {
        try {
            const token = localStorage.getItem("token")
            const response = await fetch("http://localhost:8000/api/assets/", {
                headers: {
                    "Authorization": `Bearer ${token}`,
                },
            })
            
            if (response.ok) {
                const data = await response.json()
                setAssets(data)
            }
        } catch (error) {
            console.error("Failed to fetch assets:", error)
        }
    }

    const handleSubmitReport = async (e: React.FormEvent) => {
        e.preventDefault()
        
        try {
            const token = localStorage.getItem("token")
            const response = await fetch("http://localhost:8000/api/reports/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify(formData),
            })

            if (response.ok) {
                alert("Report submitted successfully!")
                setIsDialogOpen(false)
                setFormData({
                    asset_id: "",
                    report_type: "Damaged",
                    description: "",
                    severity: "Medium",
                })
                fetchReports()
            } else {
                const errorData = await response.json()
                alert(`Failed to submit report: ${errorData.detail}`)
            }
        } catch (error) {
            alert("Failed to submit report. Please try again.")
        }
    }

    const handleUpdateReport = async (id: string, status: string, notes?: string) => {
        try {
            const token = localStorage.getItem("token")
            const response = await fetch(`http://localhost:8000/api/reports/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify({
                    status,
                    admin_notes: notes,
                }),
            })

            if (response.ok) {
                alert("Report updated successfully!")
                fetchReports()
            }
        } catch (error) {
            alert("Failed to update report")
        }
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case "Pending":
                return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400"
            case "Under Review":
                return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400"
            case "Resolved":
                return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
            case "Rejected":
                return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
            default:
                return "bg-gray-100 text-gray-800"
        }
    }

    const getSeverityColor = (severity: string) => {
        switch (severity) {
            case "Low":
                return "text-green-600 bg-green-50 dark:bg-green-900/20"
            case "Medium":
                return "text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20"
            case "High":
                return "text-orange-600 bg-orange-50 dark:bg-orange-900/20"
            case "Critical":
                return "text-red-600 bg-red-50 dark:bg-red-900/20"
            default:
                return "text-gray-600 bg-gray-50"
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h3 className="text-2xl font-bold tracking-tight">Asset Reports</h3>
                    <p className="text-muted-foreground">
                        {isAdmin 
                            ? "Review and manage damaged asset reports" 
                            : "Report damaged or problematic assets"}
                    </p>
                </div>
                {!isAdmin && (
                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                        <Button 
                            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                            onClick={() => setIsDialogOpen(true)}
                        >
                            <PlusCircle className="h-4 w-4 mr-2" />
                            New Report
                        </Button>
                        <DialogContent className="sm:max-w-[500px]">
                            <form onSubmit={handleSubmitReport}>
                                <DialogHeader>
                                    <DialogTitle>Submit Asset Report</DialogTitle>
                                    <DialogDescription>
                                        Report a damaged, lost, or problematic asset
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="grid gap-4 py-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="asset_id">Asset</Label>
                                        <Select 
                                            value={formData.asset_id} 
                                            onValueChange={(value) => setFormData({ ...formData, asset_id: value })}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select an asset" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {assets.map((asset) => (
                                                    <SelectItem key={asset.id} value={asset.id}>
                                                        {asset.asset_tag} - {asset.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="report_type">Report Type</Label>
                                        <Select 
                                            value={formData.report_type} 
                                            onValueChange={(value) => setFormData({ ...formData, report_type: value })}
                                        >
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Damaged">Damaged</SelectItem>
                                                <SelectItem value="Lost">Lost</SelectItem>
                                                <SelectItem value="Stolen">Stolen</SelectItem>
                                                <SelectItem value="Maintenance Required">Maintenance Required</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="severity">Severity</Label>
                                        <Select 
                                            value={formData.severity} 
                                            onValueChange={(value) => setFormData({ ...formData, severity: value })}
                                        >
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Low">Low</SelectItem>
                                                <SelectItem value="Medium">Medium</SelectItem>
                                                <SelectItem value="High">High</SelectItem>
                                                <SelectItem value="Critical">Critical</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="description">Description</Label>
                                        <Input
                                            id="description"
                                            value={formData.description}
                                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                            placeholder="Describe the issue..."
                                            required
                                        />
                                    </div>
                                </div>
                                <DialogFooter>
                                    <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                                        Cancel
                                    </Button>
                                    <Button type="submit">Submit Report</Button>
                                </DialogFooter>
                            </form>
                        </DialogContent>
                    </Dialog>
                )}
            </div>

            <Card className="border-0 shadow-lg overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 border-b border-gray-200 dark:border-gray-700">
                    <CardTitle className="flex items-center gap-2 text-xl">
                        <FileText className="h-5 w-5 text-purple-600" />
                        {isAdmin ? "All Reports" : "My Reports"}
                    </CardTitle>
                    <CardDescription>
                        {reports.length} {reports.length === 1 ? "report" : "reports"} found
                    </CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                    {isLoading ? (
                        <div className="p-8 text-center text-muted-foreground">Loading reports...</div>
                    ) : reports.length === 0 ? (
                        <div className="p-8 text-center text-muted-foreground flex flex-col items-center gap-2">
                            <AlertCircle className="h-12 w-12" />
                            <p>No reports found</p>
                        </div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-gray-50 dark:bg-gray-800/50">
                                    <TableHead className="font-semibold">Asset</TableHead>
                                    <TableHead className="font-semibold">Type</TableHead>
                                    <TableHead className="font-semibold">Severity</TableHead>
                                    <TableHead className="font-semibold">Status</TableHead>
                                    <TableHead className="font-semibold">Date</TableHead>
                                    {isAdmin && <TableHead className="font-semibold">Actions</TableHead>}
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {reports.map((report) => (
                                    <TableRow key={report.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/30">
                                        <TableCell className="font-medium">
                                            {report.asset?.asset_tag || "Unknown"}
                                            <div className="text-xs text-muted-foreground">
                                                {report.asset?.name || ""}
                                            </div>
                                        </TableCell>
                                        <TableCell>{report.report_type}</TableCell>
                                        <TableCell>
                                            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${getSeverityColor(report.severity)}`}>
                                                {report.severity}
                                            </span>
                                        </TableCell>
                                        <TableCell>
                                            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(report.status)}`}>
                                                {report.status}
                                            </span>
                                        </TableCell>
                                        <TableCell>{new Date(report.created_at).toLocaleDateString()}</TableCell>
                                        {isAdmin && (
                                            <TableCell>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => setSelectedReport(report)}
                                                >
                                                    <Eye className="h-4 w-4" />
                                                </Button>
                                            </TableCell>
                                        )}
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>

            {/* Admin Report Details Dialog */}
            {selectedReport && (
                <Dialog open={!!selectedReport} onOpenChange={() => setSelectedReport(null)}>
                    <DialogContent className="sm:max-w-[600px]">
                        <DialogHeader>
                            <DialogTitle>Report Details</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label>Asset</Label>
                                    <p className="font-medium">{selectedReport.asset?.asset_tag}</p>
                                    <p className="text-sm text-muted-foreground">{selectedReport.asset?.name}</p>
                                </div>
                                <div>
                                    <Label>Reported By</Label>
                                    <p className="font-medium">{selectedReport.reported_by?.name || "Unknown"}</p>
                                </div>
                            </div>
                            <div>
                                <Label>Type</Label>
                                <p className="font-medium">{selectedReport.report_type}</p>
                            </div>
                            <div>
                                <Label>Severity</Label>
                                <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${getSeverityColor(selectedReport.severity)}`}>
                                    {selectedReport.severity}
                                </span>
                            </div>
                            <div>
                                <Label>Description</Label>
                                <p className="text-sm">{selectedReport.description}</p>
                            </div>
                            <div>
                                <Label>Status</Label>
                                <Select
                                    defaultValue={selectedReport.status}
                                    onValueChange={(value) => handleUpdateReport(selectedReport.id, value, selectedReport.admin_notes)}
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Pending">Pending</SelectItem>
                                        <SelectItem value="Under Review">Under Review</SelectItem>
                                        <SelectItem value="Resolved">Resolved</SelectItem>
                                        <SelectItem value="Rejected">Rejected</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <Label>Admin Notes</Label>
                                <Input
                                    defaultValue={selectedReport.admin_notes || ""}
                                    onBlur={(e) => handleUpdateReport(selectedReport.id, selectedReport.status, e.target.value)}
                                    placeholder="Add resolution notes..."
                                />
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>
            )}
        </div>
    )
}
