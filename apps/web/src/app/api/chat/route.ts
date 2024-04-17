import crypto from 'node:crypto';
import path from 'node:path';

import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import {
  GetObjectCommand,
  HeadObjectCommand,
  PutObjectCommand,
} from '@screenshot-to-data/common/dist/s3';
import {
  AIStream,
  StreamData,
  StreamingTextResponse,
  type AIStreamCallbacksAndOptions,
} from 'ai';
import { Duration } from 'luxon';
import { omit } from 'remeda';
import sharp from 'sharp';
import { match, P } from 'ts-pattern';
import { z } from 'zod';

import { prisma } from '@/lib/server/prisma';
import { s3 } from '@/lib/server/s3';
import { verrou } from '@/lib/server/verrou';

import { config } from '@/config/server';
import { getUserFromCookie } from '@/utilities/server/get-user-from-cookie';
import { resizeImageToLlavaSupportedResolution } from '@/utilities/server/resize-image-to-llava-supported-resolution';

const StreamDataEnabled = true as boolean;
// https://github.com/vercel/ai/blob/9610993fe4df5a2ae8e9ce4650b6f9f0f9291e58/packages/core/shared/stream-parts.ts#L17
const TEXT_STREAM_PART_CODE = '0';

const parseLlavaStream = (raw: string) => {
  const data = z
    .object({
      response: z.string(),
      done: z.boolean(),
    })
    .parse(JSON.parse(raw));

  if (StreamDataEnabled) {
    // https://github.com/vercel/ai/blob/9610993fe4df5a2ae8e9ce4650b6f9f0f9291e58/packages/core/shared/stream-parts.ts#L373
    return `${TEXT_STREAM_PART_CODE}:${JSON.stringify(data.response)}\n`;
  }

  return data.response;
};

const LlavaStream = (
  res: Response,
  cb?: AIStreamCallbacksAndOptions,
): ReadableStream => {
  return AIStream(res, parseLlavaStream, cb);
};

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const fetchCache = 'only-no-store';
export const POST = async (req: Request) => {
  const cookieStore = cookies();

  const cookie = cookieStore.get(config.NEXT_PUBLIC_SUPABASE_COOKIE_NAME);

  if (typeof cookie === 'undefined') {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  const user = getUserFromCookie(cookie.value);

  if (user === null) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  const body = z
    .object({
      messages: z.array(
        z.object({
          id: z.union([
            z.literal('uploadedFileName'),
            z.literal('originalFilename'),
            z.literal('lock'),
          ]),
          role: z.literal('system'),
          content: z.string(),
        }),
      ),
    })
    .passthrough()
    .parse(await req.json());

  const { messages } = body;

  const lockMessage = messages.find((message) => message.id === 'lock');

  if (typeof lockMessage === 'undefined') {
    return new NextResponse('Bad Request', { status: 400 });
  }

  const lock = verrou.restoreLock(
    z
      .object({
        key: z.string(),
        owner: z.string(),
        ttl: z.number().nullable(),
        expirationTime: z.number().nullable(),
      })
      .parse(JSON.parse(lockMessage.content)),
  );

  if ((await lock.isLocked()) !== true) {
    return new NextResponse('Bad Request', { status: 400 });
  }

  const uploadedFileNameMessage = messages.find(
    (message) => message.id === 'uploadedFileName',
  );

  if (typeof uploadedFileNameMessage === 'undefined') {
    return new NextResponse('Bad Request', { status: 400 });
  }

  const rawFile: ConstructorParameters<typeof GetObjectCommand>[0] = {
    Bucket: config.S3_BUCKET,
    Key: uploadedFileNameMessage.content,
  };

  const response = await s3.send(new GetObjectCommand(rawFile));

  if (typeof response.Body === 'undefined') {
    throw new Error('No response body');
  }

  const [buffer, preferences] = await Promise.all([
    resizeImageToLlavaSupportedResolution({
      image: Buffer.from(await response.Body.transformToByteArray()),
    }),
    prisma.user_preference.findFirst({
      relationLoadStrategy: 'join',
      where: {
        UserID: user.sub,
      },
    }),
  ]);

  const hash = crypto.createHash('sha256');

  hash.update(buffer.toString('utf-8'));

  const sha256 = hash.digest('hex');

  const base64 = buffer.toString('base64');

  const prompt = match({ preferences })
    .with(
      {
        preferences: { Prompt: P.string.minLength(1) },
      },
      ({ preferences: { Prompt } }) => Prompt,
    )
    .otherwise(() => 'What is in this picture?');

  const controller = new AbortController();

  const signal = controller.signal;

  // We allow for one minute for a request to start responding.
  const timeout = setTimeout(
    () => controller.abort(),
    Duration.fromObject({ minutes: 1 }).as('milliseconds'),
  );

  const requestPromise = fetch(`${config.OLLAMA_API_URL}/api/generate`, {
    method: 'POST',
    signal,
    headers: {
      Authorization: `Bearer ${config.OLLAMA_API_KEY}`,
    },
    body: JSON.stringify({
      model: config.OLLAMA_API_MODEL,
      // https://github.com/ollama/ollama/blob/4c7db6b7e917ef475a9d5dccd180cefd298175e4/docs/faq.md#how-do-i-keep-a-model-loaded-in-memory-or-make-it-unload-immediately
      keep_alive: -1,
      stream: true,
      prompt,
      images: [base64],
    }),
  });

  const request = await requestPromise.catch((error) => {
    if (error instanceof Error && error.name === 'AbortError') {
      return new NextResponse('Service Unavailable', { status: 503 });
    }

    throw error;
  });

  if (request.status !== 200) {
    // https://twitter.com/cramforce/status/1762167024900575407
    await request.body?.cancel();
    return new NextResponse('Service Unavailable', { status: 503 });
  }

  clearTimeout(timeout);

  if (request instanceof NextResponse) {
    return request;
  }

  const originalFilenameMessage = messages.find(
    (message) => message.id === 'originalFilename',
  );

  if (typeof originalFilenameMessage === 'undefined') {
    return new NextResponse('Bad Request', { status: 400 });
  }

  const data = new StreamData();

  // eslint-disable-next-line @typescript-eslint/naming-convention -- experimental api
  let experimental_StreamDataDescription = '';

  const llavaStream = LlavaStream(request, {
    experimental_streamData: StreamDataEnabled,
    onToken: (token) => {
      if (StreamDataEnabled !== true) {
        return;
      }

      const sanitzedToken = token.split(`${TEXT_STREAM_PART_CODE}:`)[1];

      if (typeof sanitzedToken !== 'string') {
        throw new Error('sanitzedToken is not a string');
      }

      experimental_StreamDataDescription =
        experimental_StreamDataDescription + JSON.parse(sanitzedToken);
    },
    onFinal: async (completion) => {
      const extension = path.extname(uploadedFileNameMessage.content);

      const Key = `${config.NEXT_PUBLIC_S3_BUCKET_PREFIX}${sha256}${extension}`;

      const input:
        | ConstructorParameters<typeof HeadObjectCommand>[0]
        | ConstructorParameters<typeof PutObjectCommand>[0] = {
        Bucket: config.S3_BUCKET,
        Key,
      };

      const exists = await s3
        .send(new HeadObjectCommand(input))
        .then(() => true)
        .catch(() => false);

      if (exists !== true) {
        await s3.send(
          new PutObjectCommand({
            ...input,
            Body: buffer,
          }),
        );
      }

      const image = sharp(buffer);

      const metadata = await image.metadata();

      const Width = metadata.width;

      const Height = metadata.height;

      if (typeof Width !== 'number' || typeof Height !== 'number') {
        throw new Error('Could not read metadata');
      }

      const Description = StreamDataEnabled
        ? experimental_StreamDataDescription
        : completion;

      const screenshot = await prisma.screenshot.upsert({
        relationLoadStrategy: 'join',
        where: {
          S3Filename: Key,
        },
        create: {
          S3Filename: Key,
          OriginalFilename: originalFilenameMessage.content,
          UserID: user.sub,
          Description,
          Width,
          Height,
        },
        update: {
          OriginalFilename: originalFilenameMessage.content,
          UserID: user.sub,
          Description,
          Width,
          Height,
          UpdatedAt: new Date(),
        },
      });

      data.append(JSON.stringify(omit(screenshot, ['Id'])));

      await lock.release();

      return data.close();
    },
  });

  return new StreamingTextResponse(
    llavaStream,
    {},
    StreamDataEnabled ? data : undefined,
  );
};
