import { argv } from 'zx';

import { cliArgsSchema } from '@/cli-args';
import { describeDatabaseFiles } from '@/describe-database-files';
import { describeLocalFiles } from '@/describe-local-files';
import { gracefulExit } from '@/utilities/graceful-exit';

const main = async () => {
  gracefulExit();

  const args = cliArgsSchema.parse(argv);

  const { _: command } = args;

  switch (command) {
    case 'describe-local-files': {
      const { files } = args;

      return describeLocalFiles({ files });
    }

    case 'describe-database-files': {
      const { take } = args;

      return describeDatabaseFiles({
        take,
        'cursor-id': args['cursor-id'],
        'cursor-created-at': args['cursor-created-at'],
      });
    }
  }
};

main().catch((error) => {
  throw error;
});
