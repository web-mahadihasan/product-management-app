import type React from "react"
import { SidebarLayout } from "@/components/sidebar/sidebar-layout"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <SidebarLayout>{children}</SidebarLayout>
}
