import { createSlice, type PayloadAction } from "@reduxjs/toolkit"
import type { AuthState } from "@/lib/types"

const initialState: AuthState = {
  token: null,
  email: null,
  isAuthenticated: false,
}

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuth: (state, action: PayloadAction<{ token: string; email: string }>) => {
      state.token = action.payload.token
      state.email = action.payload.email
      state.isAuthenticated = true
      if (typeof window !== "undefined") {
        localStorage.setItem("token", action.payload.token)
        localStorage.setItem("email", action.payload.email)
      }
    },
    logout: (state) => {
      state.token = null
      state.email = null
      state.isAuthenticated = false
      if (typeof window !== "undefined") {
        localStorage.removeItem("token")
        localStorage.removeItem("email")
      }
    },
    restoreAuth: (state, action: PayloadAction<{ token: string; email: string }>) => {
      state.token = action.payload.token
      state.email = action.payload.email
      state.isAuthenticated = true
    },
  },
})

export const { setAuth, logout, restoreAuth } = authSlice.actions
export default authSlice.reducer
