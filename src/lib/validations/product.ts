import { z } from "zod"

export const productSchema = z.object({
  name: z
    .string()
    .min(3, "Product name must be at least 3 characters")
    .max(250, "Product name must not exceed 250 characters"),
  description: z
    .string()
    .min(5, "Description must be at least 5 characters"),
  price: z
    .number({
      required_error: "Price is required",
      invalid_type_error: "Price must be a number",
    })
    .positive("Price must be greater than 0"),
  categoryId: z.string().min(1, "Category is required").uuid("Invalid category ID"),
  images: z
    .array(z.string().url("Invalid image URL"))
    .min(1, "At least one image is required"),
})

export const productUpdateSchema = z.object({
  name: z
    .string()
    .min(3, "Product name must be at least 3 characters")
    .max(250, "Product name must not exceed 250 characters"),
  description: z
    .string()
    .min(5, "Description must be at least 5 characters"),
})

export type ProductFormData = z.infer<typeof productSchema>
export type ProductUpdateData = z.infer<typeof productUpdateSchema>
