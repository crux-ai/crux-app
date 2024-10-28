'use client';

import {
  motion,
  useScroll,
  useTransform,
} from 'framer-motion';
import React, { useEffect, useRef, useState } from 'react';

import { useSectionInView } from '@/lib/hooks';
import type { TimelineEntry } from '@/lib/types';

import SectionHeading from './section-heading';

export const Timeline = ({ data }: { data: TimelineEntry[] }) => {
  const ref = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);
  const { ref: sectionRef } = useSectionInView('Roadmap', 0.1);

  useEffect(() => {
    if (ref.current) {
      const rect = ref.current.getBoundingClientRect();
      setHeight(rect.height);
    }
  }, [ref]);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start 10%', 'end 50%'],
  });

  const heightTransform = useTransform(scrollYProgress, [0, 1], [0, height]);
  const opacityTransform = useTransform(scrollYProgress, [0, 0.1], [0, 1]);

  return (
    <div
      className="scroll-m-28"
      id="roadmap"
      ref={sectionRef}
    >
      <SectionHeading>Roadmap</SectionHeading>
      <div
        className="mx-4 my-20 w-auto overflow-hidden rounded-lg bg-gradient-to-r from-fuchsia-500 to-cyan-500 font-sans outline outline-1 outline-white/20 dark:bg-gradient-to-r dark:from-slate-900/50 dark:to-slate-700/50 md:mx-20 md:px-10"
        ref={containerRef}

      >
        <div className="mx-auto max-w-7xl px-4 py-20 md:px-8 lg:px-10">
          <h2 className="mb-4 max-w-4xl text-lg text-white md:text-4xl">
            Our Journey
          </h2>
          <p className="max-w-sm text-sm text-white md:text-base">
            From our initial launch to future innovations, we&apos;re constantly
            evolving to bring you cutting-edge code analysis tools.
          </p>
        </div>

        <div ref={ref} className="relative mx-auto max-w-7xl pb-20">
          {data.map(item => (
            <div
              key={item.title}
              className="flex justify-start pt-10 md:gap-10 md:pt-40"
            >
              <div className="sticky top-40 z-40 flex max-w-xs flex-col items-center self-start md:w-full md:flex-row lg:max-w-sm">
                <div className="absolute left-3 flex size-10 items-center justify-center rounded-full bg-gray-950 dark:bg-black md:left-3">
                  <div className="size-4 rounded-full bg-fuchsia-400 p-2 dark:border-neutral-700 dark:bg-neutral-800" />
                </div>
                <h3 className="hidden text-xl font-bold text-white dark:from-neutral-100 dark:via-slate-400 dark:to-neutral-400 md:block md:pl-20 md:text-5xl ">
                  {item.title}
                </h3>
              </div>

              <div className="relative w-full pl-20 pr-4 md:pl-4">
                <h3 className="mb-4 block text-left text-2xl font-bold text-neutral-500 dark:text-neutral-500 md:hidden">
                  {item.title}
                </h3>
                {item.content}
                {' '}
              </div>
            </div>
          ))}
          <div
            style={{
              height: `${height}px`,
            }}
            className="absolute left-8 top-0 w-[2px] overflow-hidden bg-[linear-gradient(to_bottom,var(--tw-gradient-stops))] from-transparent from-0% via-neutral-200 to-transparent to-[99%] [mask-image:linear-gradient(to_bottom,transparent_0%,black_10%,black_90%,transparent_100%)] dark:via-neutral-700  md:left-8 "
          >
            <motion.div
              style={{
                height: heightTransform,
                opacity: opacityTransform,
              }}
              className="absolute inset-x-0 top-0  w-[2px] rounded-full bg-gradient-to-t from-slate-500 from-0% via-black via-10% to-transparent dark:from-cyan-500 dark:via-fuchsia-500"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
