'server-only';
import { sha256 } from '@oslojs/crypto/sha2';
import { encodeBase32LowerCaseNoPadding, encodeHexLowerCase } from '@oslojs/encoding';
import { eq } from 'drizzle-orm';

import { db } from '@/drizzle/db';
import { type Session, sessionTable, type User, userTable } from '@/drizzle/schema';

const sessionDefaultDuration = 1000 * 60 * 60 * 24 * 30;
const sessionDefaultRevalidateDuration = 1000 * 60 * 60 * 24 * 15;

export function generateSessionToken() {
  const bytes = new Uint8Array(20);
  crypto.getRandomValues(bytes);
  const token = encodeBase32LowerCaseNoPadding(bytes);
  return token;
}

export async function createSession(token: string, userId: number, sessionDuration: number = sessionDefaultDuration): Promise<Session> {
  const sessionIdHash = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
  const session: Session = {
    id: sessionIdHash,
    userId,
    expiresAt: new Date(Date.now() + sessionDuration),
  };
  await db.insert(sessionTable).values(session);
  return session;
};

export async function validateSessionToken(token: string, sessionDuration: number = sessionDefaultDuration, sessionRevalidateDuration: number = sessionDefaultRevalidateDuration): Promise<SessionValidationResult> {
  const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
  const result = await db
    .select({ user: userTable, session: sessionTable })
    .from(sessionTable)
    .innerJoin(userTable, eq(sessionTable.userId, userTable.id))
    .where(eq(sessionTable.id, sessionId));
  if (result.length < 1) {
    return { session: null, user: null };
  }
  const { user, session } = result[0];
  if (Date.now() >= session.expiresAt.getTime()) {
    await db.delete(sessionTable).where(eq(sessionTable.id, session.id));
    return { session: null, user: null };
  }
  if (Date.now() >= session.expiresAt.getTime() - sessionRevalidateDuration) {
    session.expiresAt = new Date(Date.now() + sessionDuration);
    await db
      .update(sessionTable)
      .set({
        expiresAt: session.expiresAt,
      })
      .where(eq(sessionTable.id, session.id));
  }
  return { session, user };
};

export async function invalidateSession(sessionId: string): Promise<void> {
  await db.delete(sessionTable).where(eq(sessionTable.id, sessionId));
}

export type SessionValidationResult =
  | { session: Session; user: User }
  | { session: null; user: null };
