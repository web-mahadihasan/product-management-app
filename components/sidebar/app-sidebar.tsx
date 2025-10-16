"use client"
import { LayoutDashboard, Package, Tag, BarChart3, Settings, ChevronLeft, ChevronRight, LogOut } from "lucide-react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useAppDispatch } from "@/lib/store/hooks"
import { logout } from "@/lib/store/slices/auth-slice"

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Products", href: "/products", icon: Package },
  { name: "Categories", href: "/categories", icon: Tag },
  { name: "Analytics", href: "/analytics", icon: BarChart3 },
  { name: "Settings", href: "/settings", icon: Settings },
]

interface AppSidebarProps {
  collapsed: boolean
  setCollapsed: (collapsed: boolean) => void
}

export function AppSidebar({ collapsed, setCollapsed }: AppSidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const dispatch = useAppDispatch()

  const handleLogout = () => {
    dispatch(logout())
    router.push("/login")
  }

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 h-screen border-r bg-card transition-all duration-300 ease-in-out",
        collapsed ? "w-16" : "w-64",
      )}
    >
      <div className="flex h-full flex-col">
        {/* Header */}
        <div className="flex h-16 items-center justify-between border-b px-4">
          <Link href="/dashboard" className="flex items-center gap-2 overflow-hidden">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary">
              <Package className="h-5 w-5 text-primary-foreground" />
            </div>
            {!collapsed && <span className="text-lg font-semibold whitespace-nowrap">ProductHub</span>}
          </Link>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCollapsed(!collapsed)}
            className="h-8 w-8 shrink-0 hidden md:flex"
          >
            {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 p-2">
          {navigation.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/")
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:bg-accent hover:text-foreground",
                  collapsed ? "justify-center" : "justify-start",
                )}
                title={item.name}
              >
                <item.icon className="h-5 w-5 shrink-0" />
                {!collapsed && <span className="whitespace-nowrap">{item.name}</span>}
              </Link>
            )
          })}
        </nav>

        {/* Logout */}
        <div className="border-t p-2">
          <Button
            variant="ghost"
            onClick={handleLogout}
            className={cn(
              "w-full gap-3 text-muted-foreground hover:bg-accent hover:text-foreground transition-all duration-200",
              collapsed ? "justify-center px-0" : "justify-start",
            )}
            title="Logout"
          >
            <LogOut className="h-5 w-5 shrink-0" />
            {!collapsed && <span className="whitespace-nowrap">Logout</span>}
          </Button>
        </div>
      </div>
    </aside>
  )
}
