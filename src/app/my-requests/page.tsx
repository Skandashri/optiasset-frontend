"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
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
import { ClipboardList, PlusCircle, Search } from "lucide-react"

interface Request {
    id: string
    item_name: string
    item_type: string
    status: string
    notes?: string
    admin_notes?: string
    requested_at: string
    asset_id?: string
    user?: {
        id: string
        name: string
        email: string
    }
    asset?: {
        id: string
        name: string
        asset_tag: string
        status: string
        location?: string
    }
}

export default function MyRequestsPage() {
    const { user, isLoading } = useAuth()
    const router = useRouter()
    const [requests, setRequests] = useState<Request[]>([])
    const [searchTerm, setSearchTerm] = useState("")
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [formData, setFormData] = useState({
        item_name: "",
        item_type: "Equipment",
        notes: "",
    })

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
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'https://asset-management-system-1-cm2v.onrender.com'}/api/requests/my`, {
                headers: { Authorization: `Bearer ${token}` }
            })
            if (response.ok) {
                const data = await response.json()
                console.log("Fetched requests:", data)
                setRequests(data)
            } else {
                console.error("Failed to fetch requests:", response.status)
            }
        } catch (error) {
            console.error("Error fetching requests:", error)
        }
    }

    const handleSubmitRequest = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            const token = localStorage.getItem("token")
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'https://asset-management-system-1-cm2v.onrender.com'}/api/requests/`, {
                method: "POST",
                headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
                body: JSON.stringify(formData)
            })
            if (response.ok) {
                alert("Request submitted successfully!")
                setIsDialogOpen(false)
                setFormData({ item_name: "", item_type: "Equipment", notes: "" })
                fetchRequests()
            }
        } catch (error) {
            console.error(error)
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

    const filteredRequests = requests.filter(
        (req) =>
            req.item_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            req.status.toLowerCase().includes(searchTerm.toLowerCase())
    )

    if (isLoading || !user) {
        return <div className="p-8">Loading...</div>
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h3 className="text-3xl font-bold tracking-tight text-white">My Requests</h3>
                    <p className="text-gray-400 mt-2 text-sm">
                        Track your equipment requests and their status
                    </p>
                </div>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <Button 
                        className="transition-all hover:scale-105 hover:shadow-[0_0_30px_rgba(168,85,247,0.6)]" 
                        style={{
                            background: 'linear-gradient(135deg, #a855f7 0%, #ec4899 100%)',
                            border: '1px solid rgba(168,85,247,0.5)',
                            boxShadow: '0 4px 20px rgba(168,85,247,0.4)',
                            borderRadius: '12px',
                            padding: '12px 24px'
                        }}
                        onClick={() => setIsDialogOpen(true)}
                    >
                        <PlusCircle className="h-4 w-4 mr-2" />
                        New Request
                    </Button>
                    <DialogContent className="sm:max-w-[500px]">
                        <form onSubmit={handleSubmitRequest}>
                            <DialogHeader>
                                <DialogTitle>Submit Equipment Request</DialogTitle>
                                <DialogDescription>
                                    Request new equipment or accessories
                                </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="item_name">Item Name</Label>
                                    <Input
                                        id="item_name"
                                        value={formData.item_name}
                                        onChange={(e) => setFormData({ ...formData, item_name: e.target.value })}
                                        placeholder="e.g., Mechanical Keyboard"
                                        required
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="item_type">Item Type</Label>
                                    <Select
                                        value={formData.item_type}
                                        onValueChange={(value) => setFormData({ ...formData, item_type: value })}
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Equipment">Equipment</SelectItem>
                                            <SelectItem value="Accessory">Accessory</SelectItem>
                                            <SelectItem value="Software">Software</SelectItem>
                                            <SelectItem value="Other">Other</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="notes">Notes (Optional)</Label>
                                    <Input
                                        id="notes"
                                        value={formData.notes}
                                        onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                        placeholder="Reason for request..."
                                    />
                                </div>
                            </div>
                            <DialogFooter>
                                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                                    Cancel
                                </Button>
                                <Button type="submit">Submit Request</Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="bg-[#0b1120]/80 backdrop-blur-xl border border-purple-500/20 rounded-2xl overflow-hidden shadow-[0_0_30px_rgba(168,85,247,0.1)]">
                <div className="p-6 border-b border-purple-500/10">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-xl font-semibold text-white flex items-center gap-2">
                                <ClipboardList className="h-5 w-5 text-purple-400" />
                                Request History
                            </h3>
                            <p className="text-gray-400 text-sm mt-1">
                                {filteredRequests.length} {filteredRequests.length === 1 ? "request" : "requests"} found
                            </p>
                        </div>
                        <div className="flex items-center gap-2">
                            <Search className="h-4 w-4 text-gray-500" />
                            <Input
                                placeholder="Search requests..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-[250px] bg-[#0f172a]/80 border-purple-500/20 text-white placeholder:text-gray-500 rounded-xl"
                            />
                        </div>
                    </div>
                </div>
                <div className="p-6">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                                <TableHead className="font-semibold">Item</TableHead>
                                <TableHead className="font-semibold">Type</TableHead>
                                <TableHead className="font-semibold">Status</TableHead>
                                <TableHead className="font-semibold">Date</TableHead>
                                <TableHead className="font-semibold">Your Notes</TableHead>
                                <TableHead className="font-semibold">Admin Response</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredRequests.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                                        No requests found. Click "New Request" to submit one.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filteredRequests.map((request) => (
                                    <TableRow key={request.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/30">
                                        <TableCell className="font-medium">{request.item_name}</TableCell>
                                        <TableCell>{request.item_type}</TableCell>
                                        <TableCell>
                                            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                                                {request.status}
                                            </span>
                                        </TableCell>
                                        <TableCell>{new Date(request.requested_at).toLocaleDateString()}</TableCell>
                                        <TableCell className="max-w-[150px] truncate text-muted-foreground">
                                            {request.notes || "-"}
                                        </TableCell>
                                        <TableCell className="max-w-[300px]">
                                            {request.status === "Rejected" && request.admin_notes ? (
                                                <div className="text-red-600 dark:text-red-400 text-xs bg-red-50 dark:bg-red-900/20 p-2 rounded border border-red-200">
                                                    <strong>📝 Rejection Reason:</strong>
                                                    <p className="mt-1">{request.admin_notes}</p>
                                                </div>
                                            ) : request.status === "Approved" ? (
                                                <div className="text-green-600 dark:text-green-400 text-xs bg-green-50 dark:bg-green-900/20 p-2 rounded border border-green-200">
                                                    <strong>✅ Approved - Assignment Details:</strong>
                                                    <div className="mt-1 space-y-1">
                                                        {request.asset ? (
                                                            <>
                                                                <p><strong>Asset:</strong> {request.asset.asset_tag} - {request.asset.name}</p>
                                                                {request.asset.location && <p><strong>Location:</strong> {request.asset.location}</p>}
                                                                {request.admin_notes && <p><strong>Notes:</strong> {request.admin_notes}</p>}
                                                            </>
                                                        ) : (
                                                            <>
                                                                {request.admin_notes ? (
                                                                    <p>{request.admin_notes}</p>
                                                                ) : (
                                                                    <p>Approved - awaiting asset assignment</p>
                                                                )}
                                                            </>
                                                        )}
                                                    </div>
                                                </div>
                                            ) : (
                                                <span className="text-muted-foreground">-</span>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </div>
    )
}
