"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Package, Users, LogOut, ShieldAlert, ClipboardList, AlertTriangle, User } from "lucide-react"

import { useAuth } from "@/context/AuthContext"
import { usePermission } from "@/hooks/usePermission"
import { cn } from "@/lib/utils"

export function Sidebar() {
    const pathname = usePathname()
    const { user, logout } = useAuth()
    
    // Permission-based hooks
    const canViewAssets = usePermission("view:assets") || usePermission("manage:assets")
    const canManageUsers = usePermission("manage:users") || usePermission("view:users")
    const isSuperAdmin = user?.role === "Super Admin"
    const isAdmin = user?.role === "Admin"
    const isEmployee = user?.role === "Employee"

    if (!user) return null

    // Frontend RBAC: Filter links based on permissions and role
    // Super Admin: Dashboard, Inventory, Users, Requests, Reports
    const superAdminNavItems = [
        {
            title: "Dashboard",
            href: "/",
            icon: Home,
            show: true,
        },
        {
            title: "Inventory",
            href: "/inventory",
            icon: Package,
            show: canViewAssets,
        },
        {
            title: "Users",
            href: "/users",
            icon: Users,
            show: canManageUsers,
        },
        {
            title: "Requests",
            href: "/admin-requests",
            icon: ClipboardList,
            show: true,
        },
        {
            title: "Reports",
            href: "/reports",
            icon: AlertTriangle,
            show: true,
        },
    ]

    // Admin: Dashboard, Inventory, Employees, Requests, Reports
    const adminNavItems = [
        {
            title: "Dashboard",
            href: "/",
            icon: Home,
            show: true,
        },
        {
            title: "Inventory",
            href: "/inventory",
            icon: Package,
            show: canViewAssets,
        },
        {
            title: "Employees",
            href: "/users",
            icon: Users,
            show: canManageUsers,
        },
        {
            title: "Requests",
            href: "/admin-requests",
            icon: ClipboardList,
            show: true,
        },
        {
            title: "Reports",
            href: "/reports",
            icon: AlertTriangle,
            show: true,
        },
    ]

    // Employee: Dashboard, Inventory, My Requests, Report Issue, Profile
    const employeeNavItems = [
        {
            title: "Dashboard",
            href: "/",
            icon: Home,
            show: true,
        },
        {
            title: "My Assets",
            href: "/inventory",
            icon: Package,
            show: canViewAssets,
        },
        {
            title: "My Requests",
            href: "/my-requests",
            icon: ClipboardList,
            show: true,
        },
        {
            title: "Report Issue",
            href: "/reports",
            icon: AlertTriangle,
            show: true,
        },
        {
            title: "Profile",
            href: "/profile",
            icon: User,
            show: true,
        },
    ]

    // Select nav items based on role
    let navItems: typeof superAdminNavItems = []
    if (isSuperAdmin) {
        navItems = superAdminNavItems
    } else if (isAdmin) {
        navItems = adminNavItems
    } else {
        navItems = employeeNavItems
    }

    const visibleNavItems = navItems.filter((item) => item.show)

    return (
        <div className="flex w-64 flex-col border-r bg-sidebar h-screen">
            <div className="flex h-16 shrink-0 items-center border-b px-6">
                <ShieldAlert className="mr-2 h-6 w-6 text-primary" />
                <span className="font-bold text-lg text-sidebar-foreground">OptiAsset</span>
            </div>
            <div className="flex flex-1 flex-col justify-between p-4">
                <nav className="flex flex-col gap-2">
                    {visibleNavItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                                pathname === item.href
                                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                                    : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                            )}
                        >
                            <item.icon className="h-4 w-4" />
                            {item.title}
                        </Link>
                    ))}
                </nav>
                <div className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-sidebar-foreground hover:bg-destructive/10 hover:text-destructive cursor-pointer transition-colors" onClick={logout}>
                    <LogOut className="h-4 w-4" />
                    Logout
                </div>
            </div>
        </div>
    )
}
