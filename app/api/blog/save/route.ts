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
    const { title, slug, content, summary, tags } = await request.json();
    
    if (!title || !slug || !content) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Generate frontmatter
    const frontmatter = `---
title: ${title}
publishedAt: "${new Date().toISOString().split('T')[0]}"
summary: ${summary || ''}
tags: [${tags?.map((tag: string) => `"${tag}"`).join(', ') || ''}]
---

${content}`;

    // Create content/blog directory if it doesn't exist
    const contentDir = join(process.cwd(), 'content', 'blog');
    
    // Create public/blog/slug directory for images
    const publicBlogDir = join(process.cwd(), 'public', 'blog', slug);
    
    try {
      await mkdir(publicBlogDir, { recursive: true });
    } catch (error) {
      // Directory might already exist, ignore error
    }

    // Write the MDX file
    const filePath = join(contentDir, `${slug}.mdx`);
    await writeFile(filePath, frontmatter, 'utf8');

    return NextResponse.json({ 
      success: true, 
      message: 'Blog post saved successfully',
      slug 
    });

  } catch (error) {
    console.error('Error saving blog post:', error);
    return NextResponse.json({ error: 'Failed to save blog post' }, { status: 500 });
  }
}
