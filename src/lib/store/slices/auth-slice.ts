import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit"
import { authApi } from "@/lib/api"
import type { AuthState } from "@/lib/types"

const initialState: AuthState = {
  token: null,
  email: null,
  isAuthenticated: false,
}

export const login = createAsyncThunk("auth/login", async (email: string, { rejectWithValue }) => {
  try {
    const response = await authApi.login(email)
    return { token: response.token, email }
  } catch (error) {
    return rejectWithValue(error instanceof Error ? error.message : "Login failed")
  }
})

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
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
  extraReducers: (builder) => {
    builder.addCase(login.fulfilled, (state, action) => {
      state.token = action.payload.token
      state.email = action.payload.email
      state.isAuthenticated = true
      if (typeof window !== "undefined") {
        localStorage.setItem("token", action.payload.token)
        localStorage.setItem("email", action.payload.email)
      }
    })
  },
})

export const { logout, restoreAuth } = authSlice.actions
export default authSlice.reducer
