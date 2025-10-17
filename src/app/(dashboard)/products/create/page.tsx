"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks"
import { createProduct } from "@/lib/store/slices/products-slice"
import { useToast } from "@/hooks/use-toast"
import { useEffect } from "react"
import { fetchCategories } from "@/lib/store/slices/categories-slice"
import { productSchema } from "@/lib/validations/product"
import { z } from "zod"

export default function CreateProductPage() {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const { toast } = useToast()
  const { categories, loading: categoriesLoading } = useAppSelector((state) => state.categories)

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    categoryId: "",
    images: [""],
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    dispatch(fetchCategories())
  }, [dispatch])

  const validate = () => {
    try {
      productSchema.parse({
        name: formData.name,
        description: formData.description,
        price: Number.parseFloat(formData.price),
        categoryId: formData.categoryId,
        images: formData.images.filter((img) => img.trim()),
      })
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

    setLoading(true)
    try {
      await dispatch(
        createProduct({
          name: formData.name,
          description: formData.description,
          price: Number.parseFloat(formData.price),
          categoryId: formData.categoryId,
          images: formData.images.filter((img) => img.trim()),
        }),
      ).unwrap()

      toast({
        title: "Success",
        description: "Product created successfully",
      })
      router.push("/products")
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create product",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
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

              <div className="grid gap-6 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="price">
                    Price <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => {
                      setFormData({ ...formData, price: e.target.value })
                      setErrors({ ...errors, price: "" })
                    }}
                    placeholder="0.00"
                    aria-invalid={!!errors.price}
                  />
                  {errors.price && <p className="text-sm text-destructive">{errors.price}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">
                    Category <span className="text-destructive">*</span>
                  </Label>
                  <Select
                    value={formData.categoryId}
                    onValueChange={(value) => {
                      setFormData({ ...formData, categoryId: value })
                      setErrors({ ...errors, categoryId: "" })
                    }}
                    disabled={categoriesLoading}
                  >
                    <SelectTrigger aria-invalid={!!errors.categoryId}>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.categoryId && <p className="text-sm text-destructive">{errors.categoryId}</p>}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="image">
                  Image URL <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="image"
                  value={formData.images[0]}
                  onChange={(e) => {
                    setFormData({ ...formData, images: [e.target.value] })
                    setErrors({ ...errors, "images.0": "" })
                  }}
                  placeholder="https://example.com/image.jpg"
                  aria-invalid={!!errors["images.0"]}
                />
                {errors["images.0"] && <p className="text-sm text-destructive">{errors["images.0"]}</p>}
              </div>

              <div className="flex gap-4">
                <Button type="submit" disabled={loading} className="flex-1">
                  {loading ? "Creating..." : "Create Product"}
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
