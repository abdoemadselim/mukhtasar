export default {
  extends: ['@commitlint/config-conventional'], rules: {
    'type-enum': [
      2,
      'always',
      [
        'backend',
        'frontend',
        'init',
        'feat',
        'fix',
        'docs',
        'style',
        'refactor',
        'perf',
        'test',
        'chore',
        'revert',
        'setup'
      ]
    ],
    'scope-enum': [
      2,
      'always',
      [
        'archi',
        'project',
        'url',
        'logging',
        'user',
        'api-token',
        'analytics',
        'auth',
        'db',
        'config',
        'test',
        'readme',
        'lib'
      ]
    ],
    'type-empty': [2, 'never'],
    'scope-empty': [2, 'never'],
    'header-max-length': [2, 'always', 72],
    'subject-empty': [2, 'never']
  }
};
