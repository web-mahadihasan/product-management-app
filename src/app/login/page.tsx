"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Package } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAppDispatch } from "@/lib/store/hooks"
import { setAuth } from "@/lib/store/slices/auth-slice"
import { toast } from "react-hot-toast"
import { loginSchema } from "@/lib/validations/auth"
import { z } from "zod"
import { useAppMutation } from "@/hooks/use-app-mutation"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [error, setError] = useState("")
  const router = useRouter()
  const dispatch = useAppDispatch()

  const { mutate: login, isPending: loading } = useAppMutation<
    { token: string },
    any,
    { email: string }
  >({
    url: "/auth/login",
    onSuccess: (data) => {
      dispatch(setAuth({ token: data.token, email }))
      toast.success("Logged in successfully")
      router.push("/dashboard")
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.message || "Failed to login. Please try with valid email."
      setError(errorMessage)
      toast.error(errorMessage)
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    try {
      loginSchema.parse({ email })
    } catch (err) {
      if (err instanceof z.ZodError) {
        const errorMessage = err.errors[0]?.message || "Invalid email"
        setError(errorMessage)
        toast.error(errorMessage)
        return
      }
    }
    login({ email })
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
