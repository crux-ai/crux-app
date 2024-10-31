'use client';

import Link from 'next/link';
import { useState } from 'react';

import CreateAccountForm from '@/components/auth/create-account-form';
import LoginForm from '@/components/auth/login-form';
import { TypewriterHeader } from '@/components/auth/typewriter-header';
import { Button } from '@/components/ui/button';
import { buttonVariants } from '@/components/ui/utils/button-variants';
import { cn } from '@/lib/utils';

export default function AuthenticationPage() {
  const [showCreate, setShowCreate] = useState(true);

  return (
    <div className="flex h-screen w-screen">
      <div className="hidden w-1/2 border-r border-muted bg-primary-foreground md:block">
        <div className="fixed left-4 top-0 hidden sm:right-8 sm:top-6 md:block">
          <h1 className="text-2xl font-semibold lg:text-6xl">
            <Link href="/">
              <span className="text-primary">Crux</span>
            </Link>
          </h1>
          {showCreate
            ? (
                <Button
                  className={cn(
                    buttonVariants({ variant: 'ghost' }),
                    'absolute right-4 top-4 md:right-8 md:top-8',
                  )}
                  onClick={() => setShowCreate(false)}
                >
                  Already have an account?
                </Button>
              )
            : (
                <Button
                  className={cn(
                    buttonVariants({ variant: 'ghost' }),
                    'absolute right-4 top-4 md:right-8 md:top-8',
                  )}
                  onClick={() => setShowCreate(true)}
                >
                  Create Account
                </Button>
              )}
        </div>
        <TypewriterHeader />
      </div>
      <div className="m-4 flex w-full items-center justify-center md:w-1/2">
        { showCreate ? <CreateAccountForm /> : <LoginForm />}
      </div>

    </div>
  );
}
