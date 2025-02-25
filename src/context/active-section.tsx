'use client';

import type React from 'react';
import { useMemo, useState } from 'react';

import type { links } from '@/lib/data';

import { ActiveSectionContext } from './creators';

export type SectionName = (typeof links)[number]['name'];

type ActiveSectionContextProviderProps = {
  children: React.ReactNode;
};

export default function ActiveSectionContextProvider({
  children,
}: ActiveSectionContextProviderProps) {
  const [activeSection, setActiveSection] = useState<SectionName | null>(null);
  const [timeOfLastClick, setTimeOfLastClick] = useState<number>(0);

  const contextValue = useMemo(() => ({
    activeSection,
    setActiveSection,
    timeOfLastClick,
    setTimeOfLastClick,
  }), [activeSection, timeOfLastClick]);

  return (
    <ActiveSectionContext.Provider value={contextValue}>
      {children}
    </ActiveSectionContext.Provider>
  );
}
