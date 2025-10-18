"use client"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent } from "@/components/ui/sheet"
import { useIsLargeScreen } from "@/hooks/use-is-large-screen"
import { useAppDispatch } from "@/lib/store/hooks"
import { logout } from "@/lib/store/slices/auth-slice"
import { cn } from "@/lib/utils"
import { LayoutDashboard, LogOut, Package, PlusCircle, User, Tag } from "lucide-react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { HiArrowLeftStartOnRectangle, HiArrowRightStartOnRectangle } from "react-icons/hi2"


const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Products", href: "/products", icon: Package },
  { name: "Categories", href: "/categories", icon: Tag },
  { name: "Create", href: "/products/create", icon: PlusCircle },
  { name: "Profile", href: "/profile", icon: User },
]

interface AppSidebarProps {
  collapsed: boolean
  setCollapsed: (collapsed: boolean) => void
  mobileSidebarOpen: boolean
  setMobileSidebarOpen: (open: boolean) => void
}

const SidebarBody = ({ collapsed, setCollapsed, setMobileSidebarOpen, handleLogout, pathname }: any) => (
  <div className="flex h-full flex-col relative">
    {/* Header */}
    <div className="flex h-14 items-center justify-between border-b px-4">
      <Link href="/dashboard" className="flex items-center gap-2 overflow-hidden">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary">
          <Package className="h-5 w-5 text-primary-foreground" />
        </div>
        {!collapsed && <span className="text-lg font-semibold whitespace-nowrap">ProductHub</span>}
      </Link>
      <Button
        variant="outline"
        size="icon-lg"
        onClick={() => setCollapsed(!collapsed)}
        className="p-0 h-auto w-auto hidden lg:flex shrink-0 absolute -right-[10px] text-2xl rounded-sm"
      >
        {collapsed ? <HiArrowRightStartOnRectangle className="size-5" /> : <HiArrowLeftStartOnRectangle className="size-5" />}
      </Button>
    </div>

    {/* Navigation */}
    <nav className="flex-1 space-y-2 p-2 mt-4">
      {navigation.map((item) => {
        const isActive = item.href === "/products" ? pathname.startsWith("/products") && !pathname.startsWith("/products/create") : pathname === item.href || pathname.startsWith(item.href + "/")
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
)

export function AppSidebar({ collapsed, setCollapsed, mobileSidebarOpen, setMobileSidebarOpen }: AppSidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const dispatch = useAppDispatch()
  const isLargeScreen = useIsLargeScreen()

  const handleLogout = () => {
    dispatch(logout())
    router.push("/login")
  }

  if (!isLargeScreen) {
    return (
      <Sheet open={mobileSidebarOpen} onOpenChange={setMobileSidebarOpen}>
        <SheetContent side="left" className={cn("p-0 transition-all duration-300 ease-in-out", collapsed ? "w-16" : "w-64")}>
          <SidebarBody
            collapsed={collapsed}
            setCollapsed={setCollapsed}
            setMobileSidebarOpen={setMobileSidebarOpen}
            handleLogout={handleLogout}
            pathname={pathname}
          />
        </SheetContent>
      </Sheet>
    )
  }

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 h-screen border-r bg-card transition-all duration-300 ease-in-out hidden lg:block",
        collapsed ? "w-16" : "w-64",
      )}
    >
      <SidebarBody
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        setMobileSidebarOpen={setMobileSidebarOpen}
        handleLogout={handleLogout}
        pathname={pathname}
      />
    </aside>
  )
}
