import { buildServer } from '@/build-server';
import { config } from '@/config';

const main = async () => {
  const fastify = await buildServer();

  try {
    await fastify.listen({ host: '0.0.0.0', port: config.FASTIFY_PORT });
  } catch (error) {
    fastify.log.error(error);
    throw error;
  }
};

main().catch((error) => {
  throw error;
});
