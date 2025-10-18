import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const cloudName = process.env.CLOUDINARY_KEY;

  if (!cloudName) {
    return NextResponse.json(
      { message: 'Cloudinary key is not configured.' },
      { status: 500 }
    );
  }

  try {
    const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json({ message: 'Failed to upload image', error: data }, { status: response.status });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Image upload error:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ message: 'Failed to upload image', error: errorMessage }, { status: 500 });
  }
}