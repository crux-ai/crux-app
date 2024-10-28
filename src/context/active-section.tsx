'use client';

import type React from 'react';
import { createContext, useMemo, useState } from 'react';

import type { links } from '@/lib/data';

type SectionName = (typeof links)[number]['name'];

type ActiveSectionContextProviderProps = {
  children: React.ReactNode;
};

type ActiveSectionContextType = {
  activeSection: SectionName | null;
  setActiveSection: React.Dispatch<React.SetStateAction<SectionName | null>>;
  timeOfLastClick: number;
  setTimeOfLastClick: React.Dispatch<React.SetStateAction<number>>;
};

export const ActiveSectionContext = createContext<ActiveSectionContextType | null>(null);

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
