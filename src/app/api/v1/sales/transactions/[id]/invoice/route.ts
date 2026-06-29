import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const accessToken = request.cookies.get('accessToken')?.value;

  if (!accessToken) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const response = await fetch(`${BACKEND_URL}/api/v1/sales/transactions/${encodeURIComponent(id)}/invoice`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'X-Device-Id': request.headers.get('x-device-id') ?? 'frontend-proxy',
    },
    cache: 'no-store',
  });

  const headers = new Headers();
  const contentType = response.headers.get('content-type');
  const contentDisposition = response.headers.get('content-disposition');

  if (contentType) {
    headers.set('content-type', contentType);
  }
  if (contentDisposition) {
    headers.set('content-disposition', contentDisposition);
  }

  return new NextResponse(await response.arrayBuffer(), {
    status: response.status,
    headers,
  });
}
