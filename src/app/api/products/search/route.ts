
import { NextRequest, NextResponse } from 'next/server'

const API_BASE_URL = process.env.API_BASE_URL

// GET search products
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const token = request.headers.get('authorization')

  const headers: HeadersInit = {}
  if (token) {
    headers['Authorization'] = token
  }

  const searchedText = searchParams.get('searchedText')

  if (!searchedText) {
    return NextResponse.json({ message: 'Search text is required' }, { status: 400 })
  }

  try {
    const response = await fetch(`${API_BASE_URL}/products/search?searchedText=${encodeURIComponent(searchedText)}`, {
      headers,
      next: {
        revalidate: 300,
      },
    })

    if (!response.ok) {
      const errorData = await response.json()
      return NextResponse.json({ message: 'Failed to search products', error: errorData }, { status: response.status })
    }

    const data = await response.json()
    return NextResponse.json({ products: data, total: data.length })
  } catch (error) {
    return NextResponse.json({ message: 'An unknown error occurred', error }, { status: 500 })
  }
}
