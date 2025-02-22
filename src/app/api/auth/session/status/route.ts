import type { NextRequest } from 'next/server';

import { logger } from '@/lib/logger';

export async function GET(request: NextRequest) {
  const sessionCookie = request.cookies.get('cruxSessionToken');
  logger.info('Session', sessionCookie);
  const response = await fetch(`${process.env.AUTH_URL}/auth/session/status`, {
    method: 'GET',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      'Cookie': `${sessionCookie?.name}=${sessionCookie?.value}`,
    },
  });

  return response;
}
