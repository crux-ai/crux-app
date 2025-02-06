'use client';

import type { ColumnDef } from '@tanstack/react-table';
import { flexRender, getCoreRowModel, getPaginationRowModel, useReactTable } from '@tanstack/react-table';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import type { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { getCommits } from '@/lib/git/fetchers';
import type { GitCommitSchema } from '@/validations/github';

const columns: ColumnDef<GitCommit>[] = [
  { id: 'sha', accessorKey: 'sha', header: 'Sha' },
  { id: 'message', accessorKey: 'commit.message', header: 'Message' },
];

type GitCommit = z.infer< typeof GitCommitSchema>;

export function CommitTable() {
  const [failedLoad, setFailedLoad] = useState(false);
  const [tableData, setTableData] = useState<GitCommit[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const searchParams = useSearchParams();
  const owner = searchParams.get('owner');
  const repo = searchParams.get('repo');
  const branch = searchParams.get('branch');
  const handleSync = async () => {
    setIsLoading(true);
    const { data, message } = await getCommits(owner, repo, branch);
    if (data) {
      setTableData(data);
      setIsLoading(false);
      return;
    }
    toast.error(message);
    setFailedLoad(true);
    setIsLoading(false);
  };

  useEffect(() => {
    const handleLoad = async () => {
      const { data, message } = await getCommits(owner, repo, branch);
      if (data) {
        setTableData(data);
        setIsLoading(false);
        return;
      }
      toast.error(message);
      setFailedLoad(true);
      setIsLoading(false);
    };
    handleLoad();
  }, [owner, repo, branch]);

  const table = useReactTable({
    data: tableData,
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
