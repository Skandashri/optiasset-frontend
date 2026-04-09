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
import { ClipboardList, Search, CheckCircle, XCircle, Eye } from "lucide-react"

interface Request {
    id: string
    employee_name: string
    employee_email: string
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

    useEffect(() => {
        if (!isLoading && !user) {
            router.push("/login")
        }
        if (user) {
            fetchRequests()
        }
    }, [user, isLoading, router])

    const fetchRequests = async () => {
        // Mock data
        setRequests([
            {
                id: "1",
                employee_name: "Rahul Sharma",
                employee_email: "rahul@company.com",
                item_name: "Wireless Mouse",
                item_type: "Equipment",
                status: "Pending",
                requested_at: "2024-03-15T10:00:00Z",
                notes: "Current mouse is not working properly",
            },
            {
                id: "2",
                employee_name: "Sneha Patel",
                employee_email: "sneha@company.com",
                item_name: "Mechanical Keyboard",
                item_type: "Equipment",
                status: "Approved",
                requested_at: "2024-03-14T14:30:00Z",
                notes: "Needed for development work",
            },
            {
                id: "3",
                employee_name: "Amit Kumar",
                employee_email: "amit@company.com",
                item_name: "USB-C Hub",
                item_type: "Accessory",
                status: "Pending",
                requested_at: "2024-03-13T09:15:00Z",
            },
            {
                id: "4",
                employee_name: "Priya Singh",
                employee_email: "priya@company.com",
                item_name: "Monitor Stand",
                item_type: "Accessory",
                status: "Approved",
                requested_at: "2024-03-12T11:00:00Z",
                notes: "Ergonomic requirement",
            },
            {
                id: "5",
                employee_name: "Vikram Reddy",
                employee_email: "vikram@company.com",
                item_name: "Webcam HD",
                item_type: "Equipment",
                status: "Rejected",
                requested_at: "2024-03-10T16:20:00Z",
                notes: "Budget constraints",
            },
        ])
    }

    const handleStatusUpdate = async (requestId: string, newStatus: string) => {
        setRequests(prev =>
            prev.map(req =>
                req.id === requestId ? { ...req, status: newStatus } : req
            )
        )
        alert(`Request ${newStatus.toLowerCase()} successfully!`)
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
            req.employee_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            req.item_name.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesStatus = statusFilter === "all" || req.status === statusFilter
        return matchesSearch && matchesStatus
    })

    if (isLoading || !user) {
        return <div className="p-8">Loading...</div>
    }

    return (
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
                                                <p className="font-medium">{request.employee_name}</p>
                                                <p className="text-xs text-muted-foreground">{request.employee_email}</p>
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
                                                        className="text-green-600"
                                                        onClick={() => handleStatusUpdate(request.id, "Approved")}
                                                    >
                                                        <CheckCircle className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        className="text-red-600"
                                                        onClick={() => handleStatusUpdate(request.id, "Rejected")}
                                                    >
                                                        <XCircle className="h-4 w-4" />
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
        </div>
    )
}
