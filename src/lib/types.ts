import type { links } from '@/lib/data';

export type SectionName = (typeof links)[number]['name'];

export type TimelineEntry = {
  title: string;
  content: React.ReactNode;
};
