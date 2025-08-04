export default {
  extends: ['@commitlint/config-conventional'], rules: {
    'type-enum': [
      2,
      'always',
      [
        'init',
        'feat',
        'fix',
        'docs',
        'style',
        'refactor',
        'perf',
        'test',
        'chore',
        'revert'
      ]
    ],
    'scope-enum': [
      2,
      'always',
      [
        'project',
        'url',
        'user',
        'api-token',
        'analytics',
        'auth',
        'db',
        'config',
        'test',
        'readme'
      ]
    ],
    'type-empty': [2, 'never'],
    'scope-empty': [2, 'never'],
    'header-max-length': [2, 'always', 72],
    'subject-empty': [2, 'never']
  }
};
