import React from 'react';

import ShowCard from '@/components/pages/dashboard/show/show-card';
import GitShowContextProvider from '@/context/git-show';
import { authenticatePage } from '@/lib/auth/actions';

export default async function Page() {
  await authenticatePage();

  return (
    <div id="content" className="size-full bg-background ">
      <GitShowContextProvider>
        <ShowCard className="" />
      </GitShowContextProvider>
    </div>
  );
}
