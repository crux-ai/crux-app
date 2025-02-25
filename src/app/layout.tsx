import '@/styles/globals.css';

import type { Metadata } from 'next';
import localFont from 'next/font/local';
import React from 'react';

import { ThemeProvider } from '@/components/layout/theme-provider';
import { ModeToggle } from '@/components/ui/theme-toggle';

const geistSans = localFont({
  src: './fonts/GeistVF.woff',
  variable: '--font-geist-sans',
  weight: '100 900',
});

const geistMono = localFont({
  src: './fonts/GeistMonoVF.woff',
  variable: '--font-geist-mono',
  weight: '100 900',
});

export const metadata: Metadata = {
  title: 'Crux',
  description: 'Empowering leadership with engineering insight',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (

    <html lang="en" suppressHydrationWarning className="absolute !scroll-smooth">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <div className="fixed bottom-4 right-4">
            <ModeToggle />
          </div>
        </ThemeProvider>
      </body>
    </html>

  );
}
