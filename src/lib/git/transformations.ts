import type { z } from 'zod';

import type { Languages } from '@/lib/git/languages';
import type { GitCommitSchemaPlus, GitHubTreeItemSchema } from '@/validations/github';
import { Tree } from '@/validations/github';

type CommitType = 'Merge' | 'Commit' | 'Initial';
type AllCommits = z.infer<typeof GitCommitSchemaPlus>;
type FileItem = z.infer<typeof GitHubTreeItemSchema>;

export type Commits = { branches: string[]; type: CommitType; mergeSource: string | null ; sha: string; parentSha: string; message: string; date: string; authorName: string };
export type ChartData = { date: Date; frequency: number }[];

export type Frequencies = 'h' | 'd' | 'm';

export type CommitGroup = Record<string, Commits>;

/**
 * Extracts the source branch name from a Git merge commit message.
 * Supports both standard merges and pull request merges.
 * @param message - The merge commit message.
 * @returns The source branch name, or null if not found.
 */
function getSourceBranchName(message: string): string | null {
  const regexes = [
    /Merge branch '([^']+)'/,
    /Merge pull request #\d+ from [^/]+\/(\S+)/i,
    /Merge remote-tracking branch '[^/]+\/(\S+)/i,
  ];

  for (const regex of regexes) {
    const match = message.match(regex);
    if (match) {
      return match[1];
    }
  }

  return null; // Return null if no match is found
}

/**
 * Groups an array of Git commits by their SHA.
 * Each commit is categorized by its type (Merge, Commit, Initial) and
 * includes details such as branches, parent SHA, message, date, and author name.
 *
 * @param allCommits - An array of commits to be grouped.
 * @returns A record of commits grouped by their SHA.
 */
function groupCommitsBySha(allCommits: AllCommits[]): CommitGroup {
  const groupSha = allCommits.reduce <CommitGroup>((result, commit) => {
    const key = commit.sha;
    const type: CommitType = (commit.commit?.message?.startsWith('Merge') ?? false)
      ? 'Merge'
      : ((commit.parents[0]?.sha ?? '') === '')
          ? 'Initial'
          : 'Commit';
    const mergeSource = getSourceBranchName(commit.commit?.message ?? '');
    if (!result[key]) {
      result[key] = { branches: [], type, mergeSource, sha: commit.sha, parentSha: commit.parents[0]?.sha ?? '', message: commit.commit?.message ?? '', date: commit.commit?.author?.date ?? '', authorName: commit.commit?.author?.name ?? '' };
    }
    result[key].branches.push(commit.branch);
    return result;
  }, {});

  return groupSha;
}

/**
 * Processes a merge commit to determine and update branch relationships.
 * For a given merge commit, identifies the source and target branches involved,
 * and updates the mergeSource property of affected commits to reflect the correct
 * branch hierarchy.
 *
 * @param mergeCommit - Object containing merge commit ID and SHA
 * @param mergeCommit.id - The ID of the merge commit.
 * @param mergeCommit.sha - The SHA of the merge commit.
 * @param mergeIndices - Array of indices where merge commits occur in the commit history
 * @param sortedCommits - Chronologically sorted array of all commits
 * @returns Updated array of commits with corrected branch relationships
 * @throws Error if merge commit has invalid or missing source branch
 */
function cleanMerge(mergeCommit: { id: number; sha: string }, mergeIndices: number[], sortedCommits: Commits[]) {
  const commit = sortedCommits.filter(commit => commit.sha === mergeCommit.sha)[0];
  const index = mergeCommit.id;
  const prevMergeIndex = (mergeIndices.indexOf(index) > 0) ? mergeIndices[mergeIndices.indexOf(index) - 1] : undefined;
  const source = commit.mergeSource;
  if (source === null) {
    throw new Error('Invalid Source');
  }
  // TODO: Need to deal with this edge case
  // if (commit.branches.length > 1) {
  //   console.log(commit);
  //   throw new Error('Invalid Merge');
  // }
  const target = commit.branches[0];
  const parentSha = commit.parentSha;
  const parentCommit = sortedCommits.map((commit, index) => ({ id: index, ...commit })).filter(commit => commit.sha === parentSha)[0];
  const parentIsMerge = parentCommit.type === 'Merge';
  const affectedCommits = sortedCommits.slice(parentCommit.id + 1, index).filter(commit => commit.branches.includes(source) && commit.branches.includes(target));

  const parentReconciliation = parentIsMerge ? [] : sortedCommits.slice(prevMergeIndex ?? 0, parentCommit.id + 1).filter(commit => JSON.stringify(commit.branches) === JSON.stringify(parentCommit.branches)); /// could branches be in diff orders? Dont think so as we read in per branch

  sortedCommits.forEach((commit) => {
    if (parentReconciliation.map(p => p.sha).includes(commit.sha)) {
      commit.mergeSource = target;
    }
    if (affectedCommits.map(p => p.sha).includes(commit.sha)) {
      commit.mergeSource = source;
    }
  });
  return sortedCommits;
}

/**
 * Analyzes commit history to determine original branch relationships by examining merge commits.
 * Tracks branch creation points and merges to build a hierarchy showing which branches were
 * created from others.
 *
 * @param commits - Array of commit objects with branch, message and timestamp data
 * @returns The commits array with branch relationships mapped
 */
function cleanWithMerges(commits: Commits[]): Commits[] {
  const sortedCommits = commits.slice().sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  const whereAreMyMerges = sortedCommits.map((commit, index) => ({ id: index, sha: commit.sha, type: commit.type })).filter(commit => commit.type === 'Merge');
  const mergeIndices = whereAreMyMerges.map(merge => merge.id);

  let result = sortedCommits;
  for (const mergeCommit of whereAreMyMerges) {
    result = cleanMerge(mergeCommit, mergeIndices, result);
  }

  return result;
}

/**
 * Transforms raw GitHub API commit data into a structured format for Git graph visualization.
 * Groups commits by SHA to handle multiple branch references, then processes merge relationships
 * to establish branch hierarchy.
 *
 * @param allCommits - Array of raw commit objects from GitHub API
 * @returns Array of processed commit objects with branch relationships and merge data
 */

export function transformAllCommitsGitGraph(allCommits: AllCommits[] | null): Commits[] {
  const groupedCommits = Object.values(groupCommitsBySha(allCommits ?? []));

  return cleanWithMerges(groupedCommits);
}

export function addParentIdAndNameFromPath(treeData: FileItem[]) {
  // So we assume that paths are standard and are split exclusively with /. That means we can identify
  // parents by looking for trees with the path in the path variable. We may as well also add name here
  const dataWithIds = treeData.map((item) => {
    const filename = item.path.split('/').pop(); // path.basename(item.path); // Github api gives trees without trailing /
    const folderName = item.path.substring(0, item.path.lastIndexOf('/')) || '.';// path.dirname(item.path); // Gives "." if root
    const parent = treeData.filter(item => (item.path === folderName));
    if (parent.length > 0) {
      return { ...item, parent_id: parent[0].sha, name: filename };
    } else {
      return { ...item, parent_id: null, name: filename };
    }
  },
  );

  return Tree.parse(dataWithIds);
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

export type Range = 'd' | 'm' | 'y' | 'all';

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
      commitsRange = allCommits.filter(commit => new Date(commit.commit?.author?.date || '').getTime() > dateThen.getTime());
      break;
    }
    case 'm': {
      // Give me the last 30 days
      const dateThen = new Date(dateNow);
      dateThen.setMonth(dateThen.getMonth() - 1);
      commitsRange = allCommits.filter(commit => new Date(commit.commit?.author?.date || '').getTime() > dateThen.getTime());
      break;
    }
    case 'y': {
      // Give me 12 months?
      const dateThen = new Date(dateNow);
      dateThen.setFullYear(dateThen.getFullYear() - 1);
      commitsRange = allCommits.filter(commit => new Date(commit.commit?.author?.date || '').getTime() > dateThen.getTime());
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
  const uniqueCommits = Array.from(new Map(commitsRange.map(item => [item.sha, item])).values());
  const authors = uniqueCommits.map(commit => ({ author: commit.author?.login ?? null })).filter(author => author.author !== null);
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
 * Extracts the file extension from a given file path.
 * Only handles simple file paths with a single dot separator.
 *
 * @param path - The file path to extract the extension from
 * @returns The file extension without the dot, or null if no extension found
 */
function getExtension(path: string, withPeriod: boolean): string | null {
  const splitPath = path.split('.');
  if (splitPath.length > 1) {
    return withPeriod ? `.${splitPath[splitPath.length - 1]}` : splitPath[splitPath.length - 1];
  }
  return null;
}

/**
 * Creates a mapping from file extensions to programming language names.
 * Filters the input languages to only include programming languages (excludes data, markup etc).
 * For each programming language, maps all its file extensions to its name.
 *
 * @param languages - Object containing language definitions with their metadata
 * @returns Map where keys are file extensions (with dot prefix) and values are programming language names
 */
function languageToMap(languages: Languages) {
  const languagesClean = Object.entries(languages).map(lang => ({
    name: lang[0],
    ...lang[1],
  })).filter(lang => lang.type === 'programming');
  const languagesExploded = languagesClean.flatMap(lang => lang.extensions?.map(extension => ({ name: lang.name, extension }))).filter(lang => lang);

  const languageMap = new Map(languagesExploded.map(l => [l?.extension, l?.name]));
  return languageMap;
}

export type LanguageFrequency = {
  extension: string;
  frequency: number;
  language: string | null;
  type: string | null;
};

/**
 * Analyzes the language distribution of files in a repository by counting file extensions.
 * Maps file extensions to programming languages using the provided language definitions.
 *
 * @param allFiles - Array of files from the repository to analyze
 * @param languages - Language definitions mapping names to metadata
 * @returns Array of objects containing:
 *          - frequency: Count of files with this extension
 *          - language: Name of mapped programming language, or null if unknown
 */
export function getLanguageFreq(allFiles: FileItem[], languages: Languages) {
  // This is going to take the files

  // Get their extensison
  const fileExtensions = allFiles.filter(file => file.type === 'blob').map(file => ({ extension: getExtension(file.path, true) }));
  // group by said extension and get count
  const groupedExtensions = fileExtensions.reduce((acc, curr) => {
    const key = curr.extension || 'Unknown';
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const extensionFrequency = Object.entries(groupedExtensions).map(extension => ({ extension: extension[0], frequency: extension[1] }));
  extensionFrequency.sort((a, b) => b.frequency - a.frequency);

  // Map it to language
  const languageMap = languageToMap(languages);

  const languageFrequency = extensionFrequency.map(ext => ({ language: (languageMap.get(ext.extension) || null), ...ext }));

  const grouped = languageFrequency.reduce((acc, curr) => {
    const key = curr.language || 'Unknown';
    acc[key] = (acc[key] || 0) + curr.frequency;
    return acc;
  }, {} as Record<string, number>);

  return Object.entries(grouped).map(group => ({ language: group[0], frequency: group[1] }));
}
