import { z, type z as z_ } from 'zod';

import type { EventResponseSchema, ExplodedCommit as ExplodedCommitZod, GitCommitResponsePlus, GithubEventSchema, PushCommit } from '@/validations/github';
import { ExplodedCommit as ExplodedCommitConst } from '@/validations/github';

type Activity = z_.infer<typeof EventResponseSchema >;
type Event = z_.infer<typeof GithubEventSchema>;
type Commit = z_.infer<typeof PushCommit>;
type ExplodedCommit = z_.infer<typeof ExplodedCommitZod>;
type AllCommits = z_.infer<typeof GitCommitResponsePlus>;
const _checkout = ExplodedCommitConst.extend({ loopId: z.number() });
type CheckoutType = z_.infer<typeof _checkout>;

type GitEvent = 'Commit' | 'Merge' | 'Checkout' | 'RepoCreation' | null;

function getBaseBranchAndMissingCommits(checkout: CheckoutType, explodedCommits: ExplodedCommit[], allCommits: AllCommits): ExplodedCommit[] {
  // This going to map over Checkouts and takes checkouts, explodedCommits, and allCommits
  const nextCommit = explodedCommits.slice(checkout.loopId).filter(commit => commit.type === 'PushEvent')[0];
  const commitShas = explodedCommits.map(commit => commit.commitSha);
  // Go up tree until you find a sha we have

  let found = false;
  let baseBranch;
  const commitsToInject = [];
  const commitSearch = nextCommit.commitSha;

  let referenceCommit = allCommits.filter(commit => (commit.sha === commitSearch))[0]; // How do i know to get the first one?
  while (!found) {
    //   console.log(referenceCommit);
    const referenceParent = referenceCommit.parents[0] ?? { sha: null };
    const referenceParentSha = referenceParent?.sha; // This gets the base branch if there is a merge
    const isInCommits = commitShas.includes(referenceParentSha);

    if (isInCommits) {
      // we have found the base

      baseBranch = explodedCommits.filter(commit => commit.commitSha === referenceParentSha)[0].branch;
      found = true;
    } else {
      // We have not found the base, inject that commit and go up the tree
      const baseEvent = checkout;
      referenceCommit = allCommits.filter(commit => (commit.sha === referenceParentSha))[0];
      // console.log(referenceParentSha);
      // console.log(allCommits.map(commit => commit.sha));
      const inject: ExplodedCommit = { id: baseEvent.id, gitEvent: 'Commit' as GitEvent, type: baseEvent.type, eventAuthorId: baseEvent.eventAuthorId, eventAuthorLogin: baseEvent.eventAuthorLogin, repoName: baseEvent.repoName, ref: baseEvent.ref, branch: baseEvent.branch, refType: baseEvent.refType, commitSha: referenceParentSha, commitAuthor: referenceCommit.commit?.author?.name ?? null, commitMessage: referenceCommit.commit?.message ?? null, createdAt: baseEvent.createdAt };
      commitsToInject.push(inject);
      if (referenceCommit.parents.length === 0) {
        found = true;
        baseBranch = nextCommit.branch;
      }
    }
  }
  commitsToInject.push({ checkoutParent: baseBranch ?? '', ...explodedCommits.filter(commit => commit.id === checkout.id)[0] });
  commitsToInject.reverse();
  return commitsToInject;
}

export function reconcileCheckouts(explodedCommits: ExplodedCommit[], allCommits: AllCommits): ExplodedCommit[] {
  const checkouts: CheckoutType[] = explodedCommits.map((commit, index) => ({ loopId: index, ...commit })).filter(commit => (commit.gitEvent === 'Checkout'));
  const results = checkouts.map(checkout => ({ id: checkout.id, commits: getBaseBranchAndMissingCommits(checkout, explodedCommits, allCommits) }));
  const reconciledCommits = explodedCommits.map(commit => (commit.gitEvent === 'Checkout') ? results.filter(r => (r.id === commit.id))[0].commits : commit).flat();
  return reconciledCommits;
}

function getActiveStates(explodedCommits: ExplodedCommit[]): ExplodedCommit[] {
  // I need to have a status for each branch to know whether to render a line or not i.e. is it active at that point. The best way to do this is, loop through backwards and tell me if is there a commit above me.

  // So whilst i thought this worked, actually waht i need to do is loop down, and set active if there is a checkout, set not active if  there is nothing below them!!
  const branches = Array.from(new Set(explodedCommits.map(commit => commit?.branch).filter(branch => branch !== null)));
  const result: ExplodedCommit[] = [];
  const activeState = Object.fromEntries(branches.map(branch => [branch, false]));
  for (let index = 0; index < explodedCommits.length; index++) {
    const commitBranch = explodedCommits[index].branch; // This can be a create, commit, or merge
    if (!commitBranch) {
      continue;
    }
    const branchesBelow = explodedCommits.slice(index + 1).map(commits => commits.branch);
    const isInstanceBelow = branchesBelow.includes(commitBranch);
    activeState[commitBranch] = isInstanceBelow;

    result.push({ ...explodedCommits[index], activeState: { ...activeState } });
  }
  return result;
}

type ExtendedCommit = Commit & { gitEvent: GitEvent };

function getCommitType(commits: Commit[]): ExtendedCommit[] {
  // so each pushcommit has an property called distinct, if its false it can be removed, if its the first true after
  // a false then its a merge. So loop through each and do that
  let distinctTracker = false;
  const result: ExtendedCommit[] = [];
  commits.forEach((commit) => {
    if (commit.distinct) {
      if (!distinctTracker) {
        const commitWithType: ExtendedCommit = { ...commit, gitEvent: 'Commit' };
        result.push(commitWithType);
      } else {
        const commitWithType: ExtendedCommit = { ...commit, gitEvent: 'Merge' };
        result.push(commitWithType);
        distinctTracker = false;
      }
    } else {
      distinctTracker = true;
    }
  });
  return result;
};

function explodeCommits(commits: Commit[]) {
  // I want a line per commit, so i need to take it and explode the commit array
  // So i need to come up with some logic that finds "merge blocks" NC, OC, OC, OC, OC, NC <- sliding window, thats a merge
  // I want output to be NC MC NC

  const commitsWithType = getCommitType(commits);

  const explodedCommits = commitsWithType.map(commit => ({ gitEvent: commit.gitEvent, commitSha: commit.sha, commitAuthor: commit.author.name, commitMessage: commit.message }));
  return explodedCommits;
}

function transformEvent(event: Event): ExplodedCommit[] {
  if (event.type === 'CreateEvent') {
    const gitEvent: GitEvent = (event.payload.ref_type === 'repository') ? 'RepoCreation' : (event.payload.ref_type === 'branch') ? 'Checkout' : null;

    const explodedCommits = [{ id: event.id, gitEvent, type: event.type, eventAuthorId: event.actor.id, eventAuthorLogin: event.actor.login, repoId: event.repo.id, repoName: event.repo.name, ref: event.payload.ref, branch: event.payload.ref, refType: event.payload.ref_type, commitSha: null, commitAuthor: null, commitMessage: null, createdAt: event.created_at }];

    return explodedCommits;
  }
  if (event.type === 'PushEvent') {
    const baseObject = { id: event.id, type: event.type, eventAuthorId: event.actor.id, eventAuthorLogin: event.actor.login, repoId: event.repo.id, repoName: event.repo.name, ref: event.payload.ref, branch: event.payload.ref.split('refs/heads/')[1], refType: null, createdAt: event.created_at,
    };
    const explodedCommits = explodeCommits(event.payload.commits).map(commit => ({ ...baseObject, ...commit }));
    return explodedCommits;
  }
  return [];
}

export function flattenEventsForGitGraph(events: Activity, allCommits: AllCommits): ExplodedCommit[] {
  // Provide a flat strucutre for GirGraph to read, its going to need the action i.e. create, commit, merge encoded in
  // as well as the meta data we want to show. We can work on this as and when we know we need what we need
  const filteredEvents = events.filter(item => (item.type === 'CreateEvent' || item.type === 'PushEvent'));
  const chronologicalEvents = filteredEvents.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
  const commits = chronologicalEvents.map(event => transformEvent(event)).flat();

  const commitsPlus = reconcileCheckouts(commits, allCommits);

  const commitsWithActiveStates = getActiveStates(commitsPlus);

  const commitsWithOrderId = commitsWithActiveStates.map((commit, index) => ({ ...commit, orderId: index }));

  return commitsWithOrderId;
}
