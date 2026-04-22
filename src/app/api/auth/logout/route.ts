import { NextResponse } from 'next/server';

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

export async function POST(request: Request) {
  try {
    // Ideally you'd read the refresh token from cookies to send to backend to invalidate it
    // But mostly we just clear the cookies on the frontend
    const refreshToken = request.headers.get('cookie')?.match(/refreshToken=([^;]+)/)?.[1];

    if (refreshToken) {
      // Best effort backend logout call
      await fetch(`${BACKEND_URL}/api/v1/auth/logout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken }),
      }).catch(console.error);
    }

    const res = NextResponse.json({ success: true }, { status: 200 });

    res.cookies.delete('accessToken');
    res.cookies.delete('refreshToken');

    return res;
  } catch (error) {
    console.error('Logout Proxy Error:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
