import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';

// Simple in-memory rate limiting (in production, use Redis or database)
const loginAttempts = new Map<string, { count: number; lastAttempt: number }>();
const MAX_ATTEMPTS = 5;
const LOCKOUT_DURATION = 15 * 60 * 1000; // 15 minutes

function getClientIP(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const realIP = request.headers.get('x-real-ip');
  
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  
  if (realIP) {
    return realIP;
  }
  
  return 'unknown';
}

function isRateLimited(ip: string): boolean {
  const attempts = loginAttempts.get(ip);
  
  if (!attempts) {
    return false;
  }
  
  const now = Date.now();
  
  // Reset if lockout period has passed
  if (now - attempts.lastAttempt > LOCKOUT_DURATION) {
    loginAttempts.delete(ip);
    return false;
  }
  
  return attempts.count >= MAX_ATTEMPTS;
}

function recordFailedAttempt(ip: string): void {
  const now = Date.now();
  const attempts = loginAttempts.get(ip) || { count: 0, lastAttempt: now };
  
  attempts.count += 1;
  attempts.lastAttempt = now;
  
  loginAttempts.set(ip, attempts);
}

function resetAttempts(ip: string): void {
  loginAttempts.delete(ip);
}

export async function GET() {
  const cookieStore = cookies();
  const authCookie = cookieStore.get('admin-auth');
  
  if (authCookie && authCookie.value === 'authenticated') {
    return NextResponse.json({ authenticated: true });
  } else {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const clientIP = getClientIP(request);
    
    // Check rate limiting
    if (isRateLimited(clientIP)) {
      return NextResponse.json({ 
        error: 'Too many failed attempts. Please try again in 15 minutes.' 
      }, { status: 429 });
    }
    
    const { username, password } = await request.json();
    
    if (!username || !password) {
      recordFailedAttempt(clientIP);
      return NextResponse.json({ error: 'Username and password are required' }, { status: 400 });
    }
    
    // Simple password comparison
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      resetAttempts(clientIP);
      
      const response = NextResponse.json({ success: true });
      
      // Set secure HTTP-only cookie that expires in 8 hours
      response.cookies.set('admin-auth', 'authenticated', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 60 * 60 * 8, // 8 hours
        path: '/'
      });
      
      return response;
    } else {
      recordFailedAttempt(clientIP);
      return NextResponse.json({ error: 'Invalid username or password' }, { status: 401 });
    }
  } catch (error) {
    console.error('Auth error:', error);
    return NextResponse.json({ error: 'Authentication failed' }, { status: 500 });
  }
}

export async function DELETE() {
  const response = NextResponse.json({ success: true });
  response.cookies.delete('admin-auth');
  return response;
}
