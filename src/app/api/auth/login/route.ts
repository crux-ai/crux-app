import { type NextRequest, NextResponse } from 'next/server';

import { logger } from '@/lib/logger';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const response = await fetch(`${process.env.AUTH_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: data.message || 'Login failed' },
        { status: response.status },
      );
    }

    const nextResponse = NextResponse.json(data, { status: response.status });

    const setCookieHeaders = response.headers.get('Set-Cookie');

    if (setCookieHeaders) {
      nextResponse.headers.set('Set-Cookie', setCookieHeaders);
    } else {
      logger.error('No cookie set');
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 },
      );
    }

    return nextResponse;
  } catch (error) {
    logger.error(error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}
