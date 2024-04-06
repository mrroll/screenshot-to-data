const config = require('@pluslabs/style-guide/prettier');

module.exports = {
  ...config,
  importOrder: [
    '',
    '<BUILTIN_MODULES>',
    '',
    '^(next/(.*)$)|^(next$)',
    '^(react/(.*)$)|^(react$)',
    '<THIRD_PARTY_MODULES>',
    '',
    '^@/lib/(.*)$',
    '',
    '^@/(.*)$',
    '',
    '^[./]',
  ],
  importOrderParserPlugins: ['typescript', 'jsx', 'decorators-legacy'],
  importOrderTypeScriptVersion: '5.4.4',
};
