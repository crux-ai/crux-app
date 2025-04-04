import type { UserConfig } from '@commitlint/types';

const Configuration: UserConfig = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'subject-case': [
      2,
      'never',
      [
        'upper-case',
        'pascal-case',
        'start-case',
      ],
    ],
  },
};

export default Configuration;
