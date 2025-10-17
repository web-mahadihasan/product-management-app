import { z } from "zod"

export const loginSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email address"),
})

export type LoginFormData = z.infer<typeof loginSchema>
