'use client';

import { type ColumnDef, flexRender, getCoreRowModel, getSortedRowModel, type Row, useReactTable } from '@tanstack/react-table';
import { File, Folder, HomeIcon, Slash } from 'lucide-react';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import type { z } from 'zod';

import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { getTreeRecursive } from '@/lib/git/fetchers';
import { addParentIdAndNameFromPath } from '@/lib/git/transformations';
import type { TreeItemSchema } from '@/validations/github';

type FileItem = z.infer<typeof TreeItemSchema>;

export function FileExplorer({ owner, repo, branch }: { owner: string | null; repo: string | null; branch: string | null }) {
  // Define some states, and that
  const [currentPath, setCurrentPath] = useState<FileItem[]>([]);
  // const initialData = data.filter(item => item.parent_id === null);
  const [fullData, setFullData] = useState<FileItem[]>([]);
  const [visibleData, setVisibleData] = useState<FileItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [failedLoad, setFailedLoad] = useState(false);

  useEffect(() => {
    const handleLoad = async () => {
      const { data, message } = await getTreeRecursive(owner, repo, branch);

      if (data) {
        const fullData = addParentIdAndNameFromPath(data);
        setFullData(fullData);
        setVisibleData(fullData.filter(item => item.parent_id === null));
        setIsLoading(false);
        return;
      }
      toast.error(message);
      setFailedLoad(true);
      setIsLoading(false);
    };
    handleLoad();
  }, [owner, repo, branch]);

  // define OnClick
  function handleFolderClick(folderItem: FileItem) {
    const folderId = folderItem.sha;
    setCurrentPath([...currentPath, folderItem]);
    setVisibleData(fullData.filter(item => item.parent_id === folderId));
  }

  function handleBreadcrumbClick(index: number | null, folderItem: FileItem | null) {
    if (index === null || folderItem === null) {
      setCurrentPath([]);
      setVisibleData(fullData.filter(item => item.parent_id === null));
    } else {
      const folderId = folderItem.sha;
      setCurrentPath(currentPath.slice(0, index + 1));
      setVisibleData(fullData.filter(item => item.parent_id === folderId));
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
    isLoading
      ? (
          <div>
            Loading
          </div>
        )
      : (failedLoad
          ? ((<div>Failed Load! Ensure correct url is supplied or that you haven't hit your github rate limit</div>))
          : (
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
            ))
  );
}
