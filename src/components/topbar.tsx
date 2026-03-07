"use client"

import { useAuth } from "@/context/AuthContext"
import { ModeToggle } from "./theme-toggle"

export function Topbar() {
    const { user } = useAuth()

    if (!user) return null

    return (
        <header className="flex h-16 shrink-0 items-center justify-between border-b px-6 bg-background">
            <div className="flex items-center gap-2">
                <h2 className="text-lg font-semibold capitalize tracking-tight">
                    Welcome back, {user.name}
                </h2>
            </div>
            <div className="flex items-center gap-4">
                <div className="text-sm font-medium text-muted-foreground mr-4">
                    Role: <span className="text-primary font-bold">{user.role}</span>
                </div>
                <ModeToggle />
            </div>
        </header>
    )
}
