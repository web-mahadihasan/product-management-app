"use client"

import { Package, Tag, DollarSign, TrendingUp, AlertTriangle } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useAppQuery } from "@/hooks/use-app-query"
import type { Product, Category } from "@/lib/types"
import { Skeleton } from "@/components/ui/skeleton"
import { ProductBarChart } from "@/components/charts/product-bar-chart"
import { TotalValueAreaChart } from "@/components/charts/total-value-area-chart"

import { formatLargeNumber } from "@/lib/utils"

export default function DashboardPage() {
  const { data: productsData, isLoading: productsLoading } = useAppQuery<{ products: Product[]; total: number }>({
    url: "/products",
    queryKey: ["products"],
  })

  const { data: categoriesData, isLoading: categoriesLoading } = useAppQuery<{ categories: Category[] }>({
    url: "/categories",
    queryKey: ["categories"],
  })

  const products = productsData?.products || []
  const totalProducts = productsData?.total || 0
  const categories = categoriesData?.categories || []
  const totalCategories = categories.length
  const lowStockCount = 23 // Mock data
  const totalValue = products.reduce((sum, p) => sum + p.price, 0)

  const isLoading = productsLoading || categoriesLoading

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
      value: formatLargeNumber(totalValue),
      change: "+8% from last month",
      icon: DollarSign,
      iconColor: "text-green-600",
      iconBg: "bg-green-100",
      trend: "up",
    },
  ]

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="mx-auto max-w-7xl space-y-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">Product Management</h1>
            <p className="text-muted-foreground">Manage your product inventory and details</p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <Card key={index}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-8 w-8 rounded-lg" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-6 w-16" />
                  <Skeleton className="mt-2 h-3 w-32" />
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-32" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-[300px] w-full" />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-32" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-[300px] w-full" />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Product Management</h1>
          <p className="text-muted-foreground">Manage your product inventory and details</p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat) => (
            <Card key={stat.title} className="transition-shadow hover:shadow-md bg-[#F8f8F8] gap-3  ">
              <CardHeader className="flex flex-row items-center justify-between space-y-0">
                <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
                <div className={`rounded-lg p-2 ${stat.iconBg}`}>
                  <stat.icon className={`h-5 w-5 ${stat.iconColor}`} />
                </div>
              </CardHeader>
              <CardContent className="pt-0">
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
        <div className="grid gap-6 lg:grid-cols-2">
          <ProductBarChart products={products} />
          <TotalValueAreaChart products={products} />
        </div>
      </div>
    </div>
  )
}