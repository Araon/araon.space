'use client';

import { useState, useEffect } from 'react';
import BlogEditor from '@/components/BlogEditor';
import LoginForm from '@/components/LoginForm';
import Image from 'next/image';

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check if user is already authenticated
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await fetch('/api/auth');
      if (response.ok) {
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
    }
  };

  const handleLogin = (success: boolean) => {
    if (success) {
      setIsAuthenticated(true);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth', { method: 'DELETE' });
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <>
      {!isAuthenticated ? (
        <LoginForm onLogin={handleLogin} />
      ) : (
        <div className="mx-auto max-w-[700px] px-6 pb-24 pt-16 md:px-6 md:pb-44 md:pt-20">
          {/* Admin Header */}
          <header className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-secondary rounded-lg border border-primary">
                  <Image height={24} width={24} src="/crown.svg" alt="Admin" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-primary">Editor</h1>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-secondary hover:text-primary border border-secondary hover:border-primary rounded-md transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Sign out
              </button>
            </div>
            
            {/* Status indicator */}
            <div className="flex items-center gap-2 px-3 py-2 bg-tertiary rounded-md border border-secondary">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-xs text-secondary">Admin session active</span>
            </div>
          </header>

          {/* Blog Editor */}
          <main>
            <BlogEditor />
          </main>
        </div>
      )}
    </>
  );
}
