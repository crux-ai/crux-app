'use client';

import type { ColumnDef } from '@tanstack/react-table';
import { flexRender, getCoreRowModel, getPaginationRowModel, useReactTable } from '@tanstack/react-table';
import { useState } from 'react';
import { toast } from 'react-hot-toast';
import type { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useGitShow } from '@/context/use-git-show';
import { type CommitSchema, ShowSchema } from '@/validations/github';

const columns: ColumnDef<GitCommit>[] = [
  { id: 'id', accessorKey: 'id', header: 'ID' },
  { id: 'branch', accessorKey: 'branch_name', header: 'Branch' },
  { id: 'author', accessorKey: 'author_name', header: 'Author' },
  { id: 'message', accessorKey: 'message', header: 'Message' },
  { id: 'sha', accessorKey: 'commit_sha', header: 'Sha' },
  { id: 'date', accessorKey: 'commited_at', header: 'Date' },
];

type GitCommit = z.infer< typeof CommitSchema>;

export function CommitTable() {
  const [failedLoad, setFailedLoad] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { commitData, setCommitData, setFileData, ownerRepo } = useGitShow();
  const handleSync = async () => {
    setIsLoading(true);
    const response = await fetch(`/api/github/show/${ownerRepo.owner}/${ownerRepo.repo}/${ownerRepo.branch}`);
    if (!response.ok) {
      throw new Error('Failed to fetch commits');
    }
    const showData = await response.json(); // validate
    const validatedShowResult = ShowSchema.safeParse(showData);
    if (validatedShowResult.success) {
      setCommitData(validatedShowResult.data.commits);
      setFileData(validatedShowResult.data.trees);
      setIsLoading(false);
      return;
    }
    toast.error('Sync Failed');
    setFailedLoad(true);
    setIsLoading(false);
  };

  const table = useReactTable({
    data: commitData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  },
  );

  return (isLoading
    ? (
        <div>
          Loading
        </div>

      )
    : (failedLoad
        ? (<div>Failed Load, ensure correct url is supplied</div>)
        : (
            <div>
              <Button onClick={handleSync}>Sync </Button>
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
                      ),
                      )}
                    </TableRow>
                  ))}
                </TableHeader>
                <TableBody>
                  {table.getRowModel().rows.map(row => (
                    <TableRow key={row.id}>
                      {row.getVisibleCells().map(cell => (
                        <TableCell key={cell.id}>
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </TableCell>
                      ),

                      )}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <div className="flex items-center justify-center">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => table.previousPage()}
                  disabled={!table.getCanPreviousPage()}
                >
                  Previous
                </Button>
                <div className="mx-4">
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => table.nextPage()}
                  disabled={!table.getCanNextPage()}
                >
                  Next
                </Button>
              </div>
            </div>
          )
      )
  );
}
