'use client';

import { useSearchParams } from 'next/navigation';

export function Query() {
  const searchParams = useSearchParams();
  const currentCommand = String(searchParams.get('command'));
  const payload = String(searchParams.get('payload'));

  return (
    <div id="content" className="flex  size-full items-center justify-center bg-background ">
      <h1 className="text-cyan-500">
        {' '}
        {currentCommand}
        <br />
        {payload}
      </h1>
    </div>
  );
}
