import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Routes that don't require authentication
const publicRoutes = [
  '/',
  '/login',
  '/register',
  '/forgot-password',
  '/reset-password',
  '/verify-email'
];

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  // Check if the route is public
  const isPublicRoute = publicRoutes.some(route => 
    req.nextUrl.pathname.startsWith(route)
  );

  try {
    // Check auth status
    const {
      data: { session },
      error,
    } = await supabase.auth.getSession();

    if (error) throw error;

    // Handle authentication logic
    if (!session && !isPublicRoute) {
      // Redirect to login if attempting to access protected route
      const redirectUrl = new URL('/login', req.url);
      redirectUrl.searchParams.set('redirect', req.nextUrl.pathname);
      return NextResponse.redirect(redirectUrl);
    }

    if (session && isPublicRoute && req.nextUrl.pathname !== '/') {
      // Redirect to dashboard if already logged in
      return NextResponse.redirect(new URL('/dashboard', req.url));
    }

    return res;
  } catch (error) {
    console.error('Auth middleware error:', error);
    // Clear any existing session on error
    const response = NextResponse.redirect(new URL('/login', req.url));
    return response;
  }
}

// Configure which routes use this middleware
export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|public|api).*)',
  ],
};
