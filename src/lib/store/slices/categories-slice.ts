import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { categoriesApi } from "@/lib/api"
import type { CategoriesState } from "@/lib/types"

const initialState: CategoriesState = {
  categories: [],
  loading: false,
  error: null,
}

export const fetchCategories = createAsyncThunk("categories/fetchCategories", async () => {
  return await categoriesApi.getCategories()
})

const categoriesSlice = createSlice({
  name: "categories",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.loading = false
        state.categories = action.payload
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || "Failed to fetch categories"
      })
  },
})

export default categoriesSlice.reducer
