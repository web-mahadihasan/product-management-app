"use client"

import { useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks"
import { fetchCategories } from "@/lib/store/slices/categories-slice"
import { Skeleton } from "@/components/ui/skeleton"

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
  const dispatch = useAppDispatch()
  const { categories, loading } = useAppSelector((state) => state.categories)

  useEffect(() => {
    dispatch(fetchCategories())
  }, [dispatch])

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Categories</h1>
          <p className="text-muted-foreground">Browse product categories</p>
        </div>

        {loading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <CategorySkeleton key={i} />
            ))}
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {categories.map((category) => (
              <Card key={category.id} className="overflow-hidden transition-shadow hover:shadow-md">
                <div className="aspect-video overflow-hidden bg-muted">
                  <img
                    src={category.image || "/placeholder.svg?height=200&width=300"}
                    alt={category.name}
                    className="h-full w-full object-cover"
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
