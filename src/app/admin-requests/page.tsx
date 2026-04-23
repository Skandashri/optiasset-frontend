"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/AuthContext"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { ClipboardList, Search, CheckCircle, XCircle, Eye } from "lucide-react"

interface Request {
    id: string
    user?: {
        name: string
        email: string
    }
    item_name: string
    item_type: string
    status: string
    requested_at: string
    notes?: string
}

export default function AdminRequestsPage() {
    const { user, isLoading } = useAuth()
    const router = useRouter()
    const [requests, setRequests] = useState<Request[]>([])
    const [searchTerm, setSearchTerm] = useState("")
    const [statusFilter, setStatusFilter] = useState("all")
    
    const [isApproveOpen, setIsApproveOpen] = useState(false)
    const [isRejectOpen, setIsRejectOpen] = useState(false)
    const [activeRequest, setActiveRequest] = useState<Request | null>(null)
    const [rejectReason, setRejectReason] = useState("")
    const [approveNotes, setApproveNotes] = useState("")
    const [selectedAssetId, setSelectedAssetId] = useState("")
    const [availableAssets, setAvailableAssets] = useState<any[]>([])

    useEffect(() => {
        if (!isLoading && !user) {
            router.push("/login")
        }
        if (user) {
            fetchRequests()
        }
    }, [user, isLoading, router])

    const fetchRequests = async () => {
        try {
            const token = localStorage.getItem("token")
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/requests/`, {
                headers: { Authorization: `Bearer ${token}` }
            })
            if (response.ok) {
                setRequests(await response.json())
            }
        } catch (error) {
            console.error(error)
        }
    }

    const fetchAvailableAssets = async () => {
        try {
            const token = localStorage.getItem("token")
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/assets/?status=Available`, {
                headers: { Authorization: `Bearer ${token}` }
            })
            if (res.ok) setAvailableAssets(await res.json())
        } catch(e) {}
    }

    const handleApprove = async () => {
        if (!activeRequest || !selectedAssetId) {
            alert("Please select an asset to assign.")
            return
        }
        try {
            const token = localStorage.getItem("token")
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/requests/${activeRequest.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                body: JSON.stringify({ 
                    status: "Approved", 
                    asset_id: selectedAssetId,
                    admin_notes: approveNotes || "Request approved and asset assigned."
                })
            })
            if (response.ok) {
                alert("Request approved and asset assigned!")
                setIsApproveOpen(false)
                setApproveNotes("")
                fetchRequests()
            } else {
                const err = await response.json()
                alert(`Error: ${err.detail}`)
            }
        } catch(e) {
            console.error("Error approving request:", e)
        }
    }

    const handleReject = async () => {
        if (!activeRequest || !rejectReason.trim()) {
            alert("Reason is required to reject a request.")
            return
        }
        try {
            const token = localStorage.getItem("token")
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/requests/${activeRequest.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                body: JSON.stringify({ status: "Rejected", admin_notes: rejectReason })
            })
            if (response.ok) {
                alert("Request rejected.")
                setIsRejectOpen(false)
                fetchRequests()
            } else {
                const err = await response.json()
                alert(`Error: ${err.detail}`)
            }
        } catch(e) {}
    }

    const openApproveModal = (req: Request) => {
        setActiveRequest(req)
        setApproveNotes("")
        fetchAvailableAssets()
        setIsApproveOpen(true)
    }

    const openRejectModal = (req: Request) => {
        setActiveRequest(req)
        setRejectReason("")
        setIsRejectOpen(true)
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

    const filteredRequests = requests.filter((req) => {
        const matchesSearch =
            (req.user?.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
            req.item_name.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesStatus = statusFilter === "all" || req.status === statusFilter
        return matchesSearch && matchesStatus
    })

    if (isLoading || !user) {
        return <div className="p-8">Loading...</div>
    }

    return (
        <div style={{background: 'linear-gradient(135deg, #0a0f1c 0%, #111827 50%, #0f172a 100%)', minHeight: '100vh', padding: '2rem'}}>
        <div className="space-y-6">
            <div>
                <h3 className="text-2xl font-bold tracking-tight">Equipment Requests</h3>
                <p className="text-muted-foreground">
                    Manage and approve employee equipment requests
                </p>
            </div>

            <Card className="border-0 shadow-lg overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle className="flex items-center gap-2 text-xl">
                                <ClipboardList className="h-5 w-5 text-purple-600" />
                                All Requests
                            </CardTitle>
                            <CardDescription>
                                {filteredRequests.length} {filteredRequests.length === 1 ? "request" : "requests"} found
                            </CardDescription>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="flex items-center gap-2">
                                <Search className="h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-[250px]"
                                />
                            </div>
                            <Select value={statusFilter} onValueChange={setStatusFilter}>
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Filter by status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Status</SelectItem>
                                    <SelectItem value="Pending">Pending</SelectItem>
                                    <SelectItem value="Approved">Approved</SelectItem>
                                    <SelectItem value="Rejected">Rejected</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                                <TableHead className="font-semibold">Employee</TableHead>
                                <TableHead className="font-semibold">Item</TableHead>
                                <TableHead className="font-semibold">Type</TableHead>
                                <TableHead className="font-semibold">Status</TableHead>
                                <TableHead className="font-semibold">Date</TableHead>
                                <TableHead className="font-semibold">Notes</TableHead>
                                <TableHead className="text-right font-semibold">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredRequests.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                                        No requests found
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filteredRequests.map((request) => (
                                    <TableRow key={request.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/30">
                                        <TableCell>
                                            <div>
                                                <p className="font-medium">{request.user?.name}</p>
                                                <p className="text-xs text-muted-foreground">{request.user?.email}</p>
                                            </div>
                                        </TableCell>
                                        <TableCell className="font-medium">{request.item_name}</TableCell>
                                        <TableCell>{request.item_type}</TableCell>
                                        <TableCell>
                                            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                                                {request.status}
                                            </span>
                                        </TableCell>
                                        <TableCell>{new Date(request.requested_at).toLocaleDateString()}</TableCell>
                                        <TableCell className="max-w-[200px] truncate text-muted-foreground">
                                            {request.notes || "-"}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            {request.status === "Pending" && (
                                                <div className="flex justify-end gap-2">
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        className="text-green-700 bg-green-50 hover:bg-green-100 border-green-200"
                                                        onClick={() => openApproveModal(request)}
                                                    >
                                                        Approve
                                                    </Button>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        className="text-red-700 bg-red-50 hover:bg-red-100 border-red-200"
                                                        onClick={() => openRejectModal(request)}
                                                    >
                                                        Reject
                                                    </Button>
                                                </div>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            <Dialog open={isApproveOpen} onOpenChange={setIsApproveOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Approve Request</DialogTitle>
                        <DialogDescription>Select an available asset to assign to {activeRequest?.user?.name}.</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label>Select Asset to Assign</Label>
                            <Select value={selectedAssetId} onValueChange={setSelectedAssetId}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Choose an asset..." />
                                </SelectTrigger>
                                <SelectContent>
                                    {availableAssets.map((asset) => (
                                        <SelectItem key={asset.id} value={asset.id}>
                                            {asset.asset_tag} - {asset.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="approveNotes">Admin Notes (Optional)</Label>
                            <Input
                                id="approveNotes"
                                value={approveNotes}
                                onChange={(e) => setApproveNotes(e.target.value)}
                                placeholder="Add approval notes..."
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsApproveOpen(false)}>Cancel</Button>
                        <Button className="bg-green-600 hover:bg-green-700" onClick={handleApprove}>Confirm Approval</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Dialog open={isRejectOpen} onOpenChange={setIsRejectOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className="text-red-600">Reject Request</DialogTitle>
                        <DialogDescription>Please provide a mandatory reason for rejecting this request.</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <Label>Admin Notes / Reason</Label>
                        <Input 
                            value={rejectReason} 
                            onChange={(e) => setRejectReason(e.target.value)} 
                            placeholder="Enter Reason Here ________"
                            required
                        />
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsRejectOpen(false)}>Cancel</Button>
                        <Button className="bg-red-600 hover:bg-red-700" onClick={handleReject}>Reject Request</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
        </div>
    )
}
