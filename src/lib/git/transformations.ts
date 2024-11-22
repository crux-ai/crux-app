import type { z } from 'zod';

import type { GitCommitSchemaPlus, GitHubTreeItemSchema } from '@/validations/github';
import { Tree } from '@/validations/github';

type CommitType = 'Merge' | 'Commit' | 'Initial';
type AllCommits = z.infer<typeof GitCommitSchemaPlus>;
export type Commits = { branches: string[]; type: CommitType; mergeSource: string | null ; sha: string; parentSha: string; message: string; date: string; authorName: string };

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

type FileItem = z.infer<typeof GitHubTreeItemSchema>;

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
