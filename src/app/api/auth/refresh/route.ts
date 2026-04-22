import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const refreshToken = cookieStore.get('refreshToken')?.value;

    if (!refreshToken) {
      return NextResponse.json({ message: 'No refresh token' }, { status: 401 });
    }

    const response = await fetch(`${BACKEND_URL}/api/v1/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const res = NextResponse.json(errorData, { status: response.status });
      // If refresh fails, clear cookies
      res.cookies.delete('accessToken');
      res.cookies.delete('refreshToken');
      return res;
    }

    const data = await response.json();
    const newAccessToken = data.accessToken;
    // Backend might also rotate refresh token
    const newRefreshToken = data.refreshToken || refreshToken;

    const res = NextResponse.json({ accessToken: newAccessToken }, { status: 200 });

    res.cookies.set('accessToken', newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 15,
    });

    res.cookies.set('refreshToken', newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    });

    return res;
  } catch (error) {
    console.error('Refresh Proxy Error:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
