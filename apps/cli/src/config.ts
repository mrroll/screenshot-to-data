import { z } from 'zod';

export const config = z
  .object({
    // Local Configuration
    IMAGE_EXTENSIONS: z
      .string()
      .transform((v) => v.split(','))
      .default('jpg,jpeg,png'),
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
    RESIZE_TO_SUPPORTED_RESOLUTION: z.boolean().default(true),

    // Datastore
    DATABASE_URL: z.string(),

    // AWS
    S3_ACCESS_KEY_ID: z.string(),
    S3_SECRET_ACCESS_KEY: z.string(),
    S3_BUCKET: z.string().default('magic-screenshots-to-data'),
    S3_REGION: z.string().default('ap-northeast-1'),

    // Llava API
    API_KEY: z.string(),
    API_URL: z.string().default('https://ollama.magic-start.net'),
    API_MODEL: z
      .enum(['llava', 'llava:13b', 'llava:34b'] as const)
      .default('llava:34b'),

    // Magic Workspace
    WORKSPACE_DATABASE_URL: z.string(),
    WORKSPACE_S3_ACCESS_KEY_ID: z.string(),
    WORKSPACE_S3_SECRET_ACCESS_KEY: z.string(),
    WORKSPACE_S3_BUCKET: z.string().default('magic-workspace-screenshots'),
    WORKSPACE_S3_REGION: z.string().default('ap-northeast-1'),
  })
  .parse(process.env);
