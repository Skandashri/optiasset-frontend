"use client"

import { useState } from "react"
import { RefreshCcw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/context/AuthContext"

export function RoleSwitcher() {
    const { user } = useAuth()
    const [isSwitching, setIsSwitching] = useState(false)

    if (!user || !user.hasSecondaryRole || !user.secondaryRole || !user.role) {
        return null
    }

    const currentRole = user.role
    const secondaryRole = user.secondaryRole

    const handleRoleSwitch = async () => {
        if (isSwitching) return
        
        setIsSwitching(true)
        try {
            const token = localStorage.getItem("token")
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/users/switch-role?target_role=${encodeURIComponent(secondaryRole)}`, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`,
                },
            })

            if (!response.ok) {
                throw new Error("Failed to switch role")
            }

            const updatedUser = await response.json()
            const userData = {
                ...user,
                role: updatedUser.role.name,
                secondaryRole: updatedUser.secondary_role?.name || null,
                permissions: updatedUser.role.permissions || user.permissions,
            }

            localStorage.setItem("user", JSON.stringify(userData))
            window.location.reload()
        } catch (error) {
            console.error("Role switch error:", error)
            alert("Failed to switch role. Please try again.")
            setIsSwitching(false)
        }
    }

    const getRoleColor = (role: string) => {
        switch (role) {
            case "Super Admin":
                return "bg-purple-100 text-purple-700"
            case "Admin":
                return "bg-blue-100 text-blue-700"
            case "Employee":
                return "bg-green-100 text-green-700"
            default:
                return "bg-gray-100 text-gray-700"
        }
    }

    return (
        <Button 
            variant="outline" 
            size="sm"
            onClick={handleRoleSwitch}
            disabled={isSwitching}
            className="gap-2 border-2 border-purple-400 bg-gradient-to-r from-purple-50 to-blue-50 hover:from-purple-100 hover:to-blue-100"
        >
            <RefreshCcw className={`h-4 w-4 ${isSwitching ? 'animate-spin' : ''}`} />
            <span className="font-medium">Switch to {secondaryRole}</span>
            <span className={`px-2 py-0.5 rounded text-xs font-semibold ${getRoleColor(currentRole)}`}>
                {currentRole}
            </span>
        </Button>
    )
}
