import { Octokit } from '@octokit/rest';
import type { z } from 'zod';

import { authenticatePage } from '@/lib/auth/actions';
import { EventResponseSchema, GitCommitResponse, GitCommitResponsePlus, ListBranchesResponseSchema } from '@/validations/github';

type Activity = z.infer<typeof EventResponseSchema>;

type GitActivityResponse = {
  data: Activity | null;
  message: string;
};

export async function getCommits(owner: string | null, repo: string | null, branch: string | null) {
  await authenticatePage();
  const octokit = new Octokit({
    auth: process.env.GITHUB_PAT,
  });

  if (!branch) {
    branch = 'main';
  }

  if (!owner || !repo) {
    return { data: null, message: 'No owner or repo given' };
  }
  try {
    const { data } = await octokit.rest.repos.listCommits({
      owner,
      repo,
      sha: branch,
      per_page: 100,
    });
    const commits = GitCommitResponse.safeParse(data);

    if (!commits.success) {
      return { data: null, message: 'Failed validation' };
    }
    return { data: commits.data, message: 'success' };
  } catch {
    return { data: null, message: 'Bad response from Github. Does the repo exits, or do you have permissions?' };
  }
}

export async function getBranches(owner: string | null, repo: string | null) {
  await authenticatePage();
  const octokit = new Octokit({
    auth: process.env.GITHUB_PAT,
  });

  if (!owner || !repo) {
    return { data: null, message: 'No owner or repo given' };
  }
  try {
    const { data } = await octokit.rest.repos.listBranches({
      owner,
      repo,
    });
    const commits = ListBranchesResponseSchema.safeParse(data);

    if (!commits.success) {
      return { data: null, message: 'Failed validation' };
    }
    return { data: commits.data, message: 'success' };
  } catch {
    return { data: null, message: 'Bad response from Github. Does the repo exits, or do you have permissions?' };
  }
}

export async function getAllCommits(owner: string | null, repo: string | null, branches: string[] | null = null) {
  if (branches === null) {
    const branchResponse = await getBranches(owner, repo);
    branches = branchResponse.data?.map (item => item.name) || [];
  }
  if (branches.length === 0) {
    return { data: null, message: 'Issue with branches, no branches were found' };
  }
  const allCommits = await Promise.all(
    branches.map(async (branchName) => {
      const commitResponse = await getCommits(owner, repo, branchName);

      return commitResponse.data?.map(commits => ({ ...commits, branch: branchName })) || null;
    }),
  );

  const { data, success } = GitCommitResponsePlus.safeParse(allCommits.flat());

  if (!success) {
    return { data: null, message: 'Data not in correct format' };
  }

  return { data, message: 'success' };
}

export async function getGitActivity(owner: string | null, repo: string | null): Promise<GitActivityResponse> {
  // Get repository events

  await authenticatePage();
  const octokit = new Octokit({
    auth: process.env.GITHUB_PAT,
  });
  if (!owner || !repo) {
    return { data: null, message: 'No owner or repo given' };
  }
  const { data: events } = await octokit.activity.listRepoEvents({
    owner,
    repo,
    per_page: 100, // adjust as needed
  });
  const { data, success } = EventResponseSchema.safeParse(events.filter(item => (item.type === 'CreateEvent') || (item.type === 'PushEvent')));
  if (!success) {
    return { data: null, message: 'Incorrect data format' };
  }

  return { data, message: 'success' };
}
