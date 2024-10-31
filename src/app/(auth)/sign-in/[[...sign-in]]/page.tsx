import type { Metadata } from 'next';
import Link from 'next/link';

import { TypewriterHeader } from '@/components/auth/typewriter-header';
import { UserAuthForm } from '@/components/auth/user-auth-form';
import { Button } from '@/components/ui/button';
import { buttonVariants } from '@/components/ui/utils/button-variants';
import { cn } from '@/lib/utils';

export const metadata: Metadata = {
  title: 'Authentication',
  description: 'Authentication forms built using the components.',
};

export default function AuthenticationPage() {
  return (
    <div className="flex h-screen w-screen">
      <div className="hidden w-1/2 border-r border-muted bg-primary-foreground md:block">
        <div className="fixed left-4 top-0 hidden sm:right-8 sm:top-6 md:block">
          <h1 className="text-2xl font-semibold lg:text-6xl">
            <Link href="/">
              <span className="text-primary">Crux</span>
            </Link>
          </h1>
          <Button
            className={cn(
              buttonVariants({ variant: 'ghost' }),
              'absolute right-4 top-4 md:right-8 md:top-8',
            )}
          >
            Login
          </Button>
        </div>
        <TypewriterHeader />
      </div>
      <div className="m-4 flex w-full items-center justify-center md:w-1/2">
        <div className="flex w-96 flex-col items-center justify-center rounded-sm p-8  md:w-[30rem]">
          <h1 className="mb-4 text-2xl font-semibold tracking-tight">
            Create an account
          </h1>
          <p className="mb-5 text-sm font-light">Enter your details below to create an account</p>
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

      </div>

    </div>
  );
}
