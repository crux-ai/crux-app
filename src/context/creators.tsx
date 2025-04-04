import { createContext } from 'react';

import type { FileItem } from '@/components/pages/dashboard/show/file-explorer';
import type { SectionName } from '@/context/active-section';
import type { pagesType } from '@/context/command';
import type { MenuOption, OwnerRepo } from '@/context/git-show';
import type { CommitData, LanguageFreqData } from '@/validations/github';

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
  commitData: CommitData;
  setCommitData: React.Dispatch<React.SetStateAction<CommitData>>;
  fileData: FileItem[];
  setFileData: React.Dispatch<React.SetStateAction<FileItem[]>>;
  langFreqData: LanguageFreqData;
  setLangFreqData: React.Dispatch<React.SetStateAction<LanguageFreqData>>;
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
};

export const GitShowContext = createContext<GitShowContextType | null>(null);
