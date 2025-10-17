"use client"

import type React from "react"
import { AppSidebar } from "./app-sidebar"
import { useState } from "react"
import { Menu, Package, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import Link from "next/link"

export function SidebarLayout({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false)
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <AppSidebar
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        mobileSidebarOpen={mobileSidebarOpen}
        setMobileSidebarOpen={setMobileSidebarOpen}
      />

      {/* Main Content */}
      <div className={cn("flex-1 transition-all duration-300 ease-in-out", collapsed ? "lg:ml-16" : "lg:ml-64")}>
        {/* Top Header */}
        <header className="sticky top-0 z-30 flex h-14 items-center justify-between gap-4 border-b bg-background px-6">
          <div className="flex items-center gap-4 flex-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-10 w-10 p-0 lg:hidden"
              onClick={() => setMobileSidebarOpen(true)}
            >
              <Menu className="size-7" />
            </Button>
          </div>
          <div className="flex-1 flex justify-center lg:hidden">
            <Link href="/dashboard" className="flex items-center gap-2 overflow-hidden">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary">
                <Package className="h-5 w-5 text-primary-foreground" />
              </div>
             <span className="hidden md:flex text-lg font-semibold whitespace-nowrap">ProductHub</span>
            </Link>
          </div>
          <div className="flex flex-1 items-center gap-4 justify-end">
            <Button variant="ghost" size="icon" className="h-9 w-9">
              <Search className="h-4 w-4" />
            </Button>
            <ThemeToggle />
          </div>
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
