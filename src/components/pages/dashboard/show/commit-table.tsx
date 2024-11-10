'use client';

import type { ColumnDef, Row } from '@tanstack/react-table';
import { flexRender, getCoreRowModel, getPaginationRowModel, useReactTable } from '@tanstack/react-table';
import { MoreHorizontal } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { commits } from '@/lib/table/data';

export type GitHubCommit = {
  sha: string;
  node_id: string;
  commit: {
    author: GitHubAuthorDetails;
    committer: GitHubAuthorDetails;
    message: string;
    tree: {
      sha: string;
      url: string;
    };
    comment_count: number;
  };
  url: string;
  html_url: string;
  comments_url: string;
  author: GitHubUser;
  stats: {
    additions: number;
    deletions: number;
    total: number;
  };
};

export type GitHubAuthorDetails = {
  name: string;
  email: string;
  date: string;
};

export type GitHubUser = {
  login: string;
  id: number;
  node_id: string;
  avatar_url: string;
  url: string;
};

function shaFormatting(cell: Row<GitHubCommit>) {
  const shaValue: string = cell.getValue('sha');
  return (
    <div>{shaValue.slice(0, 6)}</div>
  );
}

function additionFormatting(cell: Row<GitHubCommit>) {
  const additionsValue: number = cell.getValue('additions');
  if (additionsValue > 0) {
    const additionsString = `+${JSON.stringify(additionsValue)}`;
    return (
      <Badge className="bg-success text-white hover:bg-success">{additionsString}</Badge>
    );
  };
  return (
    <Badge className="bg-muted-foreground text-white hover:bg-success">{additionsValue}</Badge>
  );
}

function deletionFormatting(cell: Row<GitHubCommit>) {
  const additionsValue: number = cell.getValue('deletions');
  if (additionsValue > 0) {
    const additionsString = `-${JSON.stringify(additionsValue)}`;
    return (
      <Badge className="bg-destructive text-white hover:bg-destructive">{additionsString}</Badge>
    );
  };
  return (
    <Badge className="bg-muted-foreground text-white hover:bg-destructive">{additionsValue}</Badge>
  );
}

function actionsFormatting(cell: Row<GitHubCommit>) {
  const commit = cell.original;
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="size-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          onClick={() => navigator.clipboard.writeText(commit.sha)}
        >
          Copy sha code
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>View diff</DropdownMenuItem>
        <DropdownMenuItem>View commit message</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

const columns: ColumnDef<GitHubCommit>[] = [
  { id: 'sha', accessorKey: 'sha', header: 'Sha', cell: ({ row }) => shaFormatting(row) },
  { id: 'author', accessorKey: 'commit.author.email', header: 'Author' },
  { id: 'additions', accessorKey: 'stats.additions', header: 'Additions', cell: ({ row }) => additionFormatting(row) },
  { id: 'deletions', accessorKey: 'stats.deletions', header: 'Deletions', cell: ({ row }) => deletionFormatting(row) },
  { id: 'actions', cell: ({ row }) => actionsFormatting(row) },
];

export function CommitTable() {
  const table = useReactTable({
    data: commits,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  },
  );
  return (
    <div>
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
          {table.getPageCount()}
          {' '}
          /
          {' '}
          {table.getPageCount()}
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
  );
}
