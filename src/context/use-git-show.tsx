import { useContext } from 'react';

import { GitShowContext } from '@/context/creators';

export function useGitShow() {
  const context = useContext(GitShowContext);
  if (context == null) {
    throw new Error('useGitShow must be used within a GitShowProvider');
  }
  return context;
}
