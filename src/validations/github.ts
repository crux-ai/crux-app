import { z } from 'zod';

const TreeSchema = z.object({
  id: z.number(),
  tree_id: z.number(),
  tree_sha: z.string(),
  path: z.string(),
  mode: z.string(),
  type: z.string(),
  size: z.number(),
  file_sha: z.string(),
  parent_sha: z.string(),
  name: z.string(),
});

const CommitSchema = z.object({
  id: z.number(),
  commit_sha: z.string(),
  repo_id: z.number(),
  branch_name: z.string(),
  author_name: z.string(),
  author_email: z.string().email(),
  message: z.string(),
  committed_at: z.string().datetime(),
  parent_commit_sha: z.string(),
  url: z.string().url(),
});

const LanguageFreqSchema = z.object({
  extension: z.string(),
  count: z.number(),
});

const ShowSchema = z.object({
  trees: z.array(TreeSchema),
  commits: z.array(CommitSchema),
  languages: z.array(LanguageFreqSchema),
});

export type CommitData = z.infer<typeof CommitSchema>[];
export type LanguageFreqData = z.infer<typeof LanguageFreqSchema>[];

export { CommitSchema, ShowSchema, TreeSchema };
