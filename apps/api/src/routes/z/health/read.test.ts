import { describe, expect, test } from 'vitest';

import { config } from '@/config';
import { buildFastify } from '@/helpers/test/build-fastify';

const url = `${config.FASTIFY_PREFIX}/z/health`;

describe(url, () => {
  test(`GET ${url} should return a 200 status code with the appropriate response string.`, async () => {
    const fastify = await buildFastify();

    const response = await fastify.inject({
      url,
    });

    expect(response.statusCode).toBe(200);

    expect(response.body).toMatch(/api \| Request ID: .+/g);
  });
});
