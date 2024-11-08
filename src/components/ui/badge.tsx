import type { VariantProps } from 'class-variance-authority';
import * as React from 'react';

import { badgeVariants } from '@/components/ui/utils/badge-variants';
import { cn } from '@/lib/utils';

export type BadgeProps = {} & React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof badgeVariants>;

export function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}
