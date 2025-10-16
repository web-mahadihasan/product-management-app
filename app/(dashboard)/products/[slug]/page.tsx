"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { ArrowLeft, Pencil, Trash2 } from "lucide-react"
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
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks"
import { fetchProductBySlug, clearCurrentProduct, deleteProduct } from "@/lib/store/slices/products-slice"
import { useToast } from "@/hooks/use-toast"
import { ProductDetailSkeleton } from "@/components/products/product-skeleton"

export default function ProductDetailPage() {
  const router = useRouter()
  const params = useParams()
  const dispatch = useAppDispatch()
  const { toast } = useToast()
  const { currentProduct, loading } = useAppSelector((state) => state.products)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)

  useEffect(() => {
    if (params.slug) {
      dispatch(fetchProductBySlug(params.slug as string))
    }
    return () => {
      dispatch(clearCurrentProduct())
    }
  }, [dispatch, params.slug])

  const handleDelete = async () => {
    if (!currentProduct) return

    try {
      await dispatch(deleteProduct(currentProduct.id)).unwrap()
      toast({
        title: "Success",
        description: "Product deleted successfully",
      })
      router.push("/products")
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete product",
        variant: "destructive",
      })
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="mx-auto max-w-5xl">
          <ProductDetailSkeleton />
        </div>
      </div>
    )
  }

  if (!currentProduct) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-muted-foreground">Product not found</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="mx-auto max-w-5xl space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => router.back()}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-foreground">Product Details</h1>
              <p className="text-muted-foreground">View product information</p>
            </div>
          </div>
          <div className="flex gap-2">
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

        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardContent className="p-6">
              <div className="aspect-square overflow-hidden rounded-lg bg-muted">
                <img
                  src={currentProduct.images[0] || "/placeholder.svg?height=400&width=400"}
                  alt={currentProduct.name}
                  className="h-full w-full object-cover"
                />
              </div>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card>
              <CardContent className="p-6 space-y-4">
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
              </CardContent>
            </Card>
          </div>
        </div>
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
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
