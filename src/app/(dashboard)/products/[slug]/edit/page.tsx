"use client"

import { useRouter, useParams } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAppQuery } from "@/hooks/use-app-query"
import { useAppMutation } from "@/hooks/use-app-mutation"
import { toast } from "react-hot-toast"
import { Skeleton } from "@/components/ui/skeleton"
import type { Product } from "@/lib/types"
import { useQueryClient } from "@tanstack/react-query"
import { ProductForm } from "@/components/products/product-form"
import type { ProductFormData } from "@/lib/validations/product"

export default function EditProductPage() {
  const router = useRouter()
  const params = useParams()
  const queryClient = useQueryClient()
  const slug = params.slug as string

  // Fetch Product
  const { data: currentProduct, isLoading: productLoading, isError } = useAppQuery<Product>({
    url: `/products/${slug}`,
    queryKey: ["product", slug],
  })

  // Update Product Mutation
  const { mutate: updateProduct, isPending } = useAppMutation<Product, any, ProductFormData>({
    url: `/products/${slug}`,
    method: "PUT",
    onSuccess: () => {
      toast.success("Product updated successfully")
      queryClient.invalidateQueries({ queryKey: ["products"] })
      queryClient.invalidateQueries({ queryKey: ["product", slug] })
      router.push("/products")
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to update product")
    },
  })

  const handleSubmit = (data: ProductFormData) => {
    updateProduct(data)
  }

  if (productLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="mx-auto max-w-3xl space-y-6">
          <div className="flex items-center gap-4">
            <Skeleton className="h-10 w-10" />
            <div className="space-y-2">
              <Skeleton className="h-8 w-48" />
              <Skeleton className="h-4 w-64" />
            </div>
          </div>

          <div className="space-y-6">
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        </div>
      </div>
    )
  }

  if (isError || !currentProduct) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-muted-foreground">Product not found</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-3xl space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">Edit Product</h1>
            <p className="text-muted-foreground">Update product information</p>
          </div>
        </div>
        <ProductForm
          onSubmit={handleSubmit}
          isPending={isPending}
          initialData={currentProduct}
          submitButtonText="Update Product"
        />
      </div>
    </div>
  )
}
