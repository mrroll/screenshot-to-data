import { generate } from '@graphql-codegen/cli';

import { getHost } from '@/utilities/server/get-host';

generate(
  {
    overwrite: true,
    schema: `${getHost()}/api/graphql`,
    generates: {
      'src/graphql/codegen/resolvers.ts': {
        config: {
          useIndexSignature: true,
          scalars: {
            DateTimeISO: { input: 'Date', output: 'Date' },
            JSON: { input: 'unknown', output: 'unknown' },
            SafeInt: { input: 'number', output: 'number' },
            Void: { input: 'null', output: 'null' },
          },
          contextType: '@/graphql/context#TContextType',
        },
        plugins: ['typescript', 'typescript-resolvers'],
      },
    },
  },
  true,
).catch((error) => {
  throw error;
});
