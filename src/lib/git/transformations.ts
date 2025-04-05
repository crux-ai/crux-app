import type { z } from 'zod';

import type { CommitSchema } from '@/validations/github';

type AllCommits = z.infer<typeof CommitSchema>;

export type Range = 'd' | 'm' | 'y' | 'all';
export type Frequencies = 'h' | 'd' | 'm';
export type ChartData = { date: Date; frequency: number }[];

/**
 * Gets commit frequency data for top authors within a specified time range.
 * Filters commits based on the given time range, removes duplicate commits by SHA,
 * and returns author commit frequencies sorted in descending order.
 *
 * @param allCommits - Array of all commit data
 * @param range - Time range to analyze: 'd' (24h), 'm' (30 days), 'y' (12 months), or 'all' (all time)
 * @returns Array of objects containing author names and their commit frequencies, sorted by frequency
 * @throws Error if an invalid range is provided
 */
export function getTopAuthorData(allCommits: AllCommits[], range: Range = 'all') {
  const dateNow = new Date();
  let commitsRange: AllCommits[] = [];
  switch (range) {
    case 'd':{
      // Give me the last day
      const dateThen = new Date(dateNow);
      dateThen.setDate(dateThen.getDate() - 1);
      commitsRange = allCommits.filter(commit => new Date(commit.committed_at || '').getTime() > dateThen.getTime());
      break;
    }
    case 'm': {
      // Give me the last 30 days
      const dateThen = new Date(dateNow);
      dateThen.setMonth(dateThen.getMonth() - 1);
      commitsRange = allCommits.filter(commit => new Date(commit.committed_at || '').getTime() > dateThen.getTime());
      break;
    }
    case 'y': {
      // Give me 12 months?
      const dateThen = new Date(dateNow);
      dateThen.setFullYear(dateThen.getFullYear() - 1);
      commitsRange = allCommits.filter(commit => new Date(commit.committed_at || '').getTime() > dateThen.getTime());
      break;
    }
    case 'all': {
      commitsRange = allCommits;
      break;
    }
    default: {
      throw new Error('Invalid Range. Use d, m, y or all');
    }
  }

  // 1 Get unique Commits (on Sha)
  const uniqueCommits = Array.from(new Map(commitsRange.map(item => [item.commit_sha, item])).values());
  const authors = uniqueCommits.map(commit => ({ author: commit.author_name ?? null })).filter(author => author.author !== null);
  const grouped = authors.reduce((acc, curr) => {
    const key = curr.author;
    if (key) {
      acc[key] = (acc[key] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>);

  const authorFrequency = Object.entries(grouped).map(author => ({ author: author[0], frequency: author[1] }));
  authorFrequency.sort((a, b) => b.frequency - a.frequency);
  return authorFrequency;
}

/**
 * Groups commit data by date according to specified frequency (hour/day/month)
 * @param data - Array of commit objects
 * @param frequency - Grouping frequency: 'h' (hourly), 'd' (daily), or 'm' (monthly)
 * @returns Array of objects with date string and commit frequency count
 */
export function groupByDate(data: { sha: string; date: string | null }[], frequency: Frequencies) {
  // Fix this - lets just keep it as a date until the formatter for the actual graph itself!

  const grouped = data.reduce((acc, item) => {
    const date = new Date(item.date ?? '');
    const key = dateToGroup(date, frequency);
    acc[key.toISOString()] = (acc[key.toISOString()] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const dates = Object.entries(grouped).map(date => ({ date: new Date (date[0]), frequency: date[1] }));
  dates.sort((a, b) => a.date.getTime() - b.date.getTime());
  return fillZeroes(dates, frequency);
}

/**
 * Formats a date according to the specified frequency level.
 * For monthly frequency, shows MM/YYYY
 * For daily frequency, shows DD/MM/YYYY
 * For hourly frequency, shows DD/MM/YYYY HH:00
 *
 * @param value - Date object to format
 * @param frequency - Format level: 'h' (hourly), 'd' (daily), or 'm' (monthly)
 * @returns Formatted date string in en-GB locale
 */
export function customDateFormatter(value: Date, frequency: Frequencies): string {
  if (value === undefined) {
    return '';
  }
  const date = new Date(value);

  const formatter = new Intl.DateTimeFormat('en-GB', {
    year: 'numeric',
    month: frequency === 'm' || frequency === 'd' || frequency === 'h' ? '2-digit' : undefined,
    day: frequency === 'd' || frequency === 'h' ? '2-digit' : undefined,
    hour: frequency === 'h' ? '2-digit' : undefined,
    hourCycle: 'h23', // Use 24-hour clock
  });

  return formatter.format(date);
}

/**
 * Fills in missing dates with zero frequencies in a time series dataset.
 * For a given range of dates determined by the first and last dates in the input data,
 * ensures there is an entry for every time interval (hour/day/month) with either
 * the actual frequency from the input data or zero if no data exists for that interval.
 *
 * @param chartData - Array of objects containing dates and their corresponding frequencies
 * @param frequency - Time interval to fill: 'h' (hourly), 'd' (daily), or 'm' (monthly)
 * @returns Array of objects with continuous dates and frequencies, filling gaps with zero
 */
function fillZeroes(chartData: ChartData, frequency: Frequencies) {
  if (chartData.length < 2 || !chartData[0].date || !chartData[chartData.length - 1].date) {
    return chartData;
  }
  // Get an array of all the dates in a range
  const startDate = new Date(chartData[0].date);
  const endDate = new Date(chartData[chartData.length - 1].date);
  const currentDate = new Date(startDate);
  const dates: ChartData = [];
  // for each date, if that exists in chartdata set frequency
  while (true) {
    dates.push(chartData.filter(item => item.date.getTime() === currentDate.getTime())[0] || { date: new Date(currentDate), frequency: 0 });
    switch (frequency) {
      case 'h':
        currentDate.setHours(currentDate.getHours() + 1);
        break;
      case 'd':
        currentDate.setDate(currentDate.getDate() + 1);
        break;
      case 'm':
        currentDate.setMonth(currentDate.getMonth() + 1);
        break;
      default:
        throw new Error('Invalid Frequency. Use d, m, or h');
    }
    if (currentDate > endDate) {
      break;
    }
  }

  return dates;
}

/**
 * Fills in missing dates with zero frequencies in a time series dataset.
 * For each frequency level (hourly/daily/monthly), ensures continuous date coverage
 * by adding entries with 0 frequency for any missing time periods.
 *
 * @param date - Array of objects containing date and frequency data
 * @param frequency - Time grouping frequency: 'h' (hourly), 'd' (daily), or 'm' (monthly)
 * @returns Array of date/frequency objects with gaps filled with zero values
 */
function dateToGroup(date: Date, frequency: Frequencies): Date {
  const outputDate = new Date(date);
  switch (frequency) {
    case 'h':
      // Set hours (and everything after) to be the same, but keep the rest the same
      outputDate.setMinutes(0, 0, 0);
      break;
    case 'd':
      // Set ( and everyhting after day) to be the same
      outputDate.setHours(0, 0, 0, 0);
      break;
    case 'm':
      // Set everything after month i.e. day -> to be the same
      outputDate.setDate(1);
      outputDate.setHours(0, 0, 0, 0);
      break;
    default:
      throw new Error('Invalid Frequency. Use d, m, or h');
  }
  return outputDate;
}
