import { type NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest, { params }: { params: { owner: string; repo: string } }) {
  const { owner, repo } = params;
  if (!repo || !owner) {
    return NextResponse.json(
      { error: 'Invalid params' },
      { status: 400 },
    );
  }
  const response = await fetch(`${process.env.AUTH_URL}/commits/${owner}/${repo}`);

  return response;
}
