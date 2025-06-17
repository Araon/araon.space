import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { cookies } from 'next/headers';

export async function POST(request: NextRequest) {
  // Check authentication
  const cookieStore = cookies();
  const authCookie = cookieStore.get('admin-auth');
  
  if (!authCookie || authCookie.value !== 'authenticated') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const slug = formData.get('slug') as string;

    if (!file || !slug) {
      return NextResponse.json({ error: 'Missing file or slug' }, { status: 400 });
    }

    // Create directory for this blog post's images
    const blogImageDir = join(process.cwd(), 'public', 'blog', slug);
    await mkdir(blogImageDir, { recursive: true });

    // Always save as image.png (overwrite if exists)
    const filename = 'image.png';
    
    // Save file
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const filePath = join(blogImageDir, filename);
    await writeFile(filePath, buffer);

    // Return the public URL path for the image
    const publicUrl = `/blog/${slug}/${filename}`;

    return NextResponse.json({ 
      success: true, 
      filename,
      url: publicUrl
    });

  } catch (error) {
    console.error('Error uploading image:', error);
    return NextResponse.json({ error: 'Failed to upload image' }, { status: 500 });
  }
}
