import { createId } from '@paralleldrive/cuid2';
import { Prisma } from '@prisma/client';

export const prismaCUID2Extension = Prisma.defineExtension({
  name: 'prisma-CUID2-extension',
  query: {
    $allModels: {
      create: async ({ model, args, query }) => {
        this;
        if (model !== 'user') {
          args.data.CUID2 = `${model}_${createId()}`;
        }

        return query(args);
      },
      createMany: async ({ model, args, query }) => {
        if (Array.isArray(args.data)) {
          args.data.forEach((data) => {
            if (model !== 'user') {
              // @ts-expect-error I'm not sure how to narrow the type here.
              data.CUID2 = `${model}_${createId()}`;
            }
          });
        } else {
          if (model !== 'user') {
            args.data.CUID2 = `${model}_${createId()}`;
          }
        }

        return query(args);
      },
      upsert: async ({ model, args, query }) => {
        if (model !== 'user') {
          args.create.CUID2 = `${model}_${createId()}`;
        }

        return query(args);
      },
    },
  },
});
