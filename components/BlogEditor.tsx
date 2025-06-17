'use client';

import { useState, useRef } from 'react';
import dynamic from 'next/dynamic';
import Image from 'next/image';

// Dynamically import the markdown editor to avoid SSR issues
const MDEditor = dynamic(() => import('@uiw/react-md-editor'), { 
  ssr: false,
  loading: () => (
    <div className="w-full h-[400px] bg-tertiary border border-secondary rounded-lg flex items-center justify-center">
      <div className="text-secondary">Loading editor...</div>
    </div>
  )
});

export default function BlogEditor() {
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [summary, setSummary] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [content, setContent] = useState('# Your Blog Post Title\n\nStart writing your amazing content here...');
  const [isAutoSlug, setIsAutoSlug] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [message, setMessage] = useState('');
  const [currentTag, setCurrentTag] = useState('');
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Auto-generate slug from title
  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    setTitle(newTitle);
    
    if (isAutoSlug) {
      setSlug(generateSlug(newTitle));
    }
  };

  const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSlug(e.target.value);
    setIsAutoSlug(false);
  };

  const addTag = () => {
    if (currentTag.trim() && !tags.includes(currentTag.trim())) {
      setTags([...tags, currentTag.trim()]);
      setCurrentTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag();
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !slug) {
      setMessage('Please set a slug before uploading images');
      return;
    }

    setIsUploading(true);
    setMessage('');

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('slug', slug);

      const response = await fetch('/api/blog/upload', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const imageMarkdown = `\n<Image\n  src="/blog/${slug}/image.png"\n  alt="Description"\n  width={800}\n  height={600}\n/>\n`;
        setContent(content + imageMarkdown);
        setMessage('Image uploaded successfully as image.png');
      } else {
        setMessage('Failed to upload image');
      }
    } catch (error) {
      setMessage('Error uploading image');
      console.error('Upload error:', error);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleSave = async () => {
    if (!title || !slug || !content) {
      setMessage('Please fill in title, slug, and content');
      return;
    }

    setIsSaving(true);
    setMessage('');

    try {
      const response = await fetch('/api/blog/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          slug,
          content,
          summary,
          tags,
        }),
      });

      if (response.ok) {
        setMessage('Blog post saved successfully!');
        // Reset form
        setTitle('');
        setSlug('');
        setSummary('');
        setTags([]);
        setContent('# Your Blog Post Title\n\nStart writing your amazing content here...');
        setIsAutoSlug(true);
      } else {
        const data = await response.json();
        setMessage(`Failed to save: ${data.error}`);
      }
    } catch (error) {
      setMessage('Error saving blog post');
      console.error('Save error:', error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Title */}
        <div className="space-y-2">
          <label htmlFor="title" className="block text-sm font-medium text-primary">
            Post Title
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={handleTitleChange}
            className="w-full px-4 py-3 bg-secondary border border-secondary rounded-lg focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand text-primary placeholder:text-tertiary transition-all"
            placeholder="Enter your blog post title"
          />
        </div>

        {/* Slug */}
        <div className="space-y-2">
          <label htmlFor="slug" className="block text-sm font-medium text-primary">
            URL Slug {isAutoSlug && <span className="text-tertiary text-xs">(auto-generated)</span>}
          </label>
          <input
            type="text"
            id="slug"
            value={slug}
            onChange={handleSlugChange}
            className="w-full px-4 py-3 bg-secondary border border-secondary rounded-lg focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand text-primary placeholder:text-tertiary transition-all font-mono text-sm"
            placeholder="post-url-slug"
          />
          {slug && (
            <p className="text-xs text-tertiary">
              URL: <span className="text-brand">araon.space/blog/{slug}</span>
            </p>
          )}
        </div>
      </div>

      {/* Summary */}
      <div className="space-y-2">
        <label htmlFor="summary" className="block text-sm font-medium text-primary">
          Summary
        </label>
        <input
          type="text"
          id="summary"
          value={summary}
          onChange={(e) => setSummary(e.target.value)}
          className="w-full px-4 py-3 bg-secondary border border-secondary rounded-lg focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand text-primary placeholder:text-tertiary transition-all"
          placeholder="Brief description of your post"
        />
      </div>

      {/* Tags */}
      <div className="space-y-3">
        <label className="block text-sm font-medium text-primary">Tags</label>
        
        {/* Tag Display */}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 px-3 py-1 bg-brand/10 text-brand border border-brand/20 rounded-full text-sm transition-all hover:bg-brand/20"
              >
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M17.707 9.293a1 1 0 010 1.414l-7 7a1 1 0 01-1.414 0l-7-7A.997.997 0 012 10V5a3 3 0 013-3h5c.256 0 .512.098.707.293l7 7zM5 6a1 1 0 100 2 1 1 0 000-2z" clipRule="evenodd" />
                </svg>
                {tag}
                <button
                  type="button"
                  onClick={() => removeTag(tag)}
                  className="ml-1 text-brand/70 hover:text-brand transition-colors"
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </span>
            ))}
          </div>
        )}

        {/* Tag Input */}
        <div className="flex gap-2">
          <input
            type="text"
            value={currentTag}
            onChange={(e) => setCurrentTag(e.target.value)}
            onKeyPress={handleKeyPress}
            className="flex-1 px-4 py-2 bg-secondary border border-secondary rounded-lg focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand text-primary placeholder:text-tertiary transition-all"
            placeholder="Add a tag and press Enter"
          />
          <button
            type="button"
            onClick={addTag}
            className="px-4 py-2 bg-brand text-white rounded-lg hover:bg-brand/90 focus:outline-none focus:ring-2 focus:ring-brand/20 transition-all flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Add
          </button>
        </div>
      </div>

      {/* Image Upload */}
      <div className="space-y-3">
        <label className="block text-sm font-medium text-primary">Featured Image</label>
        <div className="flex items-center gap-4">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading || !slug}
            className="flex items-center gap-2 px-4 py-2 bg-tertiary border border-secondary rounded-lg hover:bg-secondary hover:border-brand/20 focus:outline-none focus:ring-2 focus:ring-brand/20 disabled:opacity-50 disabled:cursor-not-allowed text-primary transition-all"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            {isUploading ? 'Uploading...' : 'Upload Image'}
          </button>
          {!slug && (
            <span className="text-sm text-tertiary">Set a slug first to upload images</span>
          )}
        </div>
      </div>

      {/* Content Editor */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-primary">Content</label>
        <div className="border border-secondary rounded-lg overflow-hidden" data-color-mode="light">
          <MDEditor
            value={content}
            onChange={(val) => setContent(val || '')}
            height={500}
            preview="edit"
            hideToolbar={false}
            data-color-mode="light"
          />
        </div>
        <p className="text-xs text-tertiary">
          Supports Markdown, MDX, and JSX components. Use the toolbar above or type markdown directly.
        </p>
      </div>

      {/* Message */}
      {message && (
        <div className={`p-4 rounded-lg border ${
          message.includes('successfully') || message.includes('uploaded successfully') 
            ? 'bg-green-50 border-green-200 text-green-800' 
            : 'bg-red-50 border-red-200 text-red-800'
        }`}>
          <div className="flex items-center gap-2">
            {message.includes('successfully') ? (
              <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            ) : (
              <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            )}
            {message}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex justify-between items-center pt-6 border-t border-secondary">
        <button
          type="button"
          onClick={() => {
            setTitle('');
            setSlug('');
            setSummary('');
            setTags([]);
            setContent('# Your Blog Post Title\n\nStart writing your amazing content here...');
            setIsAutoSlug(true);
            setMessage('');
          }}
          className="px-4 py-2 text-secondary hover:text-primary border border-secondary hover:border-primary rounded-lg transition-all flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Clear All
        </button>

        <button
          onClick={handleSave}
          disabled={isSaving}
          className="px-6 py-3 bg-brand text-white rounded-lg hover:bg-brand/90 focus:outline-none focus:ring-2 focus:ring-brand/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2 font-medium"
        >
          {isSaving ? (
            <>
              <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25" />
                <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" className="opacity-75" />
              </svg>
              Publishing...
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              Publish Post
            </>
          )}
        </button>
      </div>
    </div>
  );
}
