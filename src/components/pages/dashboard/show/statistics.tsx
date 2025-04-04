'use client';

import { CommitLineGraph } from '@/components/pages/dashboard/show/commit-line-graph';

import LanguagePie from './language-pie';
import { TopAuthorBars } from './top-author-bars';

export function Statistics() {
  return (
    <div className="grid grid-cols-3 justify-center gap-2">
      <div className="col-span-2">
        <CommitLineGraph />
      </div>
      <div className="col-span-1">
        <TopAuthorBars />
      </div>
      <div>
        <LanguagePie />
      </div>
    </div>
  );
}
