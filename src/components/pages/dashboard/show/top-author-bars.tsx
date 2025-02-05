'use client';

import { TrendingUp } from 'lucide-react';
import { useState } from 'react';
import { Bar, BarChart, CartesianGrid, LabelList, XAxis, YAxis } from 'recharts';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import type {
  ChartConfig,
} from '@/components/ui/chart';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useGitShow } from '@/context/use-git-show';
import type { Range } from '@/lib/git/transformations';
import { getTopAuthorData } from '@/lib/git/transformations';

const chartConfig = {
  desktop: {
    label: 'Commits',
    color: 'hsl(var(--chart-1))',
  },
  label: {
    color: 'hsl(var(--primary))',
  },
} satisfies ChartConfig;

const rangeMap = new Map<Range, string>([
  ['d', 'Last 24h'],
  ['m', 'Last 30 days'],
  ['y', 'Last 12 months'],
  ['all', 'All time'],
]);

export function TopAuthorBars() {
  const { commitData } = useGitShow();
  const [range, setRange] = useState<Range>('all');
  const topAuthors = getTopAuthorData(commitData, range);

  return (
    <Card>
      <CardHeader className="flex flex-col sm:flex-row">
        <div className="flex flex-1 flex-col items-stretch justify-center gap-1 ">
          <CardTitle>Top Commit Authors</CardTitle>
          <CardDescription>Top 10 Authors based on the range set</CardDescription>
        </div>
        <div className="">
          <Select value={range} onValueChange={(value: Range) => setRange(value)}>
            <SelectTrigger
              className="w-[100px] rounded-lg sm:ml-auto"
              aria-label="Select a value"
            >
              <SelectValue className="truncate" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              {Array.from(rangeMap.entries()).map(([key, val]) => (
                <SelectItem key={key} value={key as Range} className="rounded-lg">
                  {val}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart
            accessibilityLayer
            data={topAuthors}
            layout="vertical"
            margin={{
              right: 16,
            }}
          >
            <CartesianGrid horizontal={false} />
            <YAxis
              dataKey="author"
              type="category"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={value => value.slice(0, 3)}
              hide
            />
            <XAxis dataKey="frequency" type="number" hide />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="line" />}
            />
            <Bar
              dataKey="frequency"
              layout="vertical"
              fill="var(--color-desktop)"
              radius={4}
            >
              <LabelList
                dataKey="author"
                position="insideLeft"
                offset={24}
                className="fill-[--color-label]"
                fontSize={12}
              />
              <LabelList
                dataKey="frequency"
                position="right"
                offset={5}
                className="fill-foreground"
                fontSize={12}
              />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          Trending up by 5.2% this month
          {' '}
          <TrendingUp className="size-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Showing total visitors for the last 6 months
        </div>
      </CardFooter>
    </Card>
  );
}
