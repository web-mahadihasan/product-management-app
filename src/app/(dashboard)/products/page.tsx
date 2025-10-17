"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Plus, Search, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
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

  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [productToDelete, setProductToDelete] = useState<Product | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const limit = 8

  // Fetch Categories
  const { data: categoriesData } = useAppQuery<{ categories: Category[] }>({
    url: "/categories",
    queryKey: ["categories"],
  })
  const categories = categoriesData?.categories || []

  // Fetch Products
  const {
    data: productsData,
    isLoading: productsLoading,
    isError: productsError,
  } = useAppQuery<{ products: Product[]; total: number }>({
    url: searchQuery
      ? `/products/search?searchedText=${searchQuery}`
      : `/products?offset=${(currentPage - 1) * limit}&limit=${limit}${
          selectedCategory !== "all" ? `&categoryId=${selectedCategory}` : ""
        }`,
    queryKey: ["products", { currentPage, limit, selectedCategory, searchQuery }],
  })

  const products = productsData?.products || []
  const total = productsData?.total || 0

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
    <div className="min-h-screen bg-background p-6">
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
              onChange={(e) => {
                setSearchQuery(e.target.value)
                setCurrentPage(1) // Reset to first page on search
              }}
              className="pl-9"
            />
          </div>
          <Select
            value={selectedCategory}
            onValueChange={(value) => {
              setSelectedCategory(value)
              setCurrentPage(1) // Reset to first page on category change
            }}
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
          <Button variant="outline" className="gap-2 bg-transparent">
            <Filter className="h-4 w-4" />
            Filter
          </Button>
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
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Page {currentPage} of {totalPages}
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <Button
                  key={page}
                  variant={currentPage === page ? "default" : "outline"}
                  onClick={() => setCurrentPage(page)}
                >
                  {page}
                </Button>
              ))}
              <Button
                variant="outline"
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage >= totalPages}
              >
                Next
              </Button>
            </div>
          </div>
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
            <AlertDialogCancel className="cursor-pointer">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (productToDelete) {
                  deleteProduct(productToDelete.id)
                }
              }}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}