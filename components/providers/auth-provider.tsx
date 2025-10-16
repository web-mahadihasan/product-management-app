"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { useAppSelector, useAppDispatch } from "@/lib/store/hooks"
import { restoreAuth } from "@/lib/store/slices/auth-slice"

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const dispatch = useAppDispatch()
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem("token")
    const email = localStorage.getItem("email")

    if (token && email) {
      dispatch(restoreAuth({ token, email }))
    }
    setIsLoading(false)
  }, [dispatch])

  useEffect(() => {
    if (isLoading) return

    const isAuthRoute = pathname === "/login"
    const isProtectedRoute = !isAuthRoute

    if (!isAuthenticated && isProtectedRoute) {
      router.push("/login")
    } else if (isAuthenticated && isAuthRoute) {
      router.push("/dashboard")
    }
  }, [isAuthenticated, pathname, router, isLoading])

  if (isLoading || (!isAuthenticated && pathname !== "/login")) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    )
  }

  return <>{children}</>
}
