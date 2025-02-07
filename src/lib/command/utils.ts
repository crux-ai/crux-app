import type { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import type { ReadonlyURLSearchParams } from 'next/navigation';
import { toast } from 'react-hot-toast';

export function createCommandPageURL(pathname: string, searchParams: ReadonlyURLSearchParams, command: string, payload: string) {
  const params = new URLSearchParams(searchParams);
  params.set('command', command);
  params.set('payload', payload);
  return `${pathname}?${params.toString()}`;
}

export function handleSelect(router: AppRouterInstance, pathname: string, searchParams: ReadonlyURLSearchParams, command: string, payload: string) {
  router.push(createCommandPageURL(pathname, searchParams, command, payload));
}

export function handleShowSelect(router: AppRouterInstance, pathname: string, searchParams: ReadonlyURLSearchParams, githubURL: string) {
  const params = new URLSearchParams(searchParams);
  const { owner, repo, branch } = getValues(githubURL);
  if (!owner || !repo || !branch) {
    toast.error('Invalid github url');
    return;
  }
  params.set('owner', owner);
  params.set('repo', repo);
  params.set('branch', branch);
  router.push(`${pathname}?${params.toString()}`);
}

export function getValues(githubURL: string) {
  const url = new URL(githubURL);
  const path = url.pathname.split('/');
  if (path.length === 3) {
    return { owner: path[1], repo: path[2], branch: 'main' };
  }
  if (path.length === 5 && path[3] === 'tree') {
    return { owner: path[1], repo: path[2], branch: path[4] };
  }
  if (path.length > 3 && path[3] === 'tree') {
    const branchWithSlash = path.slice(4).join('/');
    return { owner: path[1], repo: path[2], branch: branchWithSlash };
  }
  return { owner: null, repo: null, branch: null };
}
