"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAppSelector } from "@/lib/store/hooks"

export default function HomePage() {
  const router = useRouter()
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated)

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/dashboard")
    } else {
      router.push("/login")
    }
  }, [router, isAuthenticated])

  return (
    <div className="flex h-screen items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
    </div>
  )
}
