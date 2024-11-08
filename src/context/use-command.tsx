import { useContext } from 'react';

import { CommandContext } from '@/context/creators';

export function useCommand() {
  const context = useContext(CommandContext);
  if (context == null) {
    throw new Error('useCommand must be used within a CommandContextProvider');
  }
  return context;
}
