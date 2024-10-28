'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import Image from 'next/image';
import { useRef } from 'react';

import type { featuresData } from '@/lib/data';

type FeatureProps = typeof featuresData[number];

export default function FeatureCard({ title, description, tags, imageUrl }: FeatureProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['0 1', '1.33 1'],
  });
  const scaleProgress = useTransform(scrollYProgress, [0, 1], [0.5, 1]);
  const opacityProgress = useTransform(scrollYProgress, [0, 1], [0.6, 1]);
  return (
    <motion.section
      ref={sectionRef}
      style={{ scale: scaleProgress, opacity: opacityProgress }}
      className="group relative h-[100] max-w-2xl overflow-hidden rounded-lg border border-black/5 bg-gray-100/60 p-4 shadow-xl dark:bg-slate-900/60"
    >
      <div className="h-full w-1/2 px-2 py-4 group-even:ml-80 sm:pl-5 sm:pt-5">
        <h3 className="text-2xl font-bold">{title}</h3>
        <p className="mt-2 hidden text-sm leading-relaxed text-gray-700 dark:text-slate-400 sm:block">
          {description}
        </p>

        <ul className="mt-4 flex flex-wrap items-center gap-2 text-xs font-medium">
          {tags.map(tag => (
            <li
              key={tag}
              className="rounded-full bg-gray-800/[0.7] px-3 py-1.5 uppercase tracking-wider text-gray-100 dark:bg-slate-100/[0.7] dark:text-slate-900"
            >
              {tag}
            </li>
          ))}
        </ul>
      </div>
      <Image
        src={imageUrl}
        alt={title}
        quality={95}
        className="absolute -right-40 bottom-0 size-2/3 rounded-t-lg shadow-2xl
         transition group-even:-left-40 group-even:right-[initial]
         group-hover:-translate-x-3 group-hover:translate-y-3 group-hover:-rotate-2 group-hover:scale-110
         group-even:group-hover:translate-x-3 group-even:group-hover:translate-y-3 group-even:group-hover:rotate-2 group-even:group-hover:scale-110
          sm:-right-40"
      />
    </motion.section>
  );
}
