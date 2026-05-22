import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

function parseJwt(token: string) {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    return null;
  }
}

export function proxy(request: NextRequest) {
  const url = request.nextUrl.clone();
  const { pathname } = url;
  const host = request.headers.get('host') || '';

  // Determine if requesting host starts with 'admin.'
  const isAdminSubdomain = host.startsWith('admin.');

  // 1. Subdomain rewriting and routing logic
  if (isAdminSubdomain) {
    // Rewrite root access on admin subdomain to login page
    if (pathname === '/') {
      url.pathname = '/login';
      return NextResponse.rewrite(url);
    }
  } else {
    // On the main domain, redirect admin, sales, or login paths to the admin subdomain
    const adminRoutes = ['/login', '/admin', '/sales'];
    const isProtectedPath = adminRoutes.some(
      (route) => pathname === route || pathname.startsWith(route + '/')
    );

    if (isProtectedPath) {
      const protocol = request.headers.get('x-forwarded-proto') || 'http';
      const newHost = host.startsWith('admin.') ? host : `admin.${host}`;
      const redirectUrl = `${protocol}://${newHost}${pathname}${url.search}`;
      return NextResponse.redirect(new URL(redirectUrl));
    }
  }

  // 2. Authentication and Authorization Guard
  const accessToken = request.cookies.get('accessToken')?.value;
  const refreshToken = request.cookies.get('refreshToken')?.value;
  const isAuthenticated = !!(accessToken || refreshToken);

  // If user is trying to access auth pages but is already authenticated
  if (isAuthenticated && pathname.startsWith('/login')) {
    if (accessToken) {
      const payload = parseJwt(accessToken);
      if (payload?.role === 'STAFF') {
        return NextResponse.redirect(new URL('/sales', request.url));
      }
      return NextResponse.redirect(new URL('/admin', request.url));
    }
    return NextResponse.redirect(new URL('/admin', request.url));
  }

  // Protect Admin Routes
  if (pathname.startsWith('/admin')) {
    if (!isAuthenticated) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
    
    // Check Role if we have an access token
    if (accessToken) {
      const payload = parseJwt(accessToken);
      if (payload && payload.role !== 'ADMIN' && payload.role !== 'OWNER') {
        // Staff shouldn't access admin
        return NextResponse.redirect(new URL('/sales', request.url));
      }
    }
  }

  // Protect Sales Routes
  if (pathname.startsWith('/sales')) {
    if (!isAuthenticated) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};

