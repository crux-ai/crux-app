import { z } from 'zod';

export const CommitAuthorSchema = z.object({
  name: z.string().nullable(),
  email: z.string().nullable(),
  date: z.string().datetime().nullable(),
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

export const GitCommitSchemaPlus = z.object({
  sha: z.string(),
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
  branch: z.string(),
});

export const CreatePayload = z.object({
  ref: z.string().nullable(),
  ref_type: z.string(),
  master_branch: z.string(),
  description: z.string().nullable(),
  pusher_type: z.string(),
});

export const PushCommit = z.object({
  sha: z.string(),
  author: z.object({
    email: z.string(),
    name: z.string(),
  }),
  message: z.string(),
  distinct: z.boolean(),
  url: z.string().url(),
});

export const PushCommits = z.array(PushCommit);

export const ExplodedCommit = z.object({
  id: z.string(),
  gitEvent: z.enum(['Checkout', 'Commit', 'Merge', 'RepoCreation']).nullable(),
  type: z.enum(['CreateEvent', 'PushEvent']),
  eventAuthorId: z.number(),
  eventAuthorLogin: z.string(),
  repoName: z.string(),
  ref: z.string().nullable(),
  branch: z.string().nullable(),
  refType: z.string().nullable(),
  commitSha: z.string().nullable(),
  commitAuthor: z.string().nullable(),
  commitMessage: z.string().nullable(),
  createdAt: z.string().datetime(),
  activeState: z.record(z.string(), z.boolean()).nullable().optional(),
  checkoutParent: z.string().optional(),
  order_id: z.number().optional(),
});

export const PushPayload = z.object({
  repository_id: z.number(),
  push_id: z.number(),
  size: z.number(),
  distinct_size: z.number(),
  ref: z.string(),
  head: z.string(),
  before: z.string(),
  commits: PushCommits,
});

export const GithubEventSchema = z.discriminatedUnion('type', [
  z.object({
    id: z.string(),
    type: z.literal('CreateEvent'),
    actor: z.object({
      id: z.number().positive(),
      login: z.string(),
      display_login: z.string(),
      gravatar_id: z.string(),
      url: z.string().url(),
      avatar_url: z.string().url().optional(),
    }),
    repo: z.object({
      id: z.number().positive(),
      name: z.string(),
      url: z.string().url(),
    }),
    payload: CreatePayload,
    public: z.boolean(),
    created_at: z.string().datetime(),
  }),
  z.object({
    id: z.string(),
    type: z.literal('PushEvent'),
    actor: z.object({
      id: z.number().positive(),
      login: z.string(),
      display_login: z.string(),
      gravatar_id: z.string(),
      url: z.string().url(),
      avatar_url: z.string().url().optional(),
    }),
    repo: z.object({
      id: z.number().positive(),
      name: z.string(),
      url: z.string().url(),
    }),
    payload: PushPayload,
    public: z.boolean(),
    created_at: z.string().datetime(),
  }),
]);

export const EventResponseSchema = z.array(GithubEventSchema);

export const GitCommitSchema = GitCommitSchemaPlus.omit({ branch: true });

export const GitCommitResponse = z.array(GitCommitSchema);
export const GitCommitResponsePlus = z.array(GitCommitSchemaPlus);

export const TreeItemSchema = z.object({
  path: z.string(),
  mode: z.string(),
  type: z.enum(['blob', 'tree']),
  sha: z.string(),
  size: z.number().optional(),
  url: z.string().url(),
  parent_id: z.string().nullable(),
  name: z.string(),
});

export const BranchSchema = z.object({
  name: z.string(),
  commit: z.object({
    sha: z.string(),
    url: z.string().url(),
  }),
  protected: z.boolean(),
  protection: z.object({
    enabled: z.boolean(),
    required_status_checks: z
      .object({
        enforcement_level: z.string(),
        contexts: z.array(z.string()),
      })
      .nullable(),
    protection_url: z.string().url().optional(),
  }).optional(),
});

export const ListBranchesResponseSchema = z.array(BranchSchema);

export const GitHubTreeItemSchema = TreeItemSchema.omit({ parent_id: true, name: true });

export const GitHubTreeResponseSchema = z.array(GitHubTreeItemSchema);

export const Tree = z.array(TreeItemSchema);
