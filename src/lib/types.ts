export interface Category {
  id: string
  name: string
  description: string | null
  image: string
  createdAt: string
  updatedAt?: string
}

export interface Product {
  id: string
  name: string
  description: string
  images: string[]
  price: number
  slug: string
  createdAt: string
  updatedAt: string
  category: Category
}

export interface AuthState {
  token: string | null
  email: string | null
  isAuthenticated: boolean
}

export interface ProductsState {
  products: Product[]
  currentProduct: Product | null
  loading: boolean
  error: string | null
  total: number
  currentPage: number
  limit: number
}

export interface CategoriesState {
  categories: Category[]
  loading: boolean
  error: string | null
}
