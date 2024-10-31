import Link from 'next/link';
import React from 'react';

import { UserAuthForm } from './user-auth-form';

export default function LoginForm() {
  return (
    <div className="flex w-96 flex-col items-center justify-center rounded-sm p-8  md:w-[30rem]">
      <h1 className="mb-4 text-2xl font-semibold tracking-tight">
        Log in to your account
      </h1>
      <p className="mb-5 text-sm font-light">Enter your details below to login</p>
      <UserAuthForm className="mb-4 w-96" />
      <p className="px-8 text-center text-sm text-muted-foreground">
        By clicking continue, you agree to our
        {' '}
        <Link
          href="/terms"
          className="underline underline-offset-4 hover:text-primary"
        >
          Terms of Service
        </Link>
        {' '}
        and
        {' '}
        <Link
          href="/privacy"
          className="underline underline-offset-4 hover:text-primary"
        >
          Privacy Policy
        </Link>
        .
      </p>
    </div>
  );
}
