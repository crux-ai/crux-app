'use client';
import { TypewriterEffect } from '@/components/ui/typewriter-effect';

export function TypewriterHeader() {
  const words = [
    {
      text: 'Unapologetic',
    },
    {
      text: 'productivity',
    },
    {
      text: 'with',
    },
    {
      text: 'Crux.',
      className: 'text-blue-500 dark:text-blue-500',
    },
  ];
  return (
    <div className="flex h-[40rem] flex-col items-center justify-center ">
      <p className="mb-10 text-base text-neutral-600  dark:text-neutral-200">
        The road to freedom starts from here
      </p>
      <div className="px-2">
        <TypewriterEffect words={words} />
      </div>
    </div>
  );
}
