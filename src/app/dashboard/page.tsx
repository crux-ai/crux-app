import React from 'react';

import { CommandBar } from '@/components/pages/dashboard/command-bar';
import { authenticatePage } from '@/lib/auth/actions';

export default async function Page() {
  await authenticatePage();
  return (
    <div id="content" className="flex  size-full items-center justify-center bg-background ">
      <CommandBar />
    </div>
  );
}
