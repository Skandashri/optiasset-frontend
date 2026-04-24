"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/AuthContext"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { User, Mail, Phone, Building, Save, Upload, IdCard, Briefcase } from "lucide-react"

export default function ProfilePage() {
    const { user, isLoading } = useAuth()
    const router = useRouter()
    const [isEditing, setIsEditing] = useState(false)
    const [formData, setFormData] = useState({
        full_name: "",
        email: "",
        phone: "",
        department: "",
        employee_id: "",
        designation: "",
        profile_photo: null as File | null,
    })
    const [photoPreview, setPhotoPreview] = useState<string>("")

    useEffect(() => {
        if (!isLoading && !user) {
            router.push("/login")
        }
        if (user) {
            setFormData({
                full_name: user.name || "",
                email: user.email || "",
                phone: (user as any).phone || "",
                department: (user as any).department || "",
                employee_id: (user as any).employee_id || "",
                designation: (user as any).designation || "",
                profile_photo: null,
            })
        }
    }, [user, isLoading, router])

    const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            setFormData({ ...formData, profile_photo: file })
            const reader = new FileReader()
            reader.onloadend = () => {
                setPhotoPreview(reader.result as string)
            }
            reader.readAsDataURL(file)
        }
    }

    const handleSave = async () => {
        try {
            const token = localStorage.getItem("token")
            
            // For now, just update localStorage (backend endpoint would need to be created)
            const updatedUser = {
                ...user,
                name: formData.full_name,
                email: formData.email,
                department: formData.department,
                phone: formData.phone,
                employee_id: formData.employee_id,
                designation: formData.designation,
            }
            
            localStorage.setItem("user", JSON.stringify(updatedUser))
            alert("Profile updated successfully!")
            setIsEditing(false)
            
            // In production, you would send this to the backend:
            // const formDataToSend = new FormData()
            // Object.keys(formData).forEach(key => {
            //     if (formData[key as keyof typeof formData]) {
            //         formDataToSend.append(key, formData[key as keyof typeof formData] as any)
            //     }
            // })
            // const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'https://asset-management-system-1-cm2v.onrender.com'}/api/users/profile`, {
            //     method: "PUT",
            //     headers: { "Authorization": `Bearer ${token}` },
            //     body: formDataToSend,
            // })
            
        } catch (error) {
            alert("Failed to update profile. Please try again.")
        }
    }

    if (isLoading || !user) {
        return <div className="p-8">Loading...</div>
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h3 className="text-2xl font-bold tracking-tight">Profile Settings</h3>
                    <p className="text-muted-foreground">
                        Manage your account information and preferences
                    </p>
                </div>
                <Button
                    onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                    className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                >
                    <Save className="h-4 w-4 mr-2" />
                    {isEditing ? "Save Changes" : "Edit Profile"}
                </Button>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                {/* Profile Photo & Personal Info */}
                <Card className="border-0 shadow-lg">
                    <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 border-b border-gray-200 dark:border-gray-700">
                        <CardTitle className="flex items-center gap-2">
                            <User className="h-5 w-5 text-purple-600" />
                            Personal Information
                        </CardTitle>
                        <CardDescription>
                            Your basic account details
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="p-6 space-y-4">
                        {/* Profile Photo Upload */}
                        <div className="flex flex-col items-center space-y-4">
                            <div className="relative">
                                {photoPreview ? (
                                    <img
                                        src={photoPreview}
                                        alt="Profile"
                                        className="w-32 h-32 rounded-full object-cover border-4 border-purple-200 dark:border-purple-800"
                                    />
                                ) : (
                                    <div className="w-32 h-32 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white text-4xl font-bold border-4 border-purple-200 dark:border-purple-800">
                                        {formData.full_name ? formData.full_name.charAt(0).toUpperCase() : "U"}
                                    </div>
                                )}
                            </div>
                            {isEditing && (
                                <div className="flex items-center gap-2">
                                    <Input
                                        type="file"
                                        accept="image/*"
                                        onChange={handlePhotoChange}
                                        className="max-w-[250px]"
                                    />
                                </div>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="full_name">Full Name</Label>
                            <div className="flex items-center gap-2">
                                <User className="h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="full_name"
                                    value={formData.full_name}
                                    onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                                    disabled={!isEditing}
                                    placeholder="John Doe"
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">Email Address</Label>
                            <div className="flex items-center gap-2">
                                <Mail className="h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    disabled={!isEditing}
                                    placeholder="john@company.com"
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Work Information */}
                <Card className="border-0 shadow-lg">
                    <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 border-b border-gray-200 dark:border-gray-700">
                        <CardTitle className="flex items-center gap-2">
                            <Building className="h-5 w-5 text-blue-600" />
                            Work Information
                        </CardTitle>
                        <CardDescription>
                            Your professional details
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="p-6 space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="employee_id">Employee ID</Label>
                            <div className="flex items-center gap-2">
                                <IdCard className="h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="employee_id"
                                    value={formData.employee_id}
                                    onChange={(e) => setFormData({ ...formData, employee_id: e.target.value })}
                                    disabled={!isEditing}
                                    placeholder="e.g., EMP-2024-001"
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="designation">Designation</Label>
                            <div className="flex items-center gap-2">
                                <Briefcase className="h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="designation"
                                    value={formData.designation}
                                    onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                                    disabled={!isEditing}
                                    placeholder="e.g., Software Engineer"
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="department">Department</Label>
                            <Select
                                value={formData.department}
                                onValueChange={(value) => setFormData({ ...formData, department: value })}
                                disabled={!isEditing}
                            >
                                <SelectTrigger>
                                    <div className="flex items-center gap-2">
                                        <Building className="h-4 w-4 text-muted-foreground" />
                                        <SelectValue placeholder="Select Department" />
                                    </div>
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Engineering">Engineering</SelectItem>
                                    <SelectItem value="Marketing">Marketing</SelectItem>
                                    <SelectItem value="Sales">Sales</SelectItem>
                                    <SelectItem value="HR">Human Resources</SelectItem>
                                    <SelectItem value="Finance">Finance</SelectItem>
                                    <SelectItem value="Operations">Operations</SelectItem>
                                    <SelectItem value="IT">IT Support</SelectItem>
                                    <SelectItem value="Design">Design</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="phone">Phone Number</Label>
                            <div className="flex items-center gap-2">
                                <Phone className="h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="phone"
                                    type="tel"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    disabled={!isEditing}
                                    placeholder="+1 234 567 8900"
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Account Information */}
            <Card className="border-0 shadow-lg">
                <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 border-b border-gray-200 dark:border-gray-700">
                    <CardTitle>Account Information</CardTitle>
                    <CardDescription>
                        Your account details and role
                    </CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label className="text-muted-foreground">Role</Label>
                            <p className="font-medium text-lg">{user.role}</p>
                        </div>
                        <div>
                            <Label className="text-muted-foreground">Account Status</Label>
                            <p className="font-medium text-lg">
                                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
                                    Active
                                </span>
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
