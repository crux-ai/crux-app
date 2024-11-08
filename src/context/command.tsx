'use client';

import { useMemo, useState } from 'react';

import { CommandContext } from './creators';

export type pagesType = string[];

type CommandContextProps = {
  children: React.ReactNode;
};

export default function CommandContextProvider({ children }: CommandContextProps) {
  const [pages, setPages] = useState<pagesType | never[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [isExited, setIsExited] = useState(false);

  const contextValue = useMemo(() => ({
    pages,
    setPages,
    inputValue,
    setInputValue,
    isOpen,
    setIsOpen,
    isExited,
    setIsExited,
  }), [pages, inputValue, isOpen, isExited]);

  return (
    <CommandContext.Provider value={contextValue}>
      {children}
    </CommandContext.Provider>
  );
}
