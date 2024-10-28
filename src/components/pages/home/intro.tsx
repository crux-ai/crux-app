'use client';

import { ArrowRight } from 'lucide-react';
import React from 'react';

import { useSectionInView } from '@/lib/hooks';

export default function Intro() {
  const { ref } = useSectionInView('Home');

  return (
    <section
      id="home"
      className="mb-20 scroll-m-[100rem]"
      ref={ref}
    >
      <div className="flex items-center justify-center">
      </div>
      <div className="flex flex-col items-center justify-center duration-500 ease-out animate-in fade-in zoom-in ">
        <h1 className="text-center text-3xl font-medium text-gray-900 dark:text-gray-50 md:text-6xl">
          <span className="underline-gradient animate-background bg-[left_0%_bottom-0%] bg-[length:200%_15%] bg-repeat-x">
            Empowering Leadership
            {' '}
            <br />
            {' '}
            <span className="inline-flex bg-gradient-to-r from-neutral-900 via-slate-500 to-neutral-500 bg-[200%_auto] bg-clip-text leading-tight text-transparent dark:from-neutral-100 dark:via-slate-400 dark:to-neutral-400 ">
              with Engineering Insights
            </span>
          </span>
        </h1>
        <div className="mt-10 space-y-2 text-center font-light text-gray-700 dark:text-slate-200">
          <p>
            Welcome to
            {' '}
            <span className="font-extrabold">Crux</span>
            , where we
            {' '}
            <span className="font-extrabold">bridge the gap</span>
            {' '}
            between Leadership and
            Engineering teams.
          </p>
          <p>
            Unlock
            {' '}
            <span className="font-extrabold">unparalleled insights</span>
            {' '}
            into your tech productivity and drive informed decisions.
          </p>
        </div>
        <div className="pt-8">
          <div className="relative mx-auto flex max-w-2xl flex-col items-center">
            <div className="group mb-8 flex">
              <a
                href="/login"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex transition-all duration-100 hover:scale-110 active:scale-105"
              >
                <span className="relative inline-block overflow-hidden rounded-full p-px">
                  <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#a9a9a9_0%,#0c0c0c_50%,#a9a9a9_100%)] dark:bg-[conic-gradient(from_90deg_at_50%_50%,#171717_0%,#737373_50%,#171717_100%)]" />
                  <div className="group-hover: inline-flex size-full cursor-pointer justify-center rounded-full bg-slate-100 px-4 py-2 text-sm font-medium leading-5 text-slate-600 backdrop-blur-xl dark:bg-black dark:text-slate-200">
                    Get Started ⚡️
                    <ArrowRight
                      className="pl-0.5 text-black opacity-70 transition-transform duration-300 group-hover:translate-x-2 dark:text-white"
                      size={20}
                    />
                  </div>
                </span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
