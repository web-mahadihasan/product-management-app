"use client"

import { useState } from "react"
import { useRouter, usePathname, useSearchParams } from "next/navigation"
import { Plus, Search, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Pagination } from "@/components/ui/pagination"
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
import { useAppQuery } from "@/hooks/use-app-query"
import { toast } from "react-hot-toast"
import type { Product, Category } from "@/lib/types"
import { ProductCard } from "@/components/products/product-card"
import { ProductCardSkeleton } from "@/components/products/product-skeleton"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import axiosInstance from "@/lib/axios"

export default function ProductsPage() {
  const router = useRouter()
  const queryClient = useQueryClient()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [productToDelete, setProductToDelete] = useState<Product | null>(null)
  const searchQuery = searchParams.get("search") || ""
  const selectedCategory = searchParams.get("category") || "all"
  const currentPage = Number(searchParams.get("page")) || 1
  const limit = 12

  const createQueryString = (params: Record<string, string | number | null>) => {
    const newSearchParams = new URLSearchParams(searchParams?.toString())
    for (const [key, value] of Object.entries(params)) {
      if (value === null) {
        newSearchParams.delete(key)
      } else {
        newSearchParams.set(key, String(value))
      }
    }
    return newSearchParams.toString()
  }

  const onPageChange = (page: number) => {
    router.push(`${pathname}?${createQueryString({ page })}`, { scroll: false })
  }

  const handleSearchChange = (value: string) => {
    router.push(`${pathname}?${createQueryString({ search: value || null, page: 1 })}`, { scroll: false })
  }

  const handleCategoryChange = (value: string) => {
    router.push(`${pathname}?${createQueryString({ category: value === 'all' ? null : value, page: 1 })}`, { scroll: false })
  }

  // Fetch Categories
  const { data: categoriesData } = useAppQuery<{ categories: Category[] }>({
    url: "/categories",
    queryKey: ["categories"],
  })
  const categories = categoriesData?.categories || []

  // Fetch ALL products based on filter/search
  const {
    data: filteredProductsData,
    isLoading: productsLoading,
    isError: productsError,
  } = useAppQuery<{ products: Product[] }>({
    url: searchQuery
      ? `/products/search?searchedText=${searchQuery}`
      : selectedCategory !== "all"
        ? `/products?categoryId=${selectedCategory}`
        : "/products",
    queryKey: ["products", { selectedCategory, searchQuery }], // Query depends on filters, not pagination
  })

  const allFilteredProducts = filteredProductsData?.products || []
  const total = allFilteredProducts.length

  // Client-side pagination
  const products = allFilteredProducts.slice(
    (currentPage - 1) * limit,
    currentPage * limit
  )

  // Delete Product Mutation
  const { mutate: deleteProduct, isPending: isDeleting } = useMutation({
    mutationFn: (id: string) => {
      return axiosInstance.delete(`/products/${id}`)
    },
    onSuccess: () => {
      toast.success("Product deleted successfully")
      setDeleteDialogOpen(false)
      setProductToDelete(null)
      queryClient.invalidateQueries({ queryKey: ["products"] })
    },
    onError: () => {
      toast.error("Failed to delete product")
    },
  })

  const openDeleteDialog = (product: Product) => {
    setProductToDelete(product)
    setDeleteDialogOpen(true)
  }

  const totalPages = Math.ceil(total / limit)

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">Products</h1>
            <p className="text-muted-foreground">Manage your product inventory</p>
          </div>
          <Button onClick={() => router.push("/products/create")} className="gap-2">
            <Plus className="h-4 w-4" />
            Add Product
          </Button>
        </div>

        {/* Filters */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select
            value={selectedCategory}
            onValueChange={handleCategoryChange}
          >
            <SelectTrigger className="w-full sm:w-[200px]">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {/* <Button variant="outline" className="gap-2 bg-transparent">
            <Filter className="h-4 w-4" />
            Filter
          </Button> */}
        </div>

        {/* Product Grid */}
        {productsLoading ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: limit }).map((_, index) => (
              <ProductCardSkeleton key={index} />
            ))}
          </div>
        ) : productsError ? (
          <div className="col-span-full text-center">
            <p className="text-destructive">Failed to load products.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {products.length === 0 ? (
              <div className="col-span-full text-center">
                <p className="text-muted-foreground">No products found</p>
              </div>
            ) : (
              products.map((product) => (
                <ProductCard key={product.id} product={product} onDelete={openDeleteDialog} />
              ))
            )}
          </div>
        )}

        {/* Pagination */}
        {!productsLoading && products.length > 0 && (
          <Pagination
            totalPages={totalPages}
            currentPage={currentPage}
            onPageChange={onPageChange}
          />
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription className="py-6">
              This will delete "{productToDelete?.name}". This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="cursor-pointer" disabled={isDeleting}>Cancel</AlertDialogCancel>
            <Button
              onClick={() => {
                if (productToDelete) {
                  deleteProduct(productToDelete.id)
                }
              }}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}