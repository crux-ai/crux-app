import { Octokit } from '@octokit/rest';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const owner = searchParams.get('owner');
  const repo = searchParams.get('repo');

  if (!owner || !repo) {
    return NextResponse.json({ error: 'Owner and repo are required' }, { status: 400 });
  }
  const octokit = new Octokit({
    auth: process.env.GITHUB_PAT,
  });

  const data = await octokit.request('GET /repos/{owner}/{repo}/commits', {
    owner,
    repo,
    headers: {
      'X-GitHub-Api-Version': '2022-11-28',
    },
  });

  return NextResponse.json({ data });
}
