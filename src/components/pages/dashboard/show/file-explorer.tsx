'use client';

import { type ColumnDef, flexRender, getCoreRowModel, getSortedRowModel, type Row, useReactTable } from '@tanstack/react-table';
import { File, Folder, HomeIcon, Slash } from 'lucide-react';
import { useState } from 'react';
import type { z } from 'zod';

import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useGitShow } from '@/context/use-git-show';
import type { TreeItemSchema } from '@/validations/github';

export type FileItem = z.infer<typeof TreeItemSchema>;

export function FileExplorer() {
  // Define some states, and that
  const { fileData } = useGitShow();
  const [currentPath, setCurrentPath] = useState<FileItem[]>([]);
  const [visibleData, setVisibleData] = useState<FileItem[]>(fileData.filter(item => item.parent_id === null));

  // define OnClick
  function handleFolderClick(folderItem: FileItem) {
    const folderId = folderItem.sha;
    setCurrentPath([...currentPath, folderItem]);
    setVisibleData(fileData.filter(item => item.parent_id === folderId));
  }

  function handleBreadcrumbClick(index: number | null, folderItem: FileItem | null) {
    if (index === null || folderItem === null) {
      setCurrentPath([]);
      setVisibleData(fileData.filter(item => item.parent_id === null));
    } else {
      const folderId = folderItem.sha;
      setCurrentPath(currentPath.slice(0, index + 1));
      setVisibleData(fileData.filter(item => item.parent_id === folderId));
    }
  }

  function nameFormatting(row: Row<FileItem>) {
    const name: string = row.getValue('name') ?? 'Unknown';
    const isFolder = (row.original.type === 'tree');
    return (
      <>
        {isFolder
          ? (

              <div className="flex items-center gap-2">
                <Button variant="link" onClick={() => handleFolderClick(row.original)}>
                  <Folder size={16} />
                  {name}
                </Button>
              </div>

            )
          : (
              <div className="flex items-center gap-2">
                <File size={16} />
                {name}
              </div>
            )}
      </>

    );
  }

  const columns: ColumnDef<FileItem>[] = [
    { id: 'name', accessorKey: 'name', header: 'Name', cell: ({ row }) => nameFormatting(row) },
    { id: 'type', accessorKey: 'type' },
    { id: 'size', accessorKey: 'size', header: 'Size' },
  ];

  // Define React Table
  const table = useReactTable({
    data: visibleData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    initialState: {
      sorting: [
        {
          id: 'type',
          desc: true,
        },
      ],
    },
  });

  return (

    <div>
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink onClick={() => handleBreadcrumbClick(null, null)}>
              <HomeIcon size={16} />
            </BreadcrumbLink>
          </BreadcrumbItem>
          {currentPath.map((folderItem, indx) => (
            <BreadcrumbItem key={folderItem.sha}>
              <BreadcrumbSeparator>
                {' '}
                <Slash />
                {' '}
              </BreadcrumbSeparator>
              <BreadcrumbLink onClick={() => handleBreadcrumbClick(indx, folderItem)}>
                {folderItem.name}
              </BreadcrumbLink>
            </BreadcrumbItem>
          ))}
        </BreadcrumbList>
      </Breadcrumb>

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
          {table.getRowModel().rows?.length
            ? (table.getRowModel().rows.map(row => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map(cell => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              )))
            : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className=" text-center text-muted-foreground"
                  >
                    No files in this directory
                  </TableCell>
                </TableRow>
              )}
        </TableBody>
      </Table>
    </div>
  );
}
