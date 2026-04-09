"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ShieldAlert, Lock, Mail, Sparkles, ArrowRight, Eye, EyeOff, Check } from "lucide-react"

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
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const [rememberMe, setRememberMe] = useState(false)

    // Redirect to dashboard if already logged in
    useEffect(() => {
        if (user) {
            router.push("/")
        }
        
        // Load remembered credentials
        const rememberedEmail = localStorage.getItem("remembered_email")
        const shouldRemember = localStorage.getItem("remember_me") === "true"
        if (rememberedEmail && shouldRemember) {
            setEmail(rememberedEmail)
            setRememberMe(true)
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
                const errorData = await response.json()
                throw new Error(errorData.detail || "Invalid email or password")
            }

            const data = await response.json()

            const userData = {
                id: data.user_id,
                name: data.name || "User",
                email: data.email || email,
                role: data.role || "Employee",
                permissions: data.permissions || [],
                hasSecondaryRole: data.has_secondary_role || false,
                secondaryRole: data.secondary_role || null,
            }

            // Handle remember me
            if (rememberMe) {
                localStorage.setItem("remembered_email", email)
                localStorage.setItem("remember_me", "true")
            } else {
                localStorage.removeItem("remembered_email")
                localStorage.removeItem("remember_me")
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
        <div className="min-h-screen w-full relative overflow-hidden bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center p-4">
            {/* Animated Background Elements */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-white/5 rounded-full blur-3xl animate-pulse delay-500"></div>
                
                {/* Blue Light Beams Animation */}
                <div className="absolute top-0 left-1/4 w-1 h-full bg-gradient-to-b from-transparent via-blue-400/30 to-transparent animate-pulse" style={{ animationDuration: '3s' }}></div>
                <div className="absolute top-0 right-1/3 w-1 h-full bg-gradient-to-b from-transparent via-cyan-400/30 to-transparent animate-pulse" style={{ animationDuration: '4s', animationDelay: '1s' }}></div>
                
                {/* Moving Light Orbs */}
                <div className="absolute w-32 h-32 bg-blue-400/20 rounded-full blur-3xl animate-bounce" style={{ animationDuration: '8s', top: '20%', left: '10%' }}></div>
                <div className="absolute w-40 h-40 bg-cyan-400/20 rounded-full blur-3xl animate-bounce" style={{ animationDuration: '10s', top: '70%', right: '15%', animationDelay: '2s' }}></div>
            </div>

            {/* Glassmorphism Card */}
            <Card className="w-full max-w-md relative z-10 backdrop-blur-xl bg-white/95 dark:bg-gray-900/95 shadow-2xl border-white/20 animate-in fade-in zoom-in duration-500">
                <CardHeader className="space-y-3 pb-6">
                    <div className="flex justify-center mb-4">
                        <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full blur-lg opacity-75 animate-pulse"></div>
                            <div className="relative bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full p-4 shadow-xl">
                                <ShieldAlert className="h-12 w-12 text-white" />
                            </div>
                        </div>
                    </div>
                    <div className="text-center space-y-2">
                        <CardTitle className="text-3xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                            Welcome to OptiAsset
                        </CardTitle>
                        <CardDescription className="text-base text-gray-600 dark:text-gray-300">
                            Secure Asset Management System
                        </CardDescription>
                    </div>
                </CardHeader>
                <form onSubmit={handleLogin}>
                    <CardContent className="space-y-5">
                        {error && (
                            <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm font-medium flex items-center gap-2">
                                <Lock className="h-4 w-4" />
                                {error}
                            </div>
                        )}
                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-sm font-semibold text-gray-700 dark:text-gray-200 flex items-center gap-2">
                                <Mail className="h-4 w-4" />
                                Email Address
                            </Label>
                            <div className="relative">
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="admin@optiasset.com"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="pl-10 h-11 border-gray-300 dark:border-gray-600 focus:border-indigo-500 focus:ring-indigo-500 transition-all"
                                />
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password" className="text-sm font-semibold text-gray-700 dark:text-gray-200 flex items-center gap-2">
                                <Lock className="h-4 w-4" />
                                Password
                            </Label>
                            <div className="relative">
                                <Input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="••••••••"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="pl-10 pr-10 h-11 border-gray-300 dark:border-gray-600 focus:border-indigo-500 focus:ring-indigo-500 transition-all"
                                />
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                                >
                                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </button>
                            </div>
                            <div className="flex items-center gap-2 mt-2">
                                <input
                                    type="checkbox"
                                    id="remember"
                                    checked={rememberMe}
                                    onChange={(e) => setRememberMe(e.target.checked)}
                                    className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                />
                                <label htmlFor="remember" className="text-sm text-gray-600 dark:text-gray-400 cursor-pointer">
                                    Remember me
                                </label>
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter className="flex flex-col space-y-4 pt-2">
                        <Button 
                            className="w-full h-11 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none" 
                            type="submit" 
                            disabled={loading}
                        >
                            {loading ? (
                                <span className="flex items-center gap-2">
                                    <Sparkles className="h-4 w-4 animate-spin" />
                                    Authenticating...
                                </span>
                            ) : (
                                <span className="flex items-center gap-2">
                                    Sign In
                                    <ArrowRight className="h-4 w-4" />
                                </span>
                            )}
                        </Button>
                        <div className="w-full bg-gradient-to-r from-transparent via-gray-200 dark:via-gray-700 to-transparent h-px my-2"></div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 text-center space-y-3">
                            <p className="font-medium">Demo Credentials:</p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div className="bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 rounded-lg p-3 border border-purple-200 dark:border-purple-800">
                                    <p className="font-semibold text-purple-700 dark:text-purple-400 mb-1">👑 Super Admin:</p>
                                    <p className="text-xs">superadmin@optiasset.com</p>
                                    <p className="text-xs font-mono">superadmin123</p>
                                </div>
                                <div className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-lg p-3 border border-blue-200 dark:border-blue-800">
                                    <p className="font-semibold text-blue-700 dark:text-blue-400 mb-1">🔧 Admin:</p>
                                    <p className="text-xs">admin@optiasset.com</p>
                                    <p className="text-xs font-mono">admin123</p>
                                </div>
                                <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg p-3 border border-green-200 dark:border-green-800 sm:col-span-2">
                                    <p className="font-semibold text-green-700 dark:text-green-400 mb-1">👤 Employee:</p>
                                    <p className="text-xs">employee@optiasset.com</p>
                                    <p className="text-xs font-mono">employee123</p>
                                </div>
                            </div>
                        </div>
                    </CardFooter>
                </form>
            </Card>
        </div>
    )
}
