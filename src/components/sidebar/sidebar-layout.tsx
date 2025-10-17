"use client"

import type React from "react"
import { AppSidebar } from "./app-sidebar"
import { useState } from "react"
import { Bell, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"

export function SidebarLayout({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false)

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <AppSidebar collapsed={collapsed} setCollapsed={setCollapsed} />

      {/* Main Content */}
      <div className={cn("flex-1 transition-all duration-300 ease-in-out", collapsed ? "ml-16" : "ml-64")}>
        {/* Top Header */}
        <header className="sticky top-0 z-30 flex h-16 items-center justify-end gap-4 border-b bg-background px-6">
          <Button variant="ghost" size="icon" className="h-9 w-9">
            <Bell className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-9 w-9">
            <Search className="h-4 w-4" />
          </Button>
          <ThemeToggle />
        </header>

        {/* Page Content */}
        <main className="p-6">{children}</main>
      </div>
    </div>
  )
}

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(" ")
}
