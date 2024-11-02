'use server';

import bcrypt from 'bcrypt';
import { eq } from 'drizzle-orm';
import { redirect } from 'next/navigation';
import type { FieldValues } from 'react-hook-form';

import { db } from '@/drizzle/db';
import { users } from '@/drizzle/schema';
import { createSession, deleteSession } from '@/lib/auth/stateless-session';
import { SignUpFormSchema } from '@/validations/auth';

export async function signup(
  formData: FieldValues,
) {
  // 1. Validate form fields
  const validatedFields = SignUpFormSchema.safeParse({
    email: formData.email,
    password: formData.password,
    confirmPassword: formData.confirmPassword,
  });

  // If any form fields are invalid, return early
  if (!validatedFields.success) {
    return {
      code: 2,
      message: 'Form Validation failed',
    };
  }

  // 2. Prepare data for insertion into database
  const { email, password } = validatedFields.data;

  // 3. Check if the user's email already exists
  const existingUser = await db.query.users.findFirst({
    where: eq(users.email, email),
  });

  if (existingUser) {
    return {
      code: 1,
      message: 'Email already exists, please use a different email or login.',
    };
  }

  // Hash the user's password
  const hashedPassword = await bcrypt.hash(password, 10);

  // 3. Insert the user into the database or call an Auth Provider's API
  const data = await db
    .insert(users)
    .values({
      email,
      password: hashedPassword,
    })
    .returning({ id: users.id });

  const user = data[0];

  if (!user) {
    return {
      code: 1,
      message: 'An error occurred while creating your account.',
    };
  }

  // 4. Create a session for the user
  const userId = user.id.toString();

  await createSession(userId);
  redirect('/dashboard');
}

export async function login(
  formData: FieldValues,
) {
  // 1. Validate form fields.
  const validatedFields = SignUpFormSchema.omit({ confirmPassword: true }).safeParse({
    email: formData.email,
    password: formData.password,
  });
  const errorMessage = { message: 'Invalid login credentials.' };

  // If any form fields are invalid, return early
  if (!validatedFields.success) {
    return {
      code: 3,
      message: 'Invalid Form',
    };
  }

  // 2. Query the database for the user with the given email
  const user = await db.query.users.findFirst({
    where: eq(users.email, validatedFields.data.email),
  });

  // If user is not found, return early
  if (!user) {
    return {
      code: 1,
      message: errorMessage.message,
    };
  }
  // 3. Compare the user's password with the hashed password in the database
  const passwordMatch = await bcrypt.compare(
    validatedFields.data.password,
    user.password,
  );

  // If the password does not match, return early
  if (!passwordMatch) {
    return { code: 2, message: errorMessage.message };
  }

  // 4. If login successful, create a session for the user and redirect
  const userId = user.id.toString();
  await createSession(userId);
  return { code: 0, message: 'success' };
}

export async function logout() {
  deleteSession();
}
