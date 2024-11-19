'use server';

import { Octokit } from '@octokit/rest';
import type { z } from 'zod';

import { authenticatePage } from '@/lib/auth/actions';
import { GitCommitResponse, GitHubTreeItemSchema, GitHubTreeResponseSchema } from '@/validations/github';

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

type FileItem = z.infer<typeof GitHubTreeItemSchema>;

export async function getTree(owner: string | null, repo: string | null, branch: string | null) {
  await authenticatePage();
  let leaves: FileItem[] = [];

  const octokit = new Octokit({
    auth: process.env.GITHUB_PAT,
  });

  if (!owner || !repo) {
    return;
  }

  if (!branch) {
    branch = 'main';
  }

  const response = await octokit.request('GET /repos/{owner}/{repo}/git/trees/{tree_sha}', {
    owner,
    repo,
    tree_sha: branch,
    headers: {
      'X-GitHub-Api-Version': '2022-11-28',
    },
  });

  const parentId = response.data.sha;
  // console.log(response.data.tree[0]);

  for (let index = 0; index < response.data.tree.length; index++) {
    const element = GitHubTreeItemSchema.parse({ ...response.data.tree[index], parent_id: parentId });
    leaves = [...leaves, element];
    if (element.type === 'tree') {
      const newLeaves = await getTree(owner, repo, element.sha);
      if (newLeaves) {
        leaves = [...leaves, ...newLeaves];
      }
    }
  }

  return leaves;

// So im going to go through a tree, im going to assign everything in the tree with the parent_sha_id,
// Im going to add all the files to leaves
// Im then going to to apply this function on each of the trees until i get all of the leaves
// Use a map rather than for loop and then promise.all()
}

export async function getTreeRecursive(owner: string | null, repo: string | null, branch: string | null) {
  await authenticatePage();

  const octokit = new Octokit({
    auth: process.env.GITHUB_PAT,
  });

  if (!owner || !repo) {
    return;
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

  return GitHubTreeResponseSchema.parse(tree);
}
