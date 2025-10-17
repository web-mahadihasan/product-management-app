import { configureStore } from "@reduxjs/toolkit"
import authReducer from "./slices/auth-slice"
import productsReducer from "./slices/products-slice"
import categoriesReducer from "./slices/categories-slice"

export const store = configureStore({
  reducer: {
    auth: authReducer,
    products: productsReducer,
    categories: categoriesReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
