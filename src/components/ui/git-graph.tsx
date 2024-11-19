'use client';

import { type ColumnDef, flexRender, getCoreRowModel, getSortedRowModel, type Row, useReactTable } from '@tanstack/react-table';
import type { z } from 'zod';

import { CommitLine, FirstCheckout, FirstCommit, FullLine, LastCommit } from '@/components/ui/git-graph-svg';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import type { ExplodedCommit as ExplodedCommitZod } from '@/validations/github';

type ExplodedCommit = z.infer<typeof ExplodedCommitZod>;

function drawGitGraph(row: Row<ExplodedCommit>, branch: string) {
  const commitBranch = row.original.branch;
  const eventType = row.original.gitEvent;
  const isBranchActive = row.original.activeState ? row.original.activeState[branch] : false;
  if (branch === commitBranch) {
    if (eventType === 'Checkout') {
      if (row.index === 0) {
        return (
          <FirstCommit />
        );
      } else {
        return (
          <FirstCheckout />
        );
      }
    }
    if (isBranchActive) {
      return (
        <CommitLine />
      );
    } else {
      return (
        <LastCommit />
      );
    }
  } else {
    if (isBranchActive) {
      return (
        <FullLine />
      );
    }
  }
}

export function GitGraph({ initialData, branches }: { initialData: ExplodedCommit[]; branches: string[] }) {
  // console.log(data);

  const columns: ColumnDef<ExplodedCommit>[] = [ // TODO: change type
    { id: 'type', accessorKey: 'id', header: 'Type' },
    { id: 'gitEvent', accessorKey: 'gitEvent', header: 'GitEvent' },
    { id: 'eventAuthor', accessorKey: 'eventAuthorLogin', header: 'eventAuthor' },
    { id: 'commitAuthor', accessorKey: 'commitAuthor', header: 'commitAuthor' },
    { id: 'ref', accessorKey: 'ref', header: 'Ref' },
    { id: 'branch', accessorKey: 'branch', header: 'Branch' },
    { id: 'commitMessage', accessorKey: 'commitMessage', header: 'Message' },
    { id: 'commitSha', accessorKey: 'commitSha', header: 'Commit Sha' },
    { id: 'createdAt', accessorKey: 'createdAt', header: 'Created At' },
    ...branches.map(branch => ({ id: `branch~${branch}`, cell: ({ row }: { row: Row<ExplodedCommit> }) => drawGitGraph(row, branch) })),
  ];

  const table = useReactTable({
    data: initialData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    initialState: {
      sorting: [
        {
          id: 'createdAt',
          desc: false, // sort by name in descending order by default
        },
      ],
    },
  });

  return (
    <Table>
      <TableHeader>
        {table.getHeaderGroups().map(headerGroup => (
          <TableRow key={headerGroup.id}>
            {headerGroup.headers.map(header => (
              <TableHead key={header.id}>
                {header.isPlaceholder
                  ? null
                  : flexRender(
                    header.column.columnDef.header,
                    header.getContext(),
                  )}
              </TableHead>
            ))}
          </TableRow>
        ))}
      </TableHeader>
      <TableBody>
        {table.getRowModel().rows.map(row => (
          <TableRow key={row.id}>
            {row.getVisibleCells().map(cell => (
              <TableCell className="  p-0" key={cell.id}>
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
