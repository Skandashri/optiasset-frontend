"use client"

import { useAuth } from "@/context/AuthContext"

/**
 * Custom hook to check if user has a specific permission
 * @param requiredPermission - The permission string to check (e.g., "manage:assets")
 * @returns boolean - true if user has the permission, false otherwise
 */
export function usePermission(requiredPermission: string): boolean {
    const { user } = useAuth()
    
    if (!user) return false
    
    // Admin with "all" permission has access to everything
    if (user.permissions.includes("all")) return true
    
    // Check if user has the specific permission
    return user.permissions.includes(requiredPermission)
}

/**
 * Custom hook to check if user has ANY of the provided permissions
 * @param permissions - Array of permission strings
 * @returns boolean - true if user has at least one permission
 */
export function useHasAnyPermission(permissions: string[]): boolean {
    const { user } = useAuth()
    
    if (!user) return false
    
    // Admin with "all" permission has access to everything
    if (user.permissions.includes("all")) return true
    
    // Check if user has any of the permissions
    return permissions.some(permission => user.permissions.includes(permission))
}
