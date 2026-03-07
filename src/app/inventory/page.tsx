"use client"

import { ProtectedRoute } from "@/components/ProtectedRoute"

export default function InventoryPage() {
    return (
        <ProtectedRoute requiredPermission="view:assets">
            <div className="space-y-6">
                <div>
                    <h3 className="text-2xl font-bold tracking-tight">Inventory Management</h3>
                    <p className="text-muted-foreground">
                        Manage system inventory and track assets.
                    </p>
                </div>

                <div className="rounded-md border bg-card p-8 text-center text-muted-foreground">
                    Inventory Management Table will be displayed here.
                </div>
            </div>
        </ProtectedRoute>
    )
}
