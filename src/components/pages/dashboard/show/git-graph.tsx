import { GitGraph as GitGraphComponent } from '@/components/ui/git-graph';
import { Input } from '@/components/ui/input';
import { getAllCommits, getGitActivity } from '@/lib/git/fetchers';
import { flattenEventsForGitGraph } from '@/lib/git/transformations';

export async function GitGraph() {
  const { data, message } = await getGitActivity('jack-cordery', 'dashboard');

  const { data: allCommits } = await getAllCommits('jack-cordery', 'dashboard');
  if (data === null) {
    return (
      <div>
        <Input />
        <h1>No data found!</h1>
        <h2>{message}</h2>
      </div>
    );
  }

  const initialData = flattenEventsForGitGraph(data, allCommits ?? []);
  const branches = Array.from(new Set(initialData.map(commit => commit?.branch).filter(branch => branch !== null)));

  return (
    <div>
      <Input />
      <GitGraphComponent initialData={initialData ?? []} branches={branches} />
    </div>
  );
}
