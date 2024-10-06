module.exports = {
  extends: ['@commitlint/config-conventional'],
  parserPreset: {
    parserOpts: {
      // The ticket number should be in for better commit messages
      issuePrefixes: ['TKT-'],
    },
  },
  rules: {
    'references-empty': [2, 'never'],
  },
};
