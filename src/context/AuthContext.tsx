"use client"

import React, { createContext, useContext, useState, useEffect } from "react"

interface User {
    id: string
    name: string
    email: string
    role: "Admin" | "Employee" | "Super Admin" | null
    permissions: string[]
    hasSecondaryRole?: boolean
    secondaryRole?: string | null
}

interface AuthContextType {
    user: User | null
    login: (userData: User, token: string) => void
    logout: () => void
    switchRole: (targetRole: string) => Promise<void>
    isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        // Check local storage for existing session
        const storedUser = localStorage.getItem("user")
        if (storedUser) {
            setUser(JSON.parse(storedUser))
        }
        setIsLoading(false)
    }, [])

    const login = (userData: User, token: string) => {
        setUser(userData)
        localStorage.setItem("user", JSON.stringify(userData))
        localStorage.setItem("token", token)
    }

    const logout = () => {
        setUser(null)
        localStorage.removeItem("user")
        localStorage.removeItem("token")
    }

    const switchRole = async (targetRole: string) => {
        if (!user) return

        const token = localStorage.getItem("token")
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'https://asset-management-system-1-cm2v.onrender.com'}/api/users/switch-role?target_role=${encodeURIComponent(targetRole)}`, {
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

        setUser(userData)
        localStorage.setItem("user", JSON.stringify(userData))
        
        // Reload to refresh all components with new permissions
        window.location.reload()
    }

    return (
        <AuthContext.Provider value={{ user, login, logout, switchRole, isLoading }}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    const context = useContext(AuthContext)
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider")
    }
    return context
}
