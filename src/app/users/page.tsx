"use client"

import { ProtectedRoute } from "@/components/ProtectedRoute"

export default function UsersPage() {
    return (
        <ProtectedRoute requiredPermission="view:users">
            <div className="space-y-6">
                <div>
                    <h3 className="text-2xl font-bold tracking-tight">User Management</h3>
                    <p className="text-muted-foreground">
                        Manage system users, roles, and access controls.
                    </p>
                </div>

                <div className="rounded-md border bg-card p-8 text-center text-muted-foreground">
                    User Directory Table will be displayed here.
                </div>
            </div>
        </ProtectedRoute>
    )
}
