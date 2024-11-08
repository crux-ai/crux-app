import { createContext } from 'react';

import type { SectionName } from '@/context/active-section';
import type { pagesType } from '@/context/command';

type CommandContextType = {
  pages: pagesType | never[] ;
  setPages: React.Dispatch<React.SetStateAction<pagesType | never[]>>;
  inputValue: string;
  setInputValue: React.Dispatch<React.SetStateAction<string>>;
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isExited: boolean;
  setIsExited: React.Dispatch<React.SetStateAction<boolean>>;
};

export const CommandContext = createContext<CommandContextType | null>(null);

type ActiveSectionContextType = {
  activeSection: SectionName | null;
  setActiveSection: React.Dispatch<React.SetStateAction<SectionName | null>>;
  timeOfLastClick: number;
  setTimeOfLastClick: React.Dispatch<React.SetStateAction<number>>;
};

export const ActiveSectionContext = createContext<ActiveSectionContextType | null>(null);
