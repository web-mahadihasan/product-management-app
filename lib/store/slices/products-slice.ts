import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { productsApi } from "@/lib/api"
import type { ProductsState } from "@/lib/types"

const initialState: ProductsState = {
  products: [],
  currentProduct: null,
  loading: false,
  error: null,
  total: 0,
  currentPage: 1,
  limit: 8,
}

export const fetchProducts = createAsyncThunk(
  "products/fetchProducts",
  async (params?: { offset?: number; limit?: number; categoryId?: string }) => {
    return await productsApi.getProducts(params)
  },
)

export const fetchProductBySlug = createAsyncThunk("products/fetchProductBySlug", async (slug: string) => {
  return await productsApi.getProductBySlug(slug)
})

export const searchProducts = createAsyncThunk("products/searchProducts", async (searchText: string) => {
  return await productsApi.searchProducts(searchText)
})

export const createProduct = createAsyncThunk(
  "products/createProduct",
  async (data: {
    name: string
    description: string
    images: string[]
    price: number
    categoryId: string
  }) => {
    return await productsApi.createProduct(data)
  },
)

export const updateProduct = createAsyncThunk(
  "products/updateProduct",
  async ({ id, data }: { id: string; data: { name: string; description: string } }) => {
    return await productsApi.updateProduct(id, data)
  },
)

export const deleteProduct = createAsyncThunk("products/deleteProduct", async (id: string) => {
  await productsApi.deleteProduct(id)
  return id
})

const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    setCurrentPage: (state, action) => {
      state.currentPage = action.payload
    },
    clearCurrentProduct: (state) => {
      state.currentProduct = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false
        state.total = action.payload.length
        const startIndex = (state.currentPage - 1) * state.limit
        const endIndex = startIndex + state.limit
        state.products = action.payload.slice(startIndex, endIndex)
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || "Failed to fetch products"
      })
      .addCase(searchProducts.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(searchProducts.fulfilled, (state, action) => {
        state.loading = false
        state.products = action.payload
      })
      .addCase(searchProducts.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || "Failed to search products"
      })
      .addCase(fetchProductBySlug.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchProductBySlug.fulfilled, (state, action) => {
        state.loading = false
        state.currentProduct = action.payload
      })
      .addCase(fetchProductBySlug.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || "Failed to fetch product"
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.products.unshift(action.payload)
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.products = state.products.filter((p) => p.id !== action.payload)
      })
  },
})

export const { setCurrentPage, clearCurrentProduct } = productsSlice.actions
export default productsSlice.reducer
