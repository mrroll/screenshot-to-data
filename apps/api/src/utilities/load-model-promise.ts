import { z } from 'zod';
import { type ProcessPromise } from 'zx';

const schema = z.object({
  message: z.literal('model loaded'),
});

export const loadModelPromise = (process: ProcessPromise) => {
  return new Promise<z.infer<typeof schema>>((resolve, reject) => {
    process.stdout.on('data', (data: Buffer) => {
      try {
        const parsed = schema.safeParse(JSON.parse(data.toString()));

        if (parsed.success !== true) {
          return;
        }

        resolve(parsed.data);
      } catch (error) {
        if (error instanceof SyntaxError !== true) {
          reject(error);
        }
      }
    });
  });
};
