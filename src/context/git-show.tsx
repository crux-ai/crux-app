'use client';

import { useMemo, useState } from 'react';

import { GitShowContext } from '@/context/creators';
import type { AllCommits } from '@/lib/git/fetchers';

export type MenuOption = 'File Explorer' | 'Commit History' | 'Statistics' | 'Mind Map';
export type OwnerRepo = { owner: string | null; repo: string | null; branch: string | null };

type GitShowContextProps = {
  children: React.ReactNode;
};

export default function GitShowContextProvider({ children }: GitShowContextProps) {
  const [menuOption, setMenuOption] = useState<MenuOption>('File Explorer');
  const [ownerRepo, setOwnerRepo] = useState<OwnerRepo>({ owner: 'jack-cordery', repo: 'crux', branch: 'main' });
  const [commitData, setCommitData] = useState<AllCommits>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const contextValue = useMemo(() => ({
    menuOption,
    setMenuOption,
    ownerRepo,
    setOwnerRepo,
    commitData,
    setCommitData,
    loading,
    setLoading,
  }), [menuOption, loading, commitData, ownerRepo]);

  return (
    <GitShowContext.Provider value={contextValue}>
      {children}
    </GitShowContext.Provider>
  );
}
