const path = require('node:path');

const buildPrettierCommand = (filenames) => {
  const command = `prettier --write ${filenames
    .map((f) => path.relative(__dirname, f))
    .join(' ')}`;

  return command;
};

const buildEslintCommand = (filenames) => {
  const command = `eslint ${filenames
    .map((f) => path.relative(__dirname, f))
    .join(' ')}`;

  return command;
};

module.exports = {
  '*.{js,ts}': [buildPrettierCommand, buildEslintCommand],
  'package.json': [buildPrettierCommand],
};
