'use client';

import { type ColumnDef, flexRender, getCoreRowModel, getSortedRowModel, type Row, useReactTable } from '@tanstack/react-table';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { getAllCommits } from '@/lib/git/fetchers';
import { type Commits, transformAllCommitsGitGraph } from '@/lib/git/transformations'; // Change this

// function drawGitGraph(row: Row<Commits>, branch: string) {
//   const commitBranch = row.original.branch;
//   const eventType = row.original.gitEvent;
//   const isBranchActive = row.original.activeState ? row.original.activeState[branch] : false;
//   if (branch === commitBranch) {
//     if (eventType === 'Checkout') {
//       if (row.index === 0) {
//         return (
//           <FirstCommit />
//         );
//       } else {
//         return (
//           <FirstCheckout />
//         );
//       }
//     }
//     if (isBranchActive) {
//       return (
//         <CommitLine />
//       );
//     } else {
//       return (
//         <LastCommit />
//       );
//     }
//   } else {
//     if (isBranchActive) {
//       return (
//         <FullLine />
//       );
//     }
//   }
// }

function formatBranch(row: Row<Commits>, column_name: string | null) {
  if (row.original.type === 'Commit') {
    if (row.original.mergeSource === column_name) {
      return (
        <div>O</div>
      );
    }
  }
  if (row.original.type === 'Initial') {
    if (row.original.mergeSource === column_name) {
      return (
        <div>O</div>
      );
    }
  }
  if (row.original.type === 'Merge') {
    if (row.original.branches[0] === column_name) {
      return (
        <div>O</div>
      );
    }
  }
}

export function GitGraph({ owner, repo }: { owner: string | null; repo: string | null }) {
  const [ownerRepo] = useState({ owner, repo });
  const [tableData, setTableData] = useState<Commits[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [failedLoad, setFailedLoad] = useState(false);

  useEffect(() => {
    const handleLoad = async () => {
      const { data, message } = await getAllCommits(ownerRepo.owner, ownerRepo.repo);
      if (data) {
        const cleanData = transformAllCommitsGitGraph(data);
        setTableData(cleanData);
        setIsLoading(false);
        return;
      }
      toast.error(message);
      setFailedLoad(true);
      setIsLoading(false);
    };
    handleLoad();
  }, [ownerRepo]);

  const branchesFromSource = tableData.map(item => item.mergeSource);
  const uniqueBranches = [...new Set(branchesFromSource)];

  const columns: ColumnDef<Commits>[] = [
    { id: 'type', accessorKey: 'type', header: 'Type' },
    { id: 'commitAuthor', accessorKey: 'authorName', header: 'commitAuthor' },
    { id: 'mergeSource', accessorKey: 'mergeSource', header: 'Merge Source' },
    { id: 'commitMessage', accessorKey: 'message', header: 'Message' },
    { id: 'commitSha', accessorKey: 'sha', header: 'Commit Sha' },
    { id: 'date', accessorKey: 'date', header: 'Date' },
    ...uniqueBranches.map((branch, index) => ({ id: `branch_${index}`, header: `${branch}`, cell: ({ row }: { row: Row<Commits> }) => formatBranch(row, branch) })),
  ];

  const table = useReactTable({
    data: tableData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    initialState: {
      sorting: [
        {
          id: 'date',
          desc: true,
        },
      ],
    },
  });

  return (isLoading
    ? (
        <div>
          Loading
        </div>
      )
    : (failedLoad
        ? ((<div>Failed Load! Ensure correct url is supplied or that you haven't hit your github rate limit</div>))
        : (
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
                      <TableCell className="  p-2" key={cell.id}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ))
  );
}
