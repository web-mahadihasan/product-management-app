"use client"

import { useRouter } from "next/navigation"
import { Pencil, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { Product } from "@/lib/types"

interface ProductCardProps {
  product: Product
  onDelete: (product: Product) => void
}

export function ProductCard({ product, onDelete }: ProductCardProps) {
  const router = useRouter()

  return (
    <Card
      className="group relative p-0 flex cursor-pointer flex-col overflow-hidden rounded-lg shadow-sm transition-shadow duration-300 hover:shadow-[rgba(99, 99, 99, 0.2) 0px 2px 8px 0px]"
      onClick={() => router.push(`/products/${product.slug}`)}
    >
      <div className="relative h-[200px]">
        <img
          src={product.images?.[0] || "/placeholder.svg?height=200&width=200"}
          alt={product.name}
          className="h-full w-full object-cover"
        />
        <div className="absolute top-2 right-2 flex gap-2 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.stopPropagation()
              router.push(`/products/${product.slug}/edit`)
            }}
            className="h-8 w-8 bg-white/80 hover:bg-white"
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.stopPropagation()
              onDelete(product)
            }}
            className="h-8 w-8 bg-white/80 hover:bg-white"
          >
            <Trash2 className="h-4 w-4 text-destructive" />
          </Button>
        </div>
      </div>
      <CardContent className="flex-1 p-4">
        <CardTitle className="mb-2 line-clamp-2 text-base font-semibold">{product.name}</CardTitle>
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Category</span>
          <Badge variant="secondary">{product.category.name}</Badge>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Price</span>
          <span className="font-semibold">${product.price.toFixed(2)}</span>
        </div>
      </CardContent>
    </Card>
  )
}