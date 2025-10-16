"use client"

import { useEffect } from "react"
import { Package, Tag, DollarSign, TrendingUp, AlertTriangle } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks"
import { fetchProducts } from "@/lib/store/slices/products-slice"
import { fetchCategories } from "@/lib/store/slices/categories-slice"

export default function DashboardPage() {
  const dispatch = useAppDispatch()
  const { products } = useAppSelector((state) => state.products)
  const { categories } = useAppSelector((state) => state.categories)

  useEffect(() => {
    dispatch(fetchProducts())
    dispatch(fetchCategories())
  }, [dispatch])

  const totalProducts = products.length
  const totalCategories = categories.length
  const lowStockCount = 23 // Mock data
  const totalValue = products.reduce((sum, p) => sum + p.price, 0) / 1000

  const stats = [
    {
      title: "Total Products",
      value: totalProducts.toLocaleString(),
      change: "+12% from last month",
      icon: Package,
      iconColor: "text-blue-600",
      iconBg: "bg-blue-100",
      trend: "up",
    },
    {
      title: "Categories",
      value: totalCategories.toString(),
      change: `+${Math.min(3, totalCategories)} new categories`,
      icon: Tag,
      iconColor: "text-purple-600",
      iconBg: "bg-purple-100",
      trend: "up",
    },
    {
      title: "Low Stock",
      value: lowStockCount.toString(),
      change: "Needs attention",
      icon: AlertTriangle,
      iconColor: "text-red-600",
      iconBg: "bg-red-100",
      trend: "warning",
    },
    {
      title: "Total Value",
      value: `$${totalValue.toFixed(1)}K`,
      change: "+8% from last month",
      icon: DollarSign,
      iconColor: "text-green-600",
      iconBg: "bg-green-100",
      trend: "up",
    },
  ]

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Product Management</h1>
          <p className="text-muted-foreground">Manage your product inventory and details</p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <Card key={stat.title} className="transition-shadow hover:shadow-md">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
                <div className={`rounded-lg p-2 ${stat.iconBg}`}>
                  <stat.icon className={`h-5 w-5 ${stat.iconColor}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                <div className="mt-1 flex items-center gap-1 text-xs">
                  {stat.trend === "up" && <TrendingUp className="h-3 w-3 text-green-600" />}
                  {stat.trend === "warning" && <AlertTriangle className="h-3 w-3 text-red-600" />}
                  <span
                    className={
                      stat.trend === "up"
                        ? "text-green-600"
                        : stat.trend === "warning"
                          ? "text-red-600"
                          : "text-muted-foreground"
                    }
                  >
                    {stat.change}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
