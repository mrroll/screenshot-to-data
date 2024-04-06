import { z } from 'zod';

import { shared } from '@/config/shared';

export const config = z
  .object({
    // Local Configuration
    PORT: z.coerce.number().default(3000),
    NODE_ENV: z
      .union([
        z.literal('development'),
        z.literal('production'),
        z.literal('test'),
        z.undefined(),
      ])
      .default('development'),
    PINO_LEVEL: z
      .union([
        z.literal('fatal'),
        z.literal('error'),
        z.literal('warn'),
        z.literal('info'),
        z.literal('debug'),
        z.literal('trace'),
        z.literal('silent'),
      ])
      .default('error'),

    // Datastore
    DATABASE_URL: z.string(),
    REDIS_HOST: z.string(),
    REDIS_PORT: z.coerce.number(),
    REDIS_PASSWORD: z.string(),
    REDIS_KEY_PREFIX: z.string().optional().default('development:'),

    // Supabase
    SUPABASE_JWT_SECRET: z.string(),

    // AWS
    S3_ACCESS_KEY_ID: z.string(),
    S3_SECRET_ACCESS_KEY: z.string(),
    S3_BUCKET: z.string().default('magic-screenshots-to-data'),
    S3_REGION: z.string().default('ap-northeast-1'),

    // Ollama
    OLLAMA_API_URL: z
      .string()
      .optional()
      .default('https://ollama.magic-start.net'),
    OLLAMA_API_KEY: z.string(),
    OLLAMA_API_MODEL: z
      .union([
        z.literal('llava'),
        z.literal('llava:13b'),
        z.literal('llava:34b'),
      ])
      .optional()
      .default('llava:34b'),

    // Vercel
    VERCEL_ENV: z
      .union([
        z.literal('development'),
        z.literal('preview'),
        z.literal('production'),
      ])
      .optional(),
    VERCEL_URL: z.string().optional(),
  })
  .merge(shared)
  .parse(process.env);
