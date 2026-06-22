import { NextRequest, NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';

// Cloudinary reads CLOUDINARY_URL from environment automatically
cloudinary.config();

export async function POST(request: NextRequest) {
  try {
    // Validate Cloudinary is configured
    if (!process.env.CLOUDINARY_URL) {
      console.error('Missing CLOUDINARY_URL environment variable');
      return NextResponse.json(
        { 
          error: 'Upload service not configured. Missing CLOUDINARY_URL.',
          ok: false
        }, 
        { status: 500 }
      );
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;
    const folder = formData.get('folder') as string || 'tuordenya';

    if (!file) {
      return NextResponse.json({ error: 'No file provided', ok: false }, { status: 400 });
    }

    // Convert file to base64
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64 = `data:${file.type};base64,${buffer.toString('base64')}`;

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(base64, {
      folder,
      transformation: [{ width: 800, height: 800, crop: 'limit' }, { quality: 'auto' }],
    });

    return NextResponse.json({
      ok: true,
      url: result.secure_url,
      public_id: result.public_id,
    });
  } catch (error) {
    console.error('Upload error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to upload image';
    return NextResponse.json({ error: errorMessage, ok: false }, { status: 500 });
  }
}