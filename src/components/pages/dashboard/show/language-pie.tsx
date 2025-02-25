'use client';
import { TrendingUp } from 'lucide-react';
import React, { useMemo } from 'react';
import { Label, Pie, PieChart } from 'recharts';

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
import { useGitShow } from '@/context/use-git-show';
import { languages } from '@/lib/git/languages';
import { getLanguageFreq } from '@/lib/git/transformations';

export default function LanguagePie() {
  const { fileData } = useGitShow();
  const languageData = useMemo(() => {
    const languageFrequency = getLanguageFreq(fileData, languages).filter(lang => lang.language !== null);
    const languageFill = languageFrequency.map(lang => ({ ...lang, fill: `var(--color-${lang.language.replaceAll(' ', '')})` }));
    return languageFill.slice(0, 7); // TODO: make it top 5 with rest as 'other'
  }, [fileData]);

  const totalFiles = useMemo(() => {
    return languageData.reduce((acc, curr) => acc + curr.frequency, 0);
  }, [languageData]);

  const chartConfig = {
    frequency: {
      label: 'Count',
    },
    ...languageData.reduce((acc, curr, index) => {
      acc[curr.language.replaceAll(' ', '')] = { label: curr.language, color: `hsl(var(--chart-${index + 1}))` };
      return acc;
    }, {} as Record<string, { label: string; color: string }>),

  } satisfies ChartConfig;

  return (
    <Card className="flex flex-col">
      <CardHeader className="pb-0">
        <CardTitle>Languages</CardTitle>
        <CardDescription>Programming languages across the repository</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={languageData}
              dataKey="frequency"
              nameKey="language"
              innerRadius={60}
              strokeWidth={2}
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-3xl font-bold"
                        >
                          {totalFiles.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          Files
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 font-medium leading-none">
          {' '}
          <TrendingUp className="size-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Showing the proportion of different programming languages across the repository
        </div>
      </CardFooter>
    </Card>
  );
}
