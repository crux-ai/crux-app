import { useContext } from 'react';

import { ActiveSectionContext } from '@/context/creators';

export function useActiveSection() {
  const context = useContext(ActiveSectionContext);
  if (context == null) {
    throw new Error('useActiveSection must be used within a ActiveSectionContextProvider');
  }
  return context;
}
