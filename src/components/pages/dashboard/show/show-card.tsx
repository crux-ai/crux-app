'use client';
import React from 'react';

import { FileExplorer } from '@/components/pages/dashboard/show/file-explorer';
import RhsPanel from '@/components/pages/dashboard/show/rhs-panel';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { GitGraph } from '@/components/ui/git-graph';
import type { MenuOption } from '@/context/git-show';
import { useGitShow } from '@/context/use-git-show';
import { cn } from '@/lib/utils';

type CardProps = React.ComponentProps<typeof Card>;

function MainContent() {
  const { menuOption, ownerRepo } = useGitShow();

  if (menuOption === 'File Explorer') {
    return (
      <FileExplorer owner={ownerRepo.owner} repo={ownerRepo.repo} branch={ownerRepo.branch} />
    );
  }
  if (menuOption === 'Commit History') {
    return (
      <GitGraph owner={ownerRepo.owner} repo={ownerRepo.repo} />
    );
  }
  if (menuOption === 'Statistics') {
    return (
      <div>Statistix</div>
    );
  }
  if (menuOption === 'Mind Map') {
    return (
      <div>Mind MAp and tht </div>
    );
  }
}

function Menu({ menuOptions }: { menuOptions: { title: MenuOption; isNew: boolean }[] }) {
  const { menuOption: activeMenuOption, setMenuOption: setActiveMenuOption } = useGitShow();
  return (
    <div className="border-r   px-4">
      <div className="flex flex-col gap-5">
        {menuOptions.map((option) => {
          const isActive = option.title === activeMenuOption;
          return (

            <div key={option.title} className="">
              <Button
                variant="outline"
                className={cn(option.isNew && 'border-sparkle', isActive && 'bg-muted')}
                onClick={() => setActiveMenuOption(option.title)}
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

const menuOptions: { title: MenuOption; isNew: boolean }[] = [{ title: 'File Explorer', isNew: false }, { title: 'Commit History', isNew: false }, { title: 'Statistics', isNew: false }, { title: 'Mind Map', isNew: true }];

export default function ShowCard({ className, ...props }: CardProps) {
//   const [ownerRepo, setOwnerRepo] = useState({ owner: 'jack-cordery', repo: 'dashboard' });
//   const { ownerRepo } = useGitShow();

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
            <MainContent />
          </div>

        </CardContent>
      </Card>
      <RhsPanel />
    </div>
  );
}
