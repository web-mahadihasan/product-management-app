
import { NextRequest, NextResponse } from 'next/server'
import { revalidateTag } from 'next/cache'

const API_BASE_URL = process.env.API_BASE_URL

// GET a single product by slug
export async function GET(request: NextRequest, { params }: { params: { slug: string } }) {
  const { slug } = params
  const token = request.headers.get('authorization')

  const headers: HeadersInit = {}
  if (token) {
    headers['Authorization'] = token
  }

  try {
    const response = await fetch(`${API_BASE_URL}/products/${slug}`, {
      headers,
      next: {
        revalidate: 600, // Revalidate every 10 minutes
        tags: ['products', `product-${slug}`],
      },
    })

    if (!response.ok) {
      const errorData = await response.json()
      return NextResponse.json({ message: 'Failed to fetch product', error: errorData }, { status: response.status })
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({ message: 'An unknown error occurred', error }, { status: 500 })
  }
}

// PUT (update) a product
export async function PUT(request: NextRequest, { params }: { params: { slug: string } }) {
  const { slug } = params

  try {
    const token = request.headers.get('authorization')
    if (!token) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    // First, get the product by slug to find its ID
    const productResponse = await fetch(`${API_BASE_URL}/products/${slug}`, {
      headers: {
        Authorization: token,
      },
    })

    if (!productResponse.ok) {
      return NextResponse.json({ message: "Product not found to update" }, { status: 404 })
    }
    const product = await productResponse.json()
    const productId = product.id

    // Now, update the product using the retrieved ID
    const body = await request.json()
    const response = await fetch(`${API_BASE_URL}/products/${productId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token,
      },
      body: JSON.stringify(body),
    })

    if (!response.ok) {
      const errorData = await response.json()
      return NextResponse.json({ message: 'Failed to update product', error: errorData }, { status: response.status })
    }

    // Revalidate caches
    revalidateTag('products')
    revalidateTag(`product-${slug}`)

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({ message: 'An unknown error occurred', error }, { status: 500 })
  }
}

// DELETE a product
export async function DELETE(request: NextRequest, { params }: { params: { slug: string } }) {
  const { slug: productId } = params // The slug is the product ID in this context

  try {
    const token = request.headers.get('authorization')
    if (!token) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const response = await fetch(`${API_BASE_URL}/products/${productId}`, {
      method: 'DELETE',
      headers: {
        Authorization: token,
      },
    })

    if (!response.ok) {
      const errorData = await response.json()
      return NextResponse.json({ message: "Failed to delete product", error: errorData }, { status: response.status })
    }

    revalidateTag('products')
    return NextResponse.json({ message: "Product deleted successfully" }, { status: 200 })
  } catch (error) {
    return NextResponse.json({ message: "An unknown error occurred", error }, { status: 500 })
  }
}
