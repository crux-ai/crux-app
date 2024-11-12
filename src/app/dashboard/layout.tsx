import Link from 'next/link';
import React from 'react';
import { Toaster } from 'react-hot-toast';

import LogOutForm from '@/components/auth/logout/form';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div id="background" className="flex h-screen w-screen flex-col items-start justify-start">
      <Toaster />
      <div id="header" className="flex h-20 w-full flex-row items-end justify-between bg-foreground">
        <Link href="/">
          <h1 className="text-5xl font-extrabold text-secondary"> Crux.</h1>
        </Link>
        <LogOutForm variant="secondary" className="mb-1" />
      </div>
      {children}
    </div>
  );
}
