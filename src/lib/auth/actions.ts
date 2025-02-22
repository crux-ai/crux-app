'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import type { FieldValues } from 'react-hook-form';

import { SignUpFormSchema } from '@/validations/auth';

import { logger } from '../logger';

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
  const { email, password } = validatedFields.data;
  // Call register API
  // If it returns 201 created then success
  // If it doesnt then return not sucess
  // 400 is bad request
  const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email,
      password,
    }),
  });

  if (response.ok) {
    logger.info('User registered successfully');
    redirect(loggedInLandingPage);
  } else {
    logger.error('Error registering user:', response.json);
    return { success: false, error: 'Unsuccessful registration' };
  }
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

  const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email,
      password,
    }),
    credentials: 'include',
  });

  if (response.ok) {
    logger.info('Logged in successfully', response);
    const setCookieHeader = response.headers.get('Set-Cookie');
    if (setCookieHeader) {
      const [cookieValue, ...optionValues] = setCookieHeader.split(';');
      const [cookieName, token] = cookieValue.split('=');

      const options: {
        domain?: string;
        path?: string;
        expires?: Date;
        maxAge?: number;
        secure?: boolean;
        httpOnly?: boolean;
        sameSite?: 'strict' | 'lax' | 'none';
      } = {};

      optionValues.forEach((option) => {
        const [key, value] = option.trim().split('=');
        const keyLower = key.toLowerCase();

        switch (keyLower) {
          case 'domain':
            options.domain = value;
            break;
          case 'path':
            options.path = value;
            break;
          case 'expires':
            options.expires = new Date(value);
            break;
          case 'max-age':
            options.maxAge = Number.parseInt(value);
            break;
          case 'secure':
            options.secure = true;
            break;
          case 'httponly':
            options.httpOnly = true;
            break;
          case 'samesite':
            options.sameSite = value.toLowerCase() as 'strict' | 'lax' | 'none';
            break;
        }
      });

      cookies().set(cookieName, token, options);
    }

    redirect(loggedInLandingPage);
  } else {
    logger.error('Error logging in user:', response.json);
    return { success: false, error: 'Unsuccessful login' };
  }
}

export async function logout() {
  const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/auth/logout`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  });

  if (response.ok) {
    const setCookieHeader = response.headers.get('Set-Cookie');
    if (setCookieHeader) {
      const [cookieValue, ...optionValues] = setCookieHeader.split(';');
      const [cookieName, token] = cookieValue.split('=');

      const options: {
        domain?: string;
        path?: string;
        expires?: Date;
        maxAge?: number;
        secure?: boolean;
        httpOnly?: boolean;
        sameSite?: 'strict' | 'lax' | 'none';
      } = {};

      optionValues.forEach((option) => {
        const [key, value] = option.trim().split('=');
        const keyLower = key.toLowerCase();

        switch (keyLower) {
          case 'domain':
            options.domain = value;
            break;
          case 'path':
            options.path = value;
            break;
          case 'expires':
            options.expires = new Date(value);
            break;
          case 'max-age':
            options.maxAge = Number.parseInt(value);
            break;
          case 'secure':
            options.secure = true;
            break;
          case 'httponly':
            options.httpOnly = true;
            break;
          case 'samesite':
            options.sameSite = value.toLowerCase() as 'strict' | 'lax' | 'none';
            break;
        }
      });

      cookies().set(cookieName, token, options);
    }
    logger.info('succesfully logged out');
    redirect(logOutLandingPage);
  } else {
    logger.error('Error logging in user:', response.json);
    return { success: false, error: 'Unsuccessful login' };
  }
}

export async function authenticatePage(redirectTo: string = failedAuthRedirectPage) {
  const cookieStore = cookies();

  const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/auth/session/status`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Cookie': cookieStore.toString(),
    },
  });

  if (response.ok) {
    logger.info('Session successfully verified');
    return;
  }
  logger.info('Invalid session');
  redirect(redirectTo);
}

export async function skipAuthentication(redirectTo: string = loggedInLandingPage) {
  const cookieStore = cookies();
  const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/auth/session/status`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Cookie': cookieStore.toString(),
    },
  });
  if (response.ok) {
    redirect(redirectTo);
  }
  logger.info('Session successfully verified, and auth skipped');
}
