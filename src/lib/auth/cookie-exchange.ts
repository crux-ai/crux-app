'use server';
import { cookies } from 'next/headers';
import { cache } from 'react';

import { type SessionValidationResult, validateSessionToken } from '@/lib/auth/stateful-auth';

export async function setSessionTokenCookie(token: string, expiresAt: Date): Promise<void> {
  const cookieStore = cookies();
  cookieStore.set('session', token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    expires: expiresAt,
    path: '/',
  });
}

export async function deleteSessionTokenCookie(): Promise<void> {
  const cookieStore = cookies();
  cookieStore.set('session', '', {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 0,
    path: '/',
  });
}

// Cant be used in middleware
export const getCurrentSession = cache(async (): Promise<SessionValidationResult> => {
  const cookieStore = cookies();
  const token = cookieStore.get('session')?.value ?? null;
  if (token === null) {
    return { session: null, user: null };
  }
  const result = await validateSessionToken(token);

  return result;
});
