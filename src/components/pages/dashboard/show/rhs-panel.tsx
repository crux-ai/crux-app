import React from 'react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

type CardProps = React.ComponentProps<typeof Card>;

export default function RhsPanel({ className, ...props }: CardProps) {
// This will have a prop that determines what is shown. Base will be some kind of generic infomation
// Option would be to open something like a text editor to view the file for instance, or commit diff
  return (
    <Card className={cn('w-[280px]', className)} {...props}>
      <CardHeader>
        <CardTitle>Card Title</CardTitle>
        <CardDescription>Card Description</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-row gap-8">
        <p> content </p>
      </CardContent>
    </Card>
  );
}
