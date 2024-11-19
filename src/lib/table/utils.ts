import path from 'node:path';

import type { z } from 'zod';

import type { GitHubTreeItemSchema } from '@/validations/github';
import { Tree } from '@/validations/github';

type FileItem = z.infer<typeof GitHubTreeItemSchema>;

export function addParentIdAndNameFromPath(treeData: FileItem[]) {
  // So we assume that paths are standard and are split exclusively with /. That means we can identify
  // parents by looking for trees with the path in the path variable. We may as well also add name here
  const dataWithIds = treeData.map((item) => {
    const filename = path.basename(item.path); // Github api gives trees without trailing /
    const folderName = path.dirname(item.path); // Gives "." if root
    const parent = treeData.filter(item => (item.path === folderName));
    if (parent.length > 0) {
      return { ...item, parent_id: parent[0].sha, name: filename };
    } else {
      return { ...item, parent_id: null, name: filename };
    }
  },
  );

  return Tree.parse(dataWithIds);
}
