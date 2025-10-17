
import { NextRequest, NextResponse } from 'next/server'
import { revalidateTag } from 'next/cache'

const API_BASE_URL = process.env.API_BASE_URL

// GET all products
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const token = request.headers.get('authorization')

  const headers: HeadersInit = {}
  if (token) {
    headers['Authorization'] = token
  }

  const offset = searchParams.get('offset')
  const limit = searchParams.get('limit')
  const categoryId = searchParams.get('categoryId')

  const query = new URLSearchParams()
  if (offset) query.append('offset', offset)
  if (limit) query.append('limit', limit)
  if (categoryId) query.append('categoryId', categoryId)

  try {
    const response = await fetch(`${API_BASE_URL}/products?${query.toString()}`, {
      headers,
      next: {
        revalidate: 600, // Revalidate every 10 minutes
        tags: ['products'],
      },
    })

    if (!response.ok) {
      const errorData = await response.json()
      return NextResponse.json({ message: 'Failed to fetch products', error: errorData }, { status: response.status })
    }

    const data = await response.json()
    return NextResponse.json({ products: data, total: data.length })
  } catch (error) {
    return NextResponse.json({ message: 'An unknown error occurred', error }, { status: 500 })
  }
}

// POST a new product
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const token = request.headers.get('authorization')

    if (!token) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const response = await fetch(`${API_BASE_URL}/products`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token,
      },
      body: JSON.stringify(body),
    })

    if (!response.ok) {
      const errorData = await response.json()
      return NextResponse.json({ message: 'Failed to create product', error: errorData }, { status: response.status })
    }

    // Revalidate the products cache
    revalidateTag('products')

    const data = await response.json()
    return NextResponse.json(data, { status: 201 })
  } catch (error) {
    return NextResponse.json({ message: 'An unknown error occurred', error }, { status: 500 })
  }
}
