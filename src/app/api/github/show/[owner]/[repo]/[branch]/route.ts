import { type NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest, { params }: { params: { owner: string; repo: string; branch: string } }) {
  const { owner, repo, branch } = params;
  if (!repo || !owner || !branch) {
    return NextResponse.json(
      { error: 'Invalid params' },
      { status: 400 },
    );
  }
  const response = await fetch(`${process.env.AUTH_URL}/show/${owner}/${repo}/${branch}`);
  return response;
}
