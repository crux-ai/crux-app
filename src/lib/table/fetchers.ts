'use server';

import { Octokit } from '@octokit/rest';

import { authenticatePage } from '@/lib/auth/actions';
import { GitCommitResponse } from '@/validations/github';

export async function getCommits(owner: string | null, repo: string | null, branch: string | null) {
  await authenticatePage();
  const octokit = new Octokit({
    auth: process.env.GITHUB_PAT,
  });

  if (!branch) {
    branch = 'main';
  }

  if (!owner || !repo) {
    return { data: null };
  }

  const { data } = await octokit.rest.repos.listCommits({
    owner,
    repo,
    sha: branch,
    per_page: 100,
  });

  const commits = GitCommitResponse.safeParse(data);

  return commits;
}
