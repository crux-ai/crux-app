'use client';

import { motion } from 'framer-motion';
import React from 'react';

import { languagesData } from '@/lib/data';
import { useSectionInView } from '@/lib/hooks';

import SectionHeading from './section-heading';

const fadeInAnimationVariants = {
  initial: { opacity: 0, y: 100 },
  animate: (index: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.05 * index },
  }),
};

export default function Languages() {
  const { ref } = useSectionInView('Languages', 0.9);
  return (
    <section
      className="mx-auto  mb-40 max-w-3xl scroll-m-28 px-4"
      id="languages"
      ref={ref}
    >
      <SectionHeading>Languages</SectionHeading>
      <ul className="flex flex-wrap items-center justify-center gap-2">
        {languagesData.map((language, index) => (
          <motion.li
            className="cursor-pointer rounded-xl bg-violet-800 px-3 py-1 text-sm font-medium text-gray-200 hover:scale-105 hover:bg-violet-950"
            key={language}
            variants={fadeInAnimationVariants}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            custom={index}
          >
            {language}
          </motion.li>
        ))}
      </ul>
    </section>
  );
}
