import { Octokit } from '@octokit/rest';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { authenticatePage } from '@/lib/auth/actions';

export async function GET(request: NextRequest) {
  await authenticatePage();
  const searchParams = request.nextUrl.searchParams;
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
