"use client"

import { useEffect } from "react"
import { AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error("[v0] Global Error:", error)
  }, [error])

  return (
    <html>
      <body>
        <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
          <div className="text-center space-y-6">
            <div className="flex justify-center">
              <div className="rounded-full bg-destructive/10 p-6">
                <AlertTriangle className="h-16 w-16 text-destructive" />
              </div>
            </div>
            <div className="space-y-2">
              <h1 className="text-4xl font-bold tracking-tight text-foreground">Critical Error</h1>
              <h2 className="text-2xl font-semibold text-foreground">Something went wrong</h2>
              <p className="text-muted-foreground max-w-md">
                A critical error occurred. Please refresh the page or contact support if the problem persists.
              </p>
            </div>
            <div className="flex gap-4 justify-center">
              <Button onClick={reset}>Try Again</Button>
              <Button variant="outline" onClick={() => (window.location.href = "/")}>
                Go Home
              </Button>
            </div>
          </div>
        </div>
      </body>
    </html>
  )
}
