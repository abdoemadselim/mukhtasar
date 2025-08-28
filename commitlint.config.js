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
        'revert',
        'setup'
      ]
    ],
    'scope-enum': [
      2,
      'always',
      [
        'backend',
        'frontend',
        'dashboard',
        'project',
        'archi',
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
        'lib',
        "doc",
        "domain",
        "subscription",
        "security",
        "deploy"
      ]
    ],
    'type-empty': [2, 'never'],
    'scope-empty': [2, 'never'],
    'header-max-length': [2, 'always', 72],
    'subject-empty': [2, 'never']
  }
};
