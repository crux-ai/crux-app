import React from 'react';

import { GitGraph } from '@/components/pages/dashboard/show/git-graph';
import { authenticatePage } from '@/lib/auth/actions';

export default async function Page() {
  await authenticatePage();

  // const something = injectMissedCommitsAndGetParentBranch(flattenEventsForGitGraph(data), allComits);
  return (
    <div id="content" className="flex size-full flex-col items-center justify-center bg-background ">
      <div className=" h-[50rem] w-full overflow-y-auto">
        <GitGraph />
      </div>
    </div>
  );
}
