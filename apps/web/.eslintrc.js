const { resolve } = require('node:path');
const project = resolve(__dirname, 'tsconfig.json');

module.exports = {
  root: true,
  parserOptions: {
    project,
  },
  extends: [
    require.resolve('@pluslabs/style-guide/eslint/browser'),
    require.resolve('@pluslabs/style-guide/eslint/node'),
    require.resolve('@pluslabs/style-guide/eslint/typescript-strict'),
    require.resolve('@pluslabs/style-guide/eslint/react'),
    require.resolve('@pluslabs/style-guide/eslint/next'),
    require.resolve('@pluslabs/style-guide/eslint/project-structure'),
  ],
};
