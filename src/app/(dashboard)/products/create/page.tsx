"use client"

import { useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAppMutation } from "@/hooks/use-app-mutation"
import { toast } from "react-hot-toast"
import type { Product } from "@/lib/types"
import { useQueryClient } from "@tanstack/react-query"
import { ProductForm } from "@/components/products/product-form"
import type { ProductFormData } from "@/lib/validations/product"

export default function CreateProductPage() {
  const router = useRouter()
  const queryClient = useQueryClient()

  const { mutate: createProduct, isPending } = useAppMutation<Product, any, ProductFormData>({
    url: "/products",
    method: "POST",
    onSuccess: () => {
      toast.success("Product created successfully")
      queryClient.invalidateQueries({ queryKey: ["products"] })
      router.push("/products")
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to create product")
    },
  })

  const handleSubmit = (data: ProductFormData) => {
    createProduct(data)
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="mx-auto max-w-3xl space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">Create Product</h1>
            <p className="text-muted-foreground">Add a new product to your inventory</p>
          </div>
        </div>
        <ProductForm onSubmit={handleSubmit} isPending={isPending} submitButtonText="Create Product" />
      </div>
    </div>
  )
}
