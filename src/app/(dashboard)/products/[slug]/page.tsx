"use client"

import { useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { ArrowLeft, Pencil, Trash2, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { toast } from "react-hot-toast"

import { ProductDetailSkeleton } from "@/components/products/product-skeleton"
import { useAppQuery } from "@/hooks/use-app-query"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import type { Product } from "@/lib/types"
import axiosInstance from "@/lib/axios"


export default function ProductDetailPage() {
  const router = useRouter()
  const params = useParams()
  const queryClient = useQueryClient()
  const slug = params.slug as string

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  const { data: currentProduct, isLoading, isError } = useAppQuery<Product>({
    url: `/products/${slug}`,
    queryKey: ["product", slug],
  })

  const { mutate: deleteProduct, isPending: isDeleting } = useMutation({
    mutationFn: (id: string) => {
      return axiosInstance.delete(`/products/${id}`)
    },
    onSuccess: () => {
      toast.success("Product deleted successfully")
      setDeleteDialogOpen(false)
      queryClient.invalidateQueries({ queryKey: ["products"] })
      router.push("/products")
    },
    onError: () => {
      toast.error("Failed to delete product")
    },
  })

  const handlePrevImage = () => {
    if (!currentProduct?.images?.length) return
    setCurrentImageIndex((prevIndex) => (prevIndex === 0 ? currentProduct.images.length - 1 : prevIndex - 1))
  }

  const handleNextImage = () => {
    if (!currentProduct?.images?.length) return
    setCurrentImageIndex((prevIndex) => (prevIndex === currentProduct.images.length - 1 ? 0 : prevIndex + 1))
  }

  const handleDelete = () => {
    if (!currentProduct) return
    deleteProduct(currentProduct.id)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="mx-auto max-w-7xl">
          <ProductDetailSkeleton />
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-destructive">Failed to load product.</p>
      </div>
    );
  }

  if (!currentProduct) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-muted-foreground">Product not found</p>
      </div>
    )
  }

  console.log("current product", currentProduct)

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => router.back()}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-foreground">Product Details</h1>
              <p className="text-muted-foreground">View product information</p>
            </div>
          </div>
          <div className="flex gap-2 mt-2 md:mt-0 md:justify-end">
            <Button
              variant="outline"
              onClick={() => router.push(`/products/${currentProduct.slug}/edit`)}
              className="gap-2"
            >
              <Pencil className="h-4 w-4" />
              Edit
            </Button>
            <Button variant="destructive" className="gap-2" onClick={() => setDeleteDialogOpen(true)}>
              <Trash2 className="h-4 w-4" />
              Delete
            </Button>
          </div>
        </div>

        <Card>
          <CardContent className="p-6">
            <div className="grid gap-6 lg:grid-cols-2">
              <div className="relative aspect-square overflow-hidden rounded-lg bg-muted">
                <img
                  src={currentProduct.images?.[currentImageIndex] || "/placeholder.svg?height=400&width=400"}
                  alt={currentProduct.name}
                  className="h-full w-full object-cover transition-opacity duration-300"
                />
                {currentProduct.images && currentProduct.images.length > 1 && (
                  <>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-background/50 hover:bg-background/75"
                      onClick={handlePrevImage}
                    >
                      <ChevronLeft className="h-6 w-6" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-background/50 hover:bg-background/75"
                      onClick={handleNextImage}
                    >
                      <ChevronRight className="h-6 w-6" />
                    </Button>
                  </>
                )}
              </div>
              <div className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <h2 className="text-2xl font-bold text-foreground">{currentProduct.name}</h2>
                    <Badge variant="secondary" className="mt-2">
                      {currentProduct.category.name}
                    </Badge>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Description</p>
                    <p className="mt-1 text-foreground">{currentProduct.description}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Price</p>
                      <p className="mt-1 text-2xl font-bold text-foreground">${currentProduct.price.toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Stock</p>
                      <p className="mt-1 text-2xl font-bold text-foreground">{Math.floor(Math.random() * 100)}</p>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Product ID</p>
                    <p className="mt-1 font-mono text-sm text-foreground">{currentProduct.id}</p>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Created At</p>
                    <p className="mt-1 text-sm text-foreground">
                      {new Date(currentProduct.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will delete "{currentProduct.name}". This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <Button
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}