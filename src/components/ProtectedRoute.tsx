"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/AuthContext"
import { usePermission } from "@/hooks/usePermission"

interface ProtectedRouteProps {
    children: React.ReactNode
    requiredPermission?: string
    fallbackPath?: string
}

export function ProtectedRoute({ 
    children, 
    requiredPermission,
    fallbackPath = "/login"
}: ProtectedRouteProps) {
    const router = useRouter()
    const { user, isLoading } = useAuth()
    
    // Check permission if required
    const hasPermission = requiredPermission ? usePermission(requiredPermission) : true
    
    useEffect(() => {
        // Wait for auth state to load
        if (isLoading) return
        
        // Redirect to login if not authenticated
        if (!user) {
            router.push(fallbackPath)
            return
        }
        
        // Redirect to dashboard if missing permission
        if (requiredPermission && !hasPermission) {
            router.push("/")
        }
    }, [user, isLoading, requiredPermission, hasPermission, router, fallbackPath])
    
    // Show loading or nothing while checking auth/permissions
    if (isLoading || !user || (requiredPermission && !hasPermission)) {
        return null
    }
    
    return <>{children}</>
}
