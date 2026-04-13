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
    requested_at: string
    notes?: string
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
        // Enhanced mock data with more requests
        setRequests([
            {
                id: "1",
                item_name: "Mechanical Keyboard",
                item_type: "Equipment",
                status: "Approved",
                requested_at: "2024-01-12T10:00:00Z",
                notes: "Needed for development work",
            },
            {
                id: "2",
                item_name: "Wireless Mouse",
                item_type: "Equipment",
                status: "Pending",
                requested_at: "2024-02-20T14:30:00Z",
                notes: "Current mouse not working properly",
            },
            {
                id: "3",
                item_name: "USB-C Hub",
                item_type: "Accessory",
                status: "Rejected",
                requested_at: "2024-02-15T09:15:00Z",
                notes: "Duplicate request - already have one assigned",
            },
            {
                id: "4",
                item_name: "Monitor Stand",
                item_type: "Accessory",
                status: "Approved",
                requested_at: "2024-03-01T11:00:00Z",
                notes: "Ergonomic requirement for health",
            },
            {
                id: "5",
                item_name: "Webcam HD",
                item_type: "Equipment",
                status: "Pending",
                requested_at: "2024-03-10T16:45:00Z",
                notes: "Required for video conferences",
            },
            {
                id: "6",
                item_name: "Noise Cancelling Headphones",
                item_type: "Equipment",
                status: "Approved",
                requested_at: "2024-01-25T13:20:00Z",
                notes: "For focused work in open office",
            },
        ])
    }

    const handleSubmitRequest = async (e: React.FormEvent) => {
        e.preventDefault()
        
        // Add new request to the list
        const newRequest: Request = {
            id: String(requests.length + 1),
            item_name: formData.item_name,
            item_type: formData.item_type,
            status: "Pending",
            requested_at: new Date().toISOString(),
            notes: formData.notes,
        }
        
        setRequests([newRequest, ...requests])
        alert("✅ Request submitted successfully!")
        setIsDialogOpen(false)
        setFormData({ item_name: "", item_type: "Equipment", notes: "" })
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
                    <h3 className="text-2xl font-bold tracking-tight">My Requests</h3>
                    <p className="text-muted-foreground">
                        Track your equipment requests and their status
                    </p>
                </div>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <Button 
                        className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
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

            <Card className="border-0 shadow-lg overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle className="flex items-center gap-2 text-xl">
                                <ClipboardList className="h-5 w-5 text-purple-600" />
                                Request History
                            </CardTitle>
                            <CardDescription>
                                {filteredRequests.length} {filteredRequests.length === 1 ? "request" : "requests"} found
                            </CardDescription>
                        </div>
                        <div className="flex items-center gap-2">
                            <Search className="h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search requests..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-[250px]"
                            />
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                                <TableHead className="font-semibold">Item</TableHead>
                                <TableHead className="font-semibold">Type</TableHead>
                                <TableHead className="font-semibold">Status</TableHead>
                                <TableHead className="font-semibold">Date</TableHead>
                                <TableHead className="font-semibold">Notes</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredRequests.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                                        No requests found
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
                                        <TableCell className="max-w-[200px] truncate text-muted-foreground">
                                            {request.notes || "-"}
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
