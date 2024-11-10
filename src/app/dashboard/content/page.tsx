import React from 'react';

import { CommitTable } from '@/components/pages/dashboard/show/commit-table';
import { authenticatePage } from '@/lib/auth/actions';

export default async function Page() {
  await authenticatePage();

  return (
    <div id="content" className="flex  size-full items-center justify-center bg-background ">
      <div className="w-1/2">
        <CommitTable />
      </div>
    </div>
  );
}
