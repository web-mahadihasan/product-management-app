
import { NextRequest, NextResponse } from 'next/server'

const API_BASE_URL = process.env.API_BASE_URL

// POST login
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email } = body

    if (!email) {
      return NextResponse.json({ message: 'Email is required' }, { status: 400 })
    }

    const response = await fetch(`${API_BASE_URL}/auth`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
      cache: 'no-store',
    })

    if (!response.ok) {
      const errorData = await response.json()
      return NextResponse.json({ message: 'Login failed', error: errorData }, { status: response.status })
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({ message: 'An unknown error occurred', error }, { status: 500 })
  }
}
