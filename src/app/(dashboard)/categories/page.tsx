"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { useAppQuery } from "@/hooks/use-app-query"
import type { Category } from "@/lib/types"

function CategorySkeleton() {
  return (
    <Card className="overflow-hidden">
      <Skeleton className="aspect-video w-full" />
      <CardContent className="p-4 space-y-2">
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
    <div className="min-h-screen bg-background p-6">
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
              <Card key={category.id} className="overflow-hidden transition-shadow hover:shadow-md flex flex-row p-2">
                <div className="aspect-video overflow-hidden bg-muted">
                  <img
                    src={category.image || "/placeholder.svg?height=200&width=300"}
                    alt={category.name}
                    className="h-[80px] w-[100px] object-cover rounded-lg"
                  />
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold text-foreground">{category.name}</h3>
                  {category.description && <p className="mt-1 text-sm text-muted-foreground">{category.description}</p>}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
