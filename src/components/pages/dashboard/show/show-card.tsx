'use client';
import React, { useEffect } from 'react';
import toast from 'react-hot-toast';

import { FileExplorer } from '@/components/pages/dashboard/show/file-explorer';
import RhsPanel from '@/components/pages/dashboard/show/rhs-panel';
import { Statistics } from '@/components/pages/dashboard/show/statistics';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import type { MenuOption } from '@/context/git-show';
import { useGitShow } from '@/context/use-git-show';
import { cn } from '@/lib/utils';
import { ShowSchema } from '@/validations/github';

import { CommitTable } from './commit-table';

type CardProps = React.ComponentProps<typeof Card>;

function MainContent() {
  const { menuOption } = useGitShow();

  if (menuOption === 'File Explorer') {
    return (
      <FileExplorer />
    );
  }
  if (menuOption === 'Commit History') {
    return <CommitTable />;
  }
  if (menuOption === 'Statistics') {
    return <div className="size-full"><Statistics /></div>;
  }
  if (menuOption === 'Mind Map') {
    return <div className="size-96">MindMap</div>;
  }
}

function Menu({
  menuOptions,
}: {
  menuOptions: { title: MenuOption; isNew: boolean }[];
}) {
  const { menuOption: activeMenuOption, setMenuOption: setActiveMenuOption }
    = useGitShow();
  return (
    <div className="border-r   px-4">
      <div className="flex flex-col gap-5">
        {menuOptions.map((option) => {
          const isActive = option.title === activeMenuOption;
          return (
            <div key={option.title} className="">
              <Button
                variant="outline"
                className={cn(
                  option.isNew && 'border-sparkle',
                  isActive && 'bg-muted',
                )}
                onClick={() => {
                  window.history.replaceState(null, '', `#${option.title}`);
                  setActiveMenuOption(option.title);
                }}
              >
                {option.title}
              </Button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

const menuOptions: { title: MenuOption; isNew: boolean }[] = [
  { title: 'File Explorer', isNew: false },
  { title: 'Commit History', isNew: false },
  { title: 'Statistics', isNew: false },
  { title: 'Mind Map', isNew: true },
];

export default function ShowCard({ className, ...props }: CardProps) {
  //  const [ownerRepo, setOwnerRepo] = useState({ owner: 'jack-cordery', repo: 'dashboard' });
  const { ownerRepo, setCommitData, setMenuOption, loading, setLoading, setFileData, setLangFreqData } = useGitShow();
  // Lets load the data on load of ShowCard, so that we don't have to fetch data for every screen!

  useEffect(() => {
    const handleLoad = async () => {
      const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/github/show/${ownerRepo.owner}/${ownerRepo.repo}/${ownerRepo.branch}`);
      if (!response.ok) {
        throw new Error('Failed to fetch commits');
      }
      const showData = await response.json(); // validate
      const validatedShowResult = ShowSchema.safeParse(showData);
      if (validatedShowResult.success) {
        setCommitData(validatedShowResult.data.commits);
        setFileData(validatedShowResult.data.trees);
        setLangFreqData(validatedShowResult.data.languages);
      } else {
        toast.error('An error occured loading your data');
      }
      const currentHash = window.location.hash.substring(1);
      if (['File Explorer', 'Commit History', 'Statistics', 'Mind Map'].includes(currentHash)) {
        setMenuOption(currentHash as MenuOption);
      }
      setLoading(false);
    };
    handleLoad();
  }, [ownerRepo, setFileData, setLoading, setCommitData, setLangFreqData, setMenuOption]);

  return (
    <div className="mt-10 flex flex-row gap-2 px-2">
      <Card className={cn('w-[1580px] min-h-[900px]', className)} {...props}>
        <CardHeader>
          <CardTitle>Card Title</CardTitle>
          <CardDescription>Card Description</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-row gap-8">
          <Menu menuOptions={menuOptions} />
          <div className="min-w-[800px]">
            {loading
              ? (<div>Loading....</div>) // Corrected the syntax here
              : (<MainContent />)}
          </div>
        </CardContent>
      </Card>
      <RhsPanel />
    </div>
  );
}
