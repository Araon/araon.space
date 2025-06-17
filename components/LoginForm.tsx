'use client';

import { useState } from 'react';
import Image from 'next/image';

interface LoginFormProps {
  onLogin: (success: boolean) => void;
}

export default function LoginForm({ onLogin }: LoginFormProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [attempts, setAttempts] = useState(0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        onLogin(true);
        setAttempts(0);
      } else {
        setAttempts(prev => prev + 1);
        
        if (response.status === 429) {
          setError(data.error || 'Too many failed attempts. Please try again later.');
        } else {
          setError(data.error || 'Invalid credentials');
        }
        
        onLogin(false);
      }
    } catch (error) {
      setError('Login failed. Please try again.');
      setAttempts(prev => prev + 1);
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-[700px] px-6 pb-24 pt-16 md:px-6 md:pb-44 md:pt-20">
      <div className="max-w-md mx-auto">
        {/* Header with logo and brand styling */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-6">
            <div className="p-3 bg-secondary rounded-lg border border-primary">
              <Image height={32} width={32} src="/crown.svg" alt="Admin Access" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-primary mb-2">
            Admin Portal
          </h1>
          {attempts > 0 && attempts < 5 && (
            <div className="mt-3 px-3 py-1 bg-secondaryA rounded-md border border-primary">
              <p className="text-xs text-tertiary">
                Security: {attempts}/5 attempts used
              </p>
            </div>
          )}
        </div>

        {/* Login Form Card */}
        <div className="bg-secondary border border-primary rounded-lg p-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-4">
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-primary mb-2">
                  Username
                </label>
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  className="w-full px-3 py-2.5 bg-primary border border-secondary rounded-md text-primary placeholder-tertiary focus:outline-none focus:ring-2 focus:ring-link focus:border-transparent transition-colors"
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  disabled={isLoading}
                  autoComplete="username"
                />
              </div>
              
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-primary mb-2">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  className="w-full px-3 py-2.5 bg-primary border border-secondary rounded-md text-primary placeholder-tertiary focus:outline-none focus:ring-2 focus:ring-link focus:border-transparent transition-colors"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                  autoComplete="current-password"
                />
              </div>
            </div>

            {error && (
              <div className={`p-3 rounded-md text-sm border ${
                error.includes('Too many') 
                  ? 'bg-red-50 border-red-200 text-red-700 dark:bg-red-950/20 dark:border-red-800/30 dark:text-red-400' 
                  : 'bg-orange-50 border-orange-200 text-orange-700 dark:bg-orange-950/20 dark:border-orange-800/30 dark:text-orange-400'
              }`}>
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  {error}
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading || !username || !password}
              className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-lg hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-4 focus:ring-blue-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl active:scale-[0.98] border border-blue-500"
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Authenticating...
                </div>
              ) : (
                'Login'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
