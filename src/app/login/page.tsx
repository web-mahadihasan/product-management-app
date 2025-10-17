"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Package } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAppDispatch } from "@/lib/store/hooks"
import { login } from "@/lib/store/slices/auth-slice"
import { useToast } from "@/hooks/use-toast"
import { loginSchema } from "@/lib/validations/auth"
import { z } from "zod"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()
  const dispatch = useAppDispatch()
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    try {
      loginSchema.parse({ email })
    } catch (err) {
      if (err instanceof z.ZodError) {
        const errorMessage = err.errors[0]?.message || "Invalid email"
        setError(errorMessage)
        toast({
          title: "Validation Error",
          description: errorMessage,
          variant: "destructive",
        })
        return
      }
    }

    setLoading(true)
    try {
      await dispatch(login(email)).unwrap()
      toast({
        title: "Success",
        description: "Logged in successfully",
      })
      router.push("/dashboard")
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to login. Please check your email."
      setError(errorMessage)
      toast({
        title: "Authentication Failed",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-md space-y-8 rounded-xl border border-border bg-card p-8 shadow-lg">
        <div className="flex flex-col items-center space-y-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary">
            <Package className="h-7 w-7 text-primary-foreground" />
          </div>
          <div className="space-y-2 text-center">
            <h1 className="text-2xl font-bold tracking-tight text-foreground">Welcome Back</h1>
            <p className="text-sm text-muted-foreground">Sign in to your ProductHub account</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value)
                setError("")
              }}
              disabled={loading}
              className="h-11"
              aria-invalid={!!error}
            />
            {error && <p className="text-sm text-destructive">{error}</p>}
          </div>

          <Button type="submit" className="h-11 w-full" disabled={loading}>
            {loading ? "Signing in..." : "Sign In"}
          </Button>
        </form>

        <p className="text-center text-sm text-muted-foreground">
          {"Don't have an account? "}
          <span className="font-medium text-foreground">Contact admin</span>
        </p>
      </div>
    </div>
  )
}
