export const mockGitData = [
  {
    id: 'abc123def456',
    message: 'feat: add user authentication',
    fullMessage: 'feat: add user authentication\n\nImplements JWT authentication with:\n- Login\n- Register\n- Password reset',
    author: 'Jane Doe',
    timestamp: '2024-03-15T10:30:00Z',
    branch: {
      name: 'feature/auth',
      created: '2024-03-15T10:30:00Z',
      parentBranch: 'main',
    },
    edges: [
      { to: 'def456ghi789', type: 'commit' },
    ],
  },
  {
    id: 'def456ghi789',
    message: 'fix: resolve merge conflicts',
    fullMessage: 'fix: resolve merge conflicts in auth components',
    author: 'John Smith',
    timestamp: '2024-03-14T15:45:00Z',
    branch: null, // No branch reference in refs
    edges: [
      {
        to: 'ghi789jkl012',
        type: 'merge',
        branchOperation: {
          type: 'merge',
          from: 'feature/profile',
          to: 'main',
          timestamp: '2024-03-14T15:45:00Z',
        },
      },
    ],
  },
  {
    id: 'ghi789jkl012',
    message: 'feat: add profile page',
    fullMessage: 'feat: add user profile page with edit capabilities',
    author: 'Jane Doe',
    timestamp: '2024-03-13T09:15:00Z',
    branch: {
      name: 'feature/profile',
      created: '2024-03-13T09:15:00Z',
      parentBranch: 'main',
    },
    edges: [
      { to: 'jkl012mno345', type: 'commit' },
    ],
  },
  {
    id: 'jkl012mno345',
    message: 'chore: update dependencies',
    fullMessage: 'chore: update React and TypeScript versions',
    author: 'John Smith',
    timestamp: '2024-03-12T14:20:00Z',
    branch: null,
    edges: [
      {
        to: 'mno345pqr678',
        type: 'merge',
        branchOperation: {
          type: 'merge',
          from: 'feature/dark-mode',
          to: 'main',
          timestamp: '2024-03-12T14:20:00Z',
        },
      },
    ],
  },
  {
    id: 'mno345pqr678',
    message: 'feat: implement dark mode',
    fullMessage: 'feat: implement dark mode with user preference storage',
    author: 'Jane Doe',
    timestamp: '2024-03-11T11:00:00Z',
    branch: {
      name: 'feature/dark-mode',
      created: '2024-03-11T11:00:00Z',
      parentBranch: 'main',
    },
    edges: [],
  },
];
