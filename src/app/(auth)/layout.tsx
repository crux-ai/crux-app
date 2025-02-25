import type { Metadata } from 'next';
import Link from 'next/link';
import React from 'react';

import { TypewriterHeader } from '@/components/auth/typewriter-header';

export const metadata: Metadata = {
  title: 'Authentication',
  description: 'Authentication forms built using the components.',
};

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex h-screen w-screen">
      <div className="hidden w-1/2 border-r border-muted bg-primary-foreground md:block">
        <div className="fixed left-4 top-0 hidden sm:right-8 sm:top-6 md:block">
          <h1 className="text-2xl font-semibold lg:text-6xl">
            <Link href="/">
              <span className="text-primary">Crux</span>
            </Link>
          </h1>
        </div>
        <TypewriterHeader />
      </div>
      <div className="m-4 flex w-full items-center justify-center md:w-1/2">
        {children}
      </div>

    </div>
  );
}
