import { z } from 'zod';

export const HealthMutationArgsSchema = z.object({
  Ollama: z.boolean(),
});
