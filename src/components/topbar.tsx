"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/context/AuthContext"
import { ModeToggle } from "./theme-toggle"
import { RoleSwitcher } from "./RoleSwitcher"
import { Bell, Check, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface Notification {
  id: string
  message: string
  type: "success" | "info" | "warning"
  read: boolean
  timestamp: string
}

export function Topbar() {
    const { user } = useAuth()
    const [notifications, setNotifications] = useState<Notification[]>([])
    const [unreadCount, setUnreadCount] = useState(0)

    useEffect(() => {
        // Mock notifications - will be replaced with real API
        const mockNotifications: Notification[] = [
            {
                id: "1",
                message: "Your request for Keyboard has been approved",
                type: "success",
                read: false,
                timestamp: "2024-03-15T10:30:00Z",
            },
            {
                id: "2",
                message: "MacBook Air M2 has been assigned to you",
                type: "info",
                read: false,
                timestamp: "2024-03-14T15:20:00Z",
            },
            {
                id: "3",
                message: "Your issue report for Dell Monitor has been resolved",
                type: "success",
                read: true,
                timestamp: "2024-03-13T09:00:00Z",
            },
        ]
        setNotifications(mockNotifications)
        setUnreadCount(mockNotifications.filter(n => !n.read).length)
    }, [])

    const markAsRead = (id: string) => {
        setNotifications(prev =>
            prev.map(n => n.id === id ? { ...n, read: true } : n)
        )
        setUnreadCount(prev => Math.max(0, prev - 1))
    }

    const markAllAsRead = () => {
        setNotifications(prev => prev.map(n => ({ ...n, read: true })))
        setUnreadCount(0)
    }

    const getNotificationIcon = (type: string) => {
        switch (type) {
            case "success":
                return <Check className="h-4 w-4 text-green-600" />
            case "warning":
                return <Bell className="h-4 w-4 text-yellow-600" />
            default:
                return <Bell className="h-4 w-4 text-blue-600" />
        }
    }

    if (!user) return null

    return (
        <header className="flex h-16 shrink-0 items-center justify-between border-b px-6 bg-background">
            <div className="flex items-center gap-2">
                <h2 className="text-lg font-semibold capitalize tracking-tight">
                    Welcome back, {user.name}
                </h2>
            </div>
            <div className="flex items-center gap-3">
                {/* Notifications */}
                <DropdownMenu>
                    <DropdownMenuTrigger>
                        <div className="relative p-2 hover:bg-accent rounded-md transition-colors cursor-pointer">
                            <Bell className="h-5 w-5" />
                            {unreadCount > 0 && (
                                <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-600 text-white text-xs flex items-center justify-center font-bold">
                                    {unreadCount}
                                </span>
                            )}
                        </div>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-80">
                        <div className="flex items-center justify-between p-3 border-b">
                            <h3 className="font-semibold">Notifications</h3>
                            {unreadCount > 0 && (
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={markAllAsRead}
                                    className="text-xs"
                                >
                                    Mark all as read
                                </Button>
                            )}
                        </div>
                        <div className="max-h-96 overflow-y-auto">
                            {notifications.length === 0 ? (
                                <div className="p-4 text-center text-muted-foreground text-sm">
                                    No notifications
                                </div>
                            ) : (
                                notifications.map((notification) => (
                                    <DropdownMenuItem
                                        key={notification.id}
                                        className={`p-3 cursor-pointer ${!notification.read ? 'bg-blue-50 dark:bg-blue-900/20' : ''}`}
                                        onClick={() => markAsRead(notification.id)}
                                    >
                                        <div className="flex gap-3">
                                            {getNotificationIcon(notification.type)}
                                            <div className="flex-1">
                                                <p className="text-sm">{notification.message}</p>
                                                <p className="text-xs text-muted-foreground mt-1">
                                                    {new Date(notification.timestamp).toLocaleDateString()}
                                                </p>
                                            </div>
                                        </div>
                                    </DropdownMenuItem>
                                ))
                            )}
                        </div>
                    </DropdownMenuContent>
                </DropdownMenu>

                <RoleSwitcher />
                <ModeToggle />
            </div>
        </header>
    )
}
