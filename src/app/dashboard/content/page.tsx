import React from 'react';

import { Query } from '@/components/pages/dashboard/content/query';
import { authenticatePage } from '@/lib/auth/actions';

export default async function Page() {
  await authenticatePage();

  return (
    <div id="content" className="flex  size-full items-center justify-center bg-background ">
      <Query />
    </div>
  );
}
