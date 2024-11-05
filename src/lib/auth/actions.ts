'use server';

import { hash, verify } from '@node-rs/argon2';
import { eq } from 'drizzle-orm';
import { redirect } from 'next/navigation';
import type { FieldValues } from 'react-hook-form';

import { db } from '@/drizzle/db';
import { userTable } from '@/drizzle/schema';
import { getCurrentSession, setSessionTokenCookie } from '@/lib/auth/cookie-exchange';
import { createSession, generateSessionToken, invalidateSession } from '@/lib/auth/stateful-auth';
import { SignUpFormSchema } from '@/validations/auth';

const loggedInLandingPage = '/dashboard';
const failedAuthRedirectPage = '/login';
const logOutLandingPage = '/';

export async function createAccount(formData: FieldValues) {
  // 1. validate form
  const validatedFields = SignUpFormSchema.safeParse({
    email: formData.email,
    password: formData.password,
    confirmPassword: formData.confirmPassword,
  });
  if (!validatedFields.success) {
    return { success: false, error: 'Invalid form credentials' };
  }
  // check email isn't already in db

  const { email, password } = validatedFields.data;
  const existingUser = await db.query.userTable.findFirst({
    where: eq(userTable.email, email),
  });
  if (existingUser) {
    return { success: false, error: 'Email user already exists' };
  }
  // 2. hash password
  const hashedPassword = await hash(password);
  // 3. create account in db
  const userId = await db.insert(userTable).values({ email, password: hashedPassword }).returning({
    id: userTable.id,
  });
  // 4. generate token, create session, give cookie
  const token = generateSessionToken();
  const session = await createSession(token, userId[0].id);

  await setSessionTokenCookie(token, session.expiresAt);
  // 5. redirect
  redirect(loggedInLandingPage);
}

export async function signIn(formData: FieldValues) {
  // 1. Validate Form
  const validatedFields = SignUpFormSchema.omit({ confirmPassword: true }).safeParse({
    email: formData.email,
    password: formData.password,
  });
  if (!validatedFields.success) {
    return { success: false, error: 'Invalid form credentials' };
  }
  const { email, password } = validatedFields.data;
  // 2. Authenticate Email and password - check db for email user and check password is right
  const userResult = await db.query.userTable.findFirst({
    where: eq(userTable.email, email),
  });

  if (!userResult) {
    return { success: false, error: 'Incorrect email or password' };
  }

  const correctPassword = await verify(userResult.password, password);

  if (!correctPassword) {
    return { success: false, error: 'Incorrect email or password' };
  }
  // 2. Check they have no session already
  const { session } = await getCurrentSession();

  if (session !== null) {
    redirect(loggedInLandingPage);
  };
  // 3. Create Session
  const token = generateSessionToken();
  const createdSession = await createSession(token, userResult.id);
  await setSessionTokenCookie(token, createdSession.expiresAt);
  // 4. Redirect
  redirect(loggedInLandingPage);
}

export async function logout() {
  const { session } = await getCurrentSession();
  if (session) {
    await invalidateSession(session.id);
  };
  redirect(logOutLandingPage);
}

export async function authenticatePage(redirectTo: string = failedAuthRedirectPage) {
  const authResult = await getCurrentSession();
  if (authResult.session) {
    return;
  }
  redirect(redirectTo);
}
