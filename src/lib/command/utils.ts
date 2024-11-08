import type { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import type { ReadonlyURLSearchParams } from 'next/navigation';

export function createCommandPageURL(pathname: string, searchParams: ReadonlyURLSearchParams, command: string, payload: string) {
  const params = new URLSearchParams(searchParams);
  params.set('command', command);
  params.set('payload', payload);
  return `${pathname}?${params.toString()}`;
}

export function handleSelect(router: AppRouterInstance, pathname: string, searchParams: ReadonlyURLSearchParams, command: string, payload: string) {
  router.push(createCommandPageURL(pathname, searchParams, command, payload));
}
