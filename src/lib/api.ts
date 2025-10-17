const API_BASE_URL = "https://api.bitechx.com"

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message)
    this.name = "ApiError"
  }
}

async function fetchWithAuth(url: string, options: RequestInit = {}) {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  }

  const response = await fetch(url, {
    ...options,
    headers,
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new ApiError(response.status, errorText || response.statusText)
  }

  return response.json()
}

// Auth API
export const authApi = {
  login: async (email: string) => {
    return fetchWithAuth(`${API_BASE_URL}/auth`, {
      method: "POST",
      body: JSON.stringify({ email }),
    })
  },
}

// Products API
export const productsApi = {
  getProducts: async (params?: { offset?: number; limit?: number; categoryId?: string }) => {
    const searchParams = new URLSearchParams()
    if (params?.offset !== undefined) searchParams.append("offset", params.offset.toString())
    if (params?.limit !== undefined) searchParams.append("limit", params.limit.toString())
    if (params?.categoryId) searchParams.append("categoryId", params.categoryId)

    const url = `${API_BASE_URL}/products${searchParams.toString() ? `?${searchParams}` : ""}`
    return fetchWithAuth(url)
  },

  getProductBySlug: async (slug: string) => {
    return fetchWithAuth(`${API_BASE_URL}/products/${slug}`)
  },

  searchProducts: async (searchText: string) => {
    return fetchWithAuth(`${API_BASE_URL}/products/search?searchedText=${encodeURIComponent(searchText)}`)
  },

  createProduct: async (data: {
    name: string
    description: string
    images: string[]
    price: number
    categoryId: string
  }) => {
    return fetchWithAuth(`${API_BASE_URL}/products`, {
      method: "POST",
      body: JSON.stringify(data),
    })
  },

  updateProduct: async (
    id: string,
    data: {
      name: string
      description: string
      price?: number
      categoryId?: string
      images?: string[]
    },
  ) => {
    return fetchWithAuth(`${API_BASE_URL}/products/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    })
  },

  deleteProduct: async (id: string) => {
    return fetchWithAuth(`${API_BASE_URL}/products/${id}`, {
      method: "DELETE",
    })
  },
}

// Categories API
export const categoriesApi = {
  getCategories: async (params?: { offset?: number; limit?: number }) => {
    const searchParams = new URLSearchParams()
    if (params?.offset !== undefined) searchParams.append("offset", params.offset.toString())
    if (params?.limit !== undefined) searchParams.append("limit", params.limit.toString())

    const url = `${API_BASE_URL}/categories${searchParams.toString() ? `?${searchParams}` : ""}`
    return fetchWithAuth(url)
  },

  searchCategories: async (searchText: string) => {
    return fetchWithAuth(`${API_BASE_URL}/categories/search?searchedText=${encodeURIComponent(searchText)}`)
  },
}
