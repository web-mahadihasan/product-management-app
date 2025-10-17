import { createSlice } from "@reduxjs/toolkit"
import type { CategoriesState } from "@/lib/types"

const initialState: CategoriesState = {
  categories: [],
  loading: false,
  error: null,
}

const categoriesSlice = createSlice({
  name: "categories",
  initialState,
  reducers: {},
})

export default categoriesSlice.reducer
