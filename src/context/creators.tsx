import { createContext } from 'react';

import type { SectionName } from '@/context/active-section';
import type { pagesType } from '@/context/command';
import type { MenuOption, OwnerRepo } from '@/context/git-show';
import type { AllCommits } from '@/lib/git/fetchers';

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

type GitShowContextType = {
  menuOption: MenuOption;
  setMenuOption: React.Dispatch<React.SetStateAction<MenuOption>>;
  ownerRepo: OwnerRepo;
  setOwnerRepo: React.Dispatch<React.SetStateAction<OwnerRepo>>;
  commitData: AllCommits;
  setCommitData: React.Dispatch<React.SetStateAction<AllCommits>>;
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
};

export const GitShowContext = createContext<GitShowContextType | null>(null);
