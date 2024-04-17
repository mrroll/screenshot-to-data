import { getKey } from '@/lib/redis';
// import { ollamaDocker } from '@/lib/server/ollama-docker';
import { ollamaSSH } from '@/lib/server/ollama-ssh';
import { verrou } from '@/lib/server/verrou';

import { type MutationResolvers } from '@/graphql/codegen/resolvers';
import { HealthMutationArgsSchema } from '@/graphql/schema/Objects/Health/mutations/health/args';

export const HealthMutation: MutationResolvers['Health'] = async (
  parent,
  argsRaw,
  context,
  info,
) => {
  const args = HealthMutationArgsSchema.parse(argsRaw);

  const lock = verrou.createLock(getKey('verrou:/api/chat/route'));

  if (args.Ollama) {
    const response = await ollamaSSH.execCommand(`./deploy.bash`, {
      cwd: '/srv/shared/magic-llm/ollama/containerized',
    });

    if (response.code !== 0) {
      throw new Error(JSON.stringify(response));
    }
  }

  return {
    Ollama: (await lock.isLocked()) ? 'Service Unavailable' : 'OK',
  };
};
