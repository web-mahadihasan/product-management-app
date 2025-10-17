"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks"
import { updateProduct, fetchProductBySlug } from "@/lib/store/slices/products-slice"
import { useToast } from "@/hooks/use-toast"
import { productUpdateSchema } from "@/lib/validations/product"
import { z } from "zod"
import { Skeleton } from "@/components/ui/skeleton"

export default function EditProductPage({ params }: { params: { slug: string } }) {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const { toast } = useToast()
  const { currentProduct, loading: productLoading } = useAppSelector((state) => state.products)

  const [formData, setFormData] = useState({
    name: "",
    description: "",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    dispatch(fetchProductBySlug(params.slug))
  }, [dispatch, params.slug])

  useEffect(() => {
    if (currentProduct) {
      setFormData({
        name: currentProduct.name,
        description: currentProduct.description,
      })
    }
  }, [currentProduct])

  const validate = () => {
    try {
      productUpdateSchema.parse(formData)
      setErrors({})
      return true
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {}
        error.errors.forEach((err) => {
          const path = err.path.join(".")
          newErrors[path] = err.message
        })
        setErrors(newErrors)
      }
      return false
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validate()) {
      toast({
        title: "Validation Error",
        description: "Please fix the errors in the form",
        variant: "destructive",
      })
      return
    }

    if (!currentProduct) return

    setLoading(true)
    try {
      await dispatch(
        updateProduct({
          id: currentProduct.id,
          data: formData,
        }),
      ).unwrap()

      toast({
        title: "Success",
        description: "Product updated successfully",
      })
      router.push(`/products/${params.slug}`)
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update product",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  if (productLoading) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="mx-auto max-w-3xl space-y-6">
          <div className="flex items-center gap-4">
            <Skeleton className="h-10 w-10" />
            <div className="space-y-2">
              <Skeleton className="h-8 w-48" />
              <Skeleton className="h-4 w-64" />
            </div>
          </div>
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-48" />
            </CardHeader>
            <CardContent className="space-y-6">
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-12 w-full" />
            </CardContent>
          </Card>
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

        <Card>
          <CardHeader>
            <CardTitle>Product Information</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">
                  Product Name <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => {
                    setFormData({ ...formData, name: e.target.value })
                    setErrors({ ...errors, name: "" })
                  }}
                  placeholder="Enter product name"
                  aria-invalid={!!errors.name}
                />
                {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">
                  Description <span className="text-destructive">*</span>
                </Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => {
                    setFormData({ ...formData, description: e.target.value })
                    setErrors({ ...errors, description: "" })
                  }}
                  placeholder="Enter product description"
                  rows={4}
                  aria-invalid={!!errors.description}
                />
                {errors.description && <p className="text-sm text-destructive">{errors.description}</p>}
              </div>

              <div className="flex gap-4">
                <Button type="submit" disabled={loading} className="flex-1">
                  {loading ? "Updating..." : "Update Product"}
                </Button>
                <Button type="button" variant="outline" onClick={() => router.back()}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
