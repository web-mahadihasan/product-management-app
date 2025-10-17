import { z } from "zod"

export const productSchema = z.object({
  name: z
    .string()
    .min(1, "Product name is required")
    .min(3, "Product name must be at least 3 characters")
    .max(100, "Product name must not exceed 100 characters"),
  description: z
    .string()
    .min(1, "Description is required")
    .min(10, "Description must be at least 10 characters")
    .max(1000, "Description must not exceed 1000 characters"),
  price: z
    .number({
      required_error: "Price is required",
      invalid_type_error: "Price must be a number",
    })
    .positive("Price must be greater than 0")
    .max(1000000, "Price must not exceed 1,000,000"),
  categoryId: z.string().min(1, "Category is required").uuid("Invalid category ID"),
  images: z
    .array(z.string().url("Invalid image URL"))
    .min(1, "At least one image is required")
    .max(5, "Maximum 5 images allowed"),
})

export const productUpdateSchema = z.object({
  name: z
    .string()
    .min(1, "Product name is required")
    .min(3, "Product name must be at least 3 characters")
    .max(100, "Product name must not exceed 100 characters"),
  description: z
    .string()
    .min(1, "Description is required")
    .min(10, "Description must be at least 10 characters")
    .max(1000, "Description must not exceed 1000 characters"),
})

export type ProductFormData = z.infer<typeof productSchema>
export type ProductUpdateData = z.infer<typeof productUpdateSchema>
