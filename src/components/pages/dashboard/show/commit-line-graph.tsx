'use-client';
import React, { useMemo, useState } from 'react';
import { CartesianGrid, Line, LineChart, XAxis } from 'recharts';

import {
  Card,
  CardContent,
  CardDescription,
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
import { customDateFormatter, type Frequencies, groupByDate } from '@/lib/git/transformations';

const chartConfig = {
  views: {
    label: 'Commits',
  },
  commits: {
    label: 'Commits',
    color: 'hsl(var(--chart-1))',
  },
} satisfies ChartConfig;

export function CommitLineGraph() {
  const { commitData } = useGitShow();
  const [frequency, setFrequency] = useState<Frequencies>('d');

  const chartData = useMemo(() => {
    const uniqueCommits = Array.from(new Map(commitData?.map(item => [item.commit_sha, item])).values());
    const unique = uniqueCommits.map(item => ({ sha: item.commit_sha, date: item.committed_at ?? null }));
    const groupedCommits = groupByDate(unique, frequency);
    return groupedCommits;
  }, [commitData, frequency]);

  const total = useMemo(
    () => ({
      commits: Object.values(chartData).reduce((acc, curr) => acc + curr.frequency, 0),
    }),
    [chartData],
  );
  return (
    <Card>
      <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
          <CardTitle>Commit Chart</CardTitle>
          <CardDescription>
            Showing frequency of commit over time
          </CardDescription>
        </div>

        <div className="flex flex-col">
          {['commits'].map((key) => {
            const chart = key as keyof typeof chartConfig;
            return (
              <button
                key={chart}
                type="button"
                className="flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l data-[active=true]:bg-muted/50 sm:border-l sm:border-t-0 sm:px-8 sm:py-6"
              >
                <span className="text-xs text-muted-foreground">
                  {chartConfig[chart].label}
                </span>
                <span className="text-lg font-bold leading-none sm:text-3xl">
                  {total[key as keyof typeof total].toLocaleString()}
                </span>
              </button>
            );
          })}
        </div>

      </CardHeader>
      <CardContent className="px-2 sm:p-6">
        <Select value={frequency} onValueChange={(value: Frequencies) => setFrequency(value)}>
          <SelectTrigger
            className="w-[160px] rounded-lg sm:ml-auto"
            aria-label="Select a value"
          >
            <SelectValue placeholder="Last 3 months" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem value={'h' as Frequencies} className="rounded-lg">
              Hourly
            </SelectItem>
            <SelectItem value={'d' as Frequencies} className="rounded-lg">
              Daily
            </SelectItem>
            <SelectItem value={'m' as Frequencies} className="rounded-lg">
              Monthly
            </SelectItem>
          </SelectContent>
        </Select>
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <LineChart
            accessibilityLayer
            data={Object.values(chartData)}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                return customDateFormatter(value, frequency);
              }}
            />
            <ChartTooltip
              content={(
                <ChartTooltipContent
                  className="w-[150px]"
                  nameKey="views"
                  labelFormatter={(value) => {
                    return customDateFormatter(value, frequency);
                  }}
                />
              )}
            />
            <Line
              dataKey="frequency"
              type="monotone"
              stroke="var(--color-commits)"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>

  );
}
