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
  const { pathname } = request.nextUrl;
  const accessToken = request.cookies.get('accessToken')?.value;
  const refreshToken = request.cookies.get('refreshToken')?.value;

  const isAuthenticated = !!(accessToken || refreshToken);

  // If user is trying to access auth pages but is already authenticated
  if (isAuthenticated && pathname.startsWith('/login')) {
    // We could parse the token to redirect them to the correct dashboard
    if (accessToken) {
      const payload = parseJwt(accessToken);
      if (payload?.role === 'STAFF') {
        return NextResponse.redirect(new URL('/sales', request.url));
      }
      return NextResponse.redirect(new URL('/admin', request.url));
    }
    // Default fallback if we only have refresh token
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
  matcher: ['/admin/:path*', '/sales/:path*', '/login'],
};
