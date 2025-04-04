'use client';

import { useMemo, useState } from 'react';

import type { FileItem } from '@/components/pages/dashboard/show/file-explorer';
import { GitShowContext } from '@/context/creators';
import type { CommitData, LanguageFreqData } from '@/validations/github';

export type MenuOption = 'File Explorer' | 'Commit History' | 'Statistics' | 'Mind Map';
export type OwnerRepo = { owner: string | null; repo: string | null; branch: string | null };

type GitShowContextProps = {
  children: React.ReactNode;
};

export default function GitShowContextProvider({ children }: GitShowContextProps) {
  const [menuOption, setMenuOption] = useState<MenuOption>('File Explorer');
  const [ownerRepo, setOwnerRepo] = useState<OwnerRepo>({ owner: 'crux-ai', repo: 'crux-app', branch: 'main' });
  const [commitData, setCommitData] = useState <CommitData>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [fileData, setFileData] = useState<FileItem[]>([]);
  const [langFreqData, setLangFreqData] = useState<LanguageFreqData>([]);

  const contextValue = useMemo(() => ({
    menuOption,
    setMenuOption,
    ownerRepo,
    setOwnerRepo,
    commitData,
    setCommitData,
    fileData,
    setFileData,
    langFreqData,
    setLangFreqData,
    loading,
    setLoading,
  }), [menuOption, loading, commitData, fileData, langFreqData, ownerRepo]);

  return (
    <GitShowContext.Provider value={contextValue}>
      {children}
    </GitShowContext.Provider>
  );
}
