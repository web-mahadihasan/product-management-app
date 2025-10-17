import { createSlice } from "@reduxjs/toolkit"
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
})

export const { setCurrentPage, clearCurrentProduct } = productsSlice.actions
export default productsSlice.reducer
