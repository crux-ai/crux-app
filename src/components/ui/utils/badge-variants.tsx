import { cva } from 'class-variance-authority';

export const badgeVariants = cva(
  'inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
  {
    variants: {
      variant: {
        default:
          'border-transparent bg-primary text-primary-foreground shadow hover:bg-primary/80',
        secondary:
          'border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80',
        destructive:
          'border-transparent bg-destructive text-destructive-foreground shadow hover:bg-destructive/80',
        outline: 'rounded-full border-2 text-foreground hover:bg-secondary',
        sparkle: 'm-2 h-6 rounded-full border-2 border-sparkle py-2 text-lg tracking-wide text-sparkle',
        load: 'mr-2 bg-cyan-500 font-bold',
        open: 'mr-2 bg-indigo-500 font-bold',
        show: 'mr-2 bg-emerald-500 font-bold',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);
