
import { NextRequest, NextResponse } from 'next/server'

const API_BASE_URL = process.env.API_BASE_URL

// GET all categories
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const token = request.headers.get('authorization')

  const headers: HeadersInit = {}
  if (token) {
    headers['Authorization'] = token
  }

  const offset = searchParams.get('offset')
  const limit = searchParams.get('limit')

  const query = new URLSearchParams()
  if (offset) query.append('offset', offset)
  if (limit) query.append('limit', limit)

  try {
    const response = await fetch(`${API_BASE_URL}/categories?${query.toString()}`, {
      headers,
      next: {
        revalidate: 600,
        tags: ['categories'],
      },
    })

    if (!response.ok) {
      const errorData = await response.json()
      return NextResponse.json({ message: 'Failed to fetch categories', error: errorData }, { status: response.status })
    }

    const data = await response.json()
    return NextResponse.json({ categories: data })
  } catch (error) {
    return NextResponse.json({ message: 'An unknown error occurred', error }, { status: 500 })
  }
}
