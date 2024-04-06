import { type ReadableStreamDefaultReader } from 'node:stream/web';

import { z } from 'zod';

import { config } from '@/config';
import { asyncRetry } from '@/lib/async-retry';
import { pino } from '@/lib/pino';
import { getPrompt } from '@/utilities/get-prompt';

const textDecoder = new TextDecoder();

const optionsSchema = z.object({
  filename: z.string(),
  base64: z.string(),
});

export const getDescription = async (
  options: z.infer<typeof optionsSchema>,
) => {
  const args = optionsSchema.parse(options);

  pino.info({
    msg: `Processing image: ${args.filename}`,
  });

  return asyncRetry(async () => {
    const request = await fetch(`${config.API_URL}/api/generate`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${config.API_KEY}`,
      },
      body: JSON.stringify({
        model: config.API_MODEL,
        prompt: getPrompt(),
        images: [args.base64],
      }),
    });

    if (request.body === null) {
      throw new Error('No response body');
    }

    const reader =
      request.body.getReader() as ReadableStreamDefaultReader<Uint8Array>;

    const description: Array<string> = [];

    //  eslint-disable-next-line @typescript-eslint/no-unnecessary-condition, no-constant-condition -- hello
    while (true) {
      const { value } = await reader.read();

      const data = z
        .object({
          response: z.string(),
          done: z.boolean(),
        })
        .parse(JSON.parse(textDecoder.decode(value).trim()));

      if (data.done) {
        break;
      }

      description.push(data.response);

      pino.debug({
        msg: data.response.trim(),
      });
    }

    const response = description.join('').trim();

    pino.info({
      msg: response,
    });

    return response;
  });
};
