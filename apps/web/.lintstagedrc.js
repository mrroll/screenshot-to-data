const path = require('node:path');

const buildPrettierCommand = (filenames) => {
  const command = `prettier --write ${filenames
    .map((f) => path.relative(__dirname, f))
    .join(' ')}`;

  return command;
};

const buildEslintCommand = (filenames) => {
  const command = `next lint --file ${filenames
    .map((f) => path.relative(__dirname, f))
    .join(' --file ')}`;

  return command;
};

module.exports = {
  '*.{js,jsx,ts,tsx}': [buildPrettierCommand, buildEslintCommand],
  'package.json': [buildPrettierCommand],
};
