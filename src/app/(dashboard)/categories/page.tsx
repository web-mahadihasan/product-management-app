"use client"

import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { useAppQuery } from "@/hooks/use-app-query"
import type { Category } from "@/lib/types"

function CategorySkeleton() {
  return (
    <Card className="overflow-hidden p-2 flex flex-row items-center gap-4">
      <div className="h-[80px] w-[100px]">
        <Skeleton className="w-full h-full" />
      </div>
      <CardContent className="space-y-2 w-full">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-full" />
      </CardContent>
    </Card>
  )
}

export default function CategoriesPage() {
  const { data: categoriesData, isLoading } = useAppQuery<{ categories: Category[] }>({
    url: "/categories",
    queryKey: ["categories"],
  })

  const categories = categoriesData?.categories || []

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Categories</h1>
          <p className="text-muted-foreground">Browse product categories</p>
        </div>

        {isLoading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <CategorySkeleton key={i} />
            ))}
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {categories.map((category) => (
              <Link key={category.id} href={`/products?category=${category.id}`}>
                <Card className="overflow-hidden transition-shadow hover:shadow-md flex flex-row p-2 h-full">
                  <div className="h-[80px] w-[100px] flex-shrink-0 overflow-hidden rounded-lg bg-muted">
                    <img
                      src={category.image || "/placeholder.svg?height=200&width=300"}
                      alt={category.name}
                      className="h-full w-full object-oover"
                    />
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-foreground">{category.name}</h3>
                    {category.description && <p className="mt-1 text-sm text-muted-foreground">{category.description}</p>}
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
