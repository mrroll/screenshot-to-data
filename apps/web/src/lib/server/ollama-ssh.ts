import retry from 'async-retry';
import { NodeSSH } from 'node-ssh';

import { config } from '@/config/server';

declare global {
  // eslint-disable-next-line no-var -- from https://www.prisma.io/docs/guides/database/troubleshooting-orm/help-articles/nextjs-prisma-client-dev-practices#solution
  var __ollama_ssh: InstanceType<typeof NodeSSH> | undefined;
}

export const ollamaSSH = global.__ollama_ssh ?? new NodeSSH();

if (config.NODE_ENV !== 'production') {
  global.__ollama_ssh = ollamaSSH;
}

(() => {
  if (ollamaSSH.isConnected() === true) {
    return;
  }

  void retry(() => {
    return ollamaSSH.connect({
      host: config.OLLAMA_SSH_HOST,
      username: config.ID_RSA_USER,
      privateKey: config.ID_RSA,
      timeout: 10000,
    });
  });
})();
