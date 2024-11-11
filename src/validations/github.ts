import { z } from 'zod';

export const CommitAuthorSchema = z.object({
  name: z.string().nullable(),
  email: z.string().nullable(),
  date: z.string().nullable(),
}).nullable();

export const CommitterSchema = z.object({
  login: z.string().nullable(),
  id: z.number().nullable(),
  node_id: z.string().nullable(),
  avatar_url: z.string().nullable(),
  gravatar_id: z.string().nullable(),
  url: z.string().nullable(),
  html_url: z.string().nullable(),
  followers_url: z.string().nullable(),
  following_url: z.string().nullable(),
  gists_url: z.string().nullable(),
  starred_url: z.string().nullable(),
  subscriptions_url: z.string().nullable(),
  organizations_url: z.string().nullable(),
  repos_url: z.string().nullable(),
  events_url: z.string().nullable(),
  received_events_url: z.string().nullable(),
  type: z.string().nullable(),
  site_admin: z.boolean().nullable(),
}).nullable();

export const VerificationSchema = z.object({
  verified: z.boolean().nullable(),
  reason: z.string().nullable(),
  signature: z.string().nullable(),
  payload: z.string().nullable(),
}).nullable();

export const TreeSchema = z.object({
  sha: z.string().nullable(),
  url: z.string().nullable(),
}).nullable();

export const CommitSchema = z.object({
  author: CommitAuthorSchema.nullable(),
  committer: CommitAuthorSchema.nullable(),
  message: z.string().nullable(),
  tree: TreeSchema.nullable(),
  url: z.string().nullable(),
  comment_count: z.number().nullable(),
  verification: VerificationSchema.nullable(),
}).nullable();

export const GitCommitSchema = z.object({
  sha: z.string().nullable(),
  node_id: z.string().nullable(),
  commit: CommitSchema.nullable(),
  url: z.string().nullable(),
  html_url: z.string().nullable(),
  comments_url: z.string().nullable(),
  author: CommitterSchema.nullable(),
  committer: CommitterSchema.nullable(),
  parents: z.array(
    z.object({
      sha: z.string(),
      url: z.string(),
      html_url: z.string(),
    }).nullable(),
  ),
});

export const GitCommitResponse = z.array(GitCommitSchema);
