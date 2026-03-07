"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ShieldAlert } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/context/AuthContext"

export default function LoginPage() {
    const router = useRouter()
    const { login, user } = useAuth()
    const [email, setEmail] = useState("admin@optiasset.com")
    const [password, setPassword] = useState("admin123")
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)

    // Redirect to dashboard if already logged in
    useEffect(() => {
        if (user) {
            router.push("/")
        }
    }, [user, router])

    if (user) {
        return <div className="p-8">Redirecting to dashboard...</div>
    }

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setError("")
        setLoading(true)

        try {
            const formData = new URLSearchParams()
            formData.append("username", email)
            formData.append("password", password)

            const response = await fetch("http://localhost:8000/api/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
                body: formData,
            })

            if (!response.ok) {
                throw new Error("Invalid email or password")
            }

            const data = await response.json()

            const userData = {
                id: data.user_id,
                name: data.name || "User",
                email: data.email || email,
                role: data.role || "Employee",
                permissions: data.permissions || [],
            }

            login(userData, data.access_token)
            router.push("/")
        } catch (err: any) {
            setError(err.message || "An error occurred during login")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="flex h-screen w-full items-center justify-center bg-muted/40 absolute top-0 left-0 z-50">
            <Card className="w-full max-w-sm">
                <CardHeader className="space-y-1">
                    <div className="flex justify-center mb-6 mt-4">
                        <ShieldAlert className="h-12 w-12 text-primary" />
                    </div>
                    <CardTitle className="text-2xl text-center">OptiAsset</CardTitle>
                    <CardDescription className="text-center">
                        Enter your email and password to access the vault.
                    </CardDescription>
                </CardHeader>
                <form onSubmit={handleLogin}>
                    <CardContent className="grid gap-4">
                        {error && <div className="text-sm font-medium text-destructive text-center">{error}</div>}
                        <div className="grid gap-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="m@example.com"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                    </CardContent>
                    <CardFooter className="flex flex-col">
                        <Button className="w-full" type="submit" disabled={loading}>
                            {loading ? "Authenticating..." : "Sign in"}
                        </Button>
                        <div className="mt-4 text-xs text-muted-foreground text-center">
                            Hint: admin@optiasset.com / admin123<br />
                            Employee: employee@optiasset.com / employee123
                        </div>
                    </CardFooter>
                </form>
            </Card>
        </div>
    )
}
