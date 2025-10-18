"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Trash } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useAppQuery } from "@/hooks/use-app-query"
import { toast } from "react-hot-toast"
import { productSchema, type ProductFormData } from "@/lib/validations/product"
import { z } from "zod"
import FileUpload, { DropZone, FileError, FileInfo } from "@/components/ui/file-upload"
import type { Category, Product } from "@/lib/types"

interface ProductFormProps {
  initialData?: Product | null
  onSubmit: (data: ProductFormData) => void
  isPending: boolean
  submitButtonText?: string
}

export function ProductForm({
  initialData,
  onSubmit,
  isPending,
  submitButtonText = "Submit",
}: ProductFormProps) {
  const router = useRouter()

  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    description: initialData?.description || "",
    price: initialData?.price?.toString() || "",
    categoryId: initialData?.category?.id || "",
    images: initialData?.images || [],
  })
  const [uploadFiles, setUploadFiles] = useState<FileInfo[]>([])
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [uploading, setUploading] = useState(false)

  // Fetch Categories
  const { data: categoriesData, isLoading: categoriesLoading } = useAppQuery<{ categories: Category[] }>({
    url: "/categories",
    queryKey: ["categories"],
  })
  const categories = categoriesData?.categories || []

  const handleImageUpload = async (files: File[]) => {
    if (formData.images.length + files.length > 3) {
      toast.error("You can upload a maximum of 3 images.")
      return
    }
    setUploading(true)
    const uploadPromises = files.map(async (file) => {
      const body = new FormData()
      body.append("file", file)
      body.append("upload_preset", "fitVerse") // This is needed by Cloudinary

      try {
        const response = await fetch("/api/products/image-upload", {
          method: "POST",
          body,
        })

        const data = await response.json()

        if (!response.ok) {
          toast.error(data.message || `Failed to upload ${file.name}`)
          return null
        }
        return data.secure_url
      } catch (error) {
        console.error("Image upload error:", error)
        toast.error(`Failed to upload ${file.name}`)
        return null
      }
    })

    const uploadedUrls = (await Promise.all(uploadPromises)).filter((url): url is string => url !== null)

    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, ...uploadedUrls],
    }))
    setUploadFiles([])
    setUploading(false)
  }

  const onFileSelectChange = (files: FileInfo[]) => {
    setUploadFiles(files)
    const filesToUpload = files.map((fi) => fi.file)
    if (filesToUpload.length > 0) {
      handleImageUpload(filesToUpload)
    }
  }

  const onRemove = (imageUrl: string) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((image) => image !== imageUrl),
    }))
  }

  const validate = () => {
    const dataToValidate = {
      ...formData,
      price: Number.parseFloat(formData.price),
    }
    try {
      productSchema.parse(dataToValidate)
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) {
      toast.error("Please fix the errors in the form")
      return
    }
    onSubmit({
      ...formData,
      price: Number.parseFloat(formData.price),
    })
  }

  return (
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
              className="focus-visible:ring-0 focus-visible:ring-offset-0"
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
              className="focus-visible:ring-0 focus-visible:ring-offset-0"
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
                className="focus-visible:ring-0 focus-visible:ring-offset-0"
              />
              {errors.price && <p className="text-sm text-destructive">{errors.price}</p>}
            </div>

            <div className="space-y-2 w-full">
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
                <SelectTrigger
                  className="w-full cursor-pointer focus:ring-0 focus:ring-offset-0"
                  aria-invalid={!!errors.categoryId}
                >
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id} className="cursor-pointer py-2">
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.categoryId && (
                <p className="text-sm text-destructive">{errors.categoryId}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="images">
              Images ({`${formData.images.length}/3`}) <span className="text-destructive mb-2">*</span>
            </Label>
            <div className="grid grid-cols-3 gap-4">
              {formData.images.map((image, index) => (
                <div key={image} className="relative h-32 rounded-md">
                  <img
                    src={image}
                    alt={`Product image ${index + 1}`}
                    className="h-full w-full rounded-md object-cover"
                  />
                  <Button
                    variant="destructive"
                    size="icon"
                    className="absolute top-1 right-1 h-6 w-6"
                    onClick={() => onRemove(image)}
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              {formData.images.length < 3 && (
                <div
                  className={`h-32
                    ${formData.images.length === 0 ? "col-span-3" : ""}
                    ${formData.images.length === 1 ? "col-span-2" : ""}
                    ${formData.images.length === 2 ? "col-span-1" : ""}
                  `}
                >
                  <FileUpload
                    files={uploadFiles}
                    onFileSelectChange={onFileSelectChange}
                    multiple
                    accept=".png,.jpg,.jpeg"
                    maxSize={10}
                    maxCount={3 - formData.images.length}
                    className="h-full"
                    disabled={isPending || uploading}
                  >
                    <div className="flex h-full w-full flex-col items-center justify-center space-y-4">
                      <DropZone
                        prompt={uploading ? "Uploading..." : "Click or drop to upload"}
                        className="h-full w-full"
                      />
                      <FileError />
                    </div>
                  </FileUpload>
                </div>
              )}
            </div>
            {errors.images && <p className="text-sm text-destructive">{errors.images}</p>}
          </div>

          <div className="flex gap-4">
            <Button type="submit" disabled={isPending || uploading} className="flex-1">
              {uploading
                ? "Uploading Image..."
                : isPending
                  ? initialData
                    ? "Updating Product..."
                    : "Creating Product..."
                  : submitButtonText}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}