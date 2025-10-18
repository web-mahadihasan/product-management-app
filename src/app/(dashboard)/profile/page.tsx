"use client"

import { useAppSelector, useAppDispatch } from "@/lib/store/hooks"
import { logout } from "@/lib/store/slices/auth-slice"
import { Button } from "@/components/ui/button"

export default function ProfilePage() {
  const dispatch = useAppDispatch()
  const email = useAppSelector((state) => state.auth.email)

  const handleLogout = () => {
    dispatch(logout())
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Profile</h1>
        </div>
        <div className="space-y-4">
          <p className="text-lg">
            <span className="font-semibold">Email:</span> {email}
          </p>
          <Button onClick={handleLogout} variant="destructive">
            Logout
          </Button>
        </div>
      </div>
    </div>
  )
}