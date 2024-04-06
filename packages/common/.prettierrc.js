const config = require('@pluslabs/style-guide/prettier');

module.exports = {
  ...config,
  importOrderParserPlugins: ['typescript', 'jsx', 'decorators-legacy'],
  importOrderTypeScriptVersion: '5.4.3',
};
