import { GetObjectCommand } from '@screenshot-to-data/common/dist/s3';
import { type DateTime } from 'luxon';
import { z } from 'zod';

import { config } from '@/config';
import { pino } from '@/lib/pino';
import { prisma } from '@/lib/prisma';
import { workspacePrisma } from '@/lib/workspace-prisma';
import { workspaceS3 } from '@/lib/workspace-s3';
import { getDescription } from '@/utilities/get-description';
import { resizeImageToSupportedResolution } from '@/utilities/resize-image-to-supported-resolution';

const optionsSchema = z.object({
  take: z.number(),
  'cursor-id': z.string().uuid().optional(),
});

export const describeDatabaseFiles = async (
  options: z.infer<typeof optionsSchema> & {
    'cursor-created-at'?: DateTime<true>;
  },
) => {
  const args = optionsSchema.parse(options);

  pino.info({ msg: `Fetching ${args.take} screenshots from the database...` });

  // Fix this when there isn't a ton of load on the database.
  const hasCursor =
    typeof args['cursor-id'] === 'string' &&
    typeof options['cursor-created-at'] !== 'undefined';

  const events =
    // [
    //   {
    //     payload: {
    //       imageURL:
    //         'https://magic-workspace-screenshots.s3.ap-northeast-1.amazonaws.com/f32856fd-a374-46bb-b5ea-a201919d9397/2024-03-19T09%3A31%3A07.414Z-112a83ddd2b.jpeg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIA3YOELHRLMLSXUGNU%2F20240319%2Fap-northeast-1%2Fs3%2Faws4_request&X-Amz-Date=20240319T093112Z&X-Amz-Expires=604800&X-Amz-Signature=83cbbe92869d46d302e43582f826d5b903fe5d0e3c6bd66e019f61f1de503f4d&X-Amz-SignedHeaders=host&x-id=GetObject',
    //       filename: '2024-03-19T09:31:07.414Z-112a83ddd2b.jpeg',
    //     },
    //   },
    // ] ??
    await workspacePrisma.events.findMany({
      select: {
        payload: true,
      },
      where: {
        action_type: 'screenCapture',
      },
      // Fix this when there isn't a ton of load on the database.
      orderBy: {
        created_at: 'desc',
      },
      take: args.take,
      // Fix this when there isn't a ton of load on the database.
      // skip: hasCursor ? 1 : undefined,
      // ...(hasCursor && {
      //   cursor: {
      //     // This is required because we don't have sequential ids.
      //     // This can't actually be undefined but Typescript is complaining
      //     created_at: options['cursor-created-at']?.toJSDate(),
      //     id: args['cursor-id'],
      //   },
      // }),
    });

  const inserts = [];

  for (const event of events) {
    const { payload: payloadRaw } = event;

    const payload = z
      .object({
        imageURL: z.string(),
        filename: z.string(),
        url: z.string().url().optional(),
        title: z.string().optional(),
      })
      .parse(payloadRaw);

    pino.info(payload);

    // 'https://magic-workspace-screenshots.s3.ap-northeast-1.amazonaws.com/56d64da3-516d-4651-aea0-d9ce9f4fe6f6/2024-03-19T07%3A25%3A13.377Z-c3340625ae.jpeg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIA3YOELHRLMLSXUGNU%2F20240319%2Fap-northeast-1%2Fs3%2Faws4_request&X-Amz-Date=20240319T072518Z&X-Amz-Expires=604800&X-Amz-Signature=45456f253f0bcd3a87a3dc96114142ed45acfe2be0511477383b887ba12772ef&X-Amz-SignedHeaders=host&x-id=GetObject',
    const url = new URL(payload.imageURL);

    const response = await workspaceS3.send(
      new GetObjectCommand({
        Bucket: config.WORKSPACE_S3_BUCKET,
        Key: decodeURIComponent(url.pathname.replace(/^\//, '')),
      }),
    );

    if (typeof response.Body === 'undefined') {
      throw new Error('No response body');
    }

    pino.info({
      msg: `Downloading screenshot from s3.`,
      url: payload.imageURL,
    });

    const buffer = Buffer.from(
      config.RESIZE_TO_SUPPORTED_RESOLUTION
        ? await resizeImageToSupportedResolution({
            image: Buffer.from(await response.Body.transformToByteArray()),
          })
        : await response.Body.transformToString(),
    );

    const base64 = buffer.toString('base64');

    const description = await getDescription({
      filename: payload.filename,
      base64,
    });

    inserts.push(
      prisma.workspace_screenshot.upsert({
        where: {
          S3URL: payload.imageURL,
        },
        create: {
          S3URL: payload.imageURL,
          Description: description,
        },
        update: {
          UpdatedAt: new Date(),
        },
      }),
    );
  }

  await Promise.all(inserts);
};
