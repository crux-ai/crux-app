import { Octokit } from '@octokit/rest';
import type { z } from 'zod';

import { authenticatePage } from '@/lib/auth/actions';
import { GitCommitResponse, GitCommitResponsePlus, GitHubTreeResponseSchema, ListBranchesResponseSchema } from '@/validations/github';

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
    const data = await octokit.paginate(octokit.rest.repos.listCommits, {
      owner,
      repo,
      sha: branch,
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

type AllCommits = z.infer<typeof GitCommitResponsePlus>;

type AllCommitReturn = { data: AllCommits | null; branches: { name: string; head: string }[] | null ; message: string };

export async function getAllCommits(owner: string | null, repo: string | null): Promise<AllCommitReturn> {
  await authenticatePage();
  const branchResponse = await getBranches(owner, repo);
  const branches = branchResponse.data?.map (item => ({ name: item.name, head: item.commit.sha })) || [];

  if (branches.length === 0) {
    return { data: null, branches: null, message: 'Issue with branches, no branches were found' };
  }
  const allCommits = await Promise.all(
    branches.map(async (branch) => {
      const commitResponse = await getCommits(owner, repo, branch.name);

      return commitResponse.data?.map(commits => ({ ...commits, branch: branch.name })) || null;
    }),
  );

  const { data, success } = GitCommitResponsePlus.safeParse(allCommits.flat());

  if (!success) {
    return { data: null, branches: null, message: 'Data not in correct format' };
  }

  return { data, branches, message: 'success' };
}

type FileTree = z.infer<typeof GitHubTreeResponseSchema>;

type TreeReturn = { data: FileTree | null; message: string };

export async function getTreeRecursive(owner: string | null, repo: string | null, branch: string | null): Promise<TreeReturn> {
  await authenticatePage();

  const octokit = new Octokit({
    auth: process.env.GITHUB_PAT,
  });

  if (!owner || !repo) {
    return { data: null, message: 'No owner or repo given' };
  }

  if (!branch) {
    branch = 'main';
  }

  const response = await octokit.request('GET /repos/{owner}/{repo}/git/trees/{tree_sha}', {
    owner,
    repo,
    tree_sha: branch,
    recursive: 'true',
    headers: {
      'X-GitHub-Api-Version': '2022-11-28',
    },
  });

  const tree = response.data.tree;

  const { data, success } = GitHubTreeResponseSchema.safeParse(tree);

  if (!success) {
    return { data: null, message: 'Data not in correct format' };
  }

  return { data, message: 'success' };
}
