'use client';

import clsx from 'clsx';
import { motion } from 'framer-motion';
import Link from 'next/link';
import React from 'react';

import { Button } from '@/components/ui/button';
import { useActiveSection } from '@/context/use-active-section';
import { links } from '@/lib/data';

export default function Header() {
  const { activeSection, setActiveSection, setTimeOfLastClick } = useActiveSection();

  return (
    <header className=" z-[999] flex items-center justify-center py-20 sm:py-36">
      <div className="fixed left-4 top-0  hidden duration-500 animate-in slide-in-from-top sm:right-8 sm:top-6 md:block">
        <h1 className=" text-2xl font-semibold lg:text-6xl">
          <span className="text-black dark:text-white">Crux</span>
        </h1>
      </div>
      <div
        className="fixed top-0 h-[4.5rem] w-full rounded-none border border-white/40 bg-black shadow-lg shadow-black/[0.03]  backdrop-blur-[0.5rem] duration-500 animate-in slide-in-from-top dark:border-black/40 dark:bg-gray-950 sm:top-6 sm:h-[3.25rem] sm:w-[39rem] sm:rounded-full"
      >
        <nav className="fixed left-1/2 flex h-12 -translate-x-1/2 py-2 sm:h-[initial] sm:py-0">
          <ul className="flex w-[22rem] flex-wrap items-center justify-center gap-5 gap-y-1 text-slate-200 dark:text-gray-400 sm:w-[initial] sm:flex-nowrap md:gap-5">
            {links.map(link => (
              <li className="flex h-3/4 items-center" key={link.hash}>
                <Link
                  className={clsx(
                    'relative flex w-full items-center justify-center p-3 transition hover:scale-110 hover:text-white dark:hover:text-gray-50',
                    { 'text-white dark:text-gray-50': activeSection === link.name },
                  )}
                  href={link.hash}
                  onClick={() => {
                    setActiveSection(link.name);
                    setTimeOfLastClick(Date.now());
                  }}
                >
                  {link.name}
                  {link.name === activeSection && (
                    <motion.span
                      className="absolute inset-0 -z-10 m-1 rounded-full bg-slate-800 dark:bg-gray-700/50"
                      layoutId="activeSection"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      <div className=" fixed  right-2 top-0 mt-1 hidden duration-500 animate-in slide-in-from-top sm:right-2 sm:top-6 md:block">

        <Button className="">
          <Link href="/sign-in">
            Sign-In
          </Link>
        </Button>

      </div>
    </header>
  );
}
