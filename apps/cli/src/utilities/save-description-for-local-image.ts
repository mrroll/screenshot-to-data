import crypto from 'node:crypto';

import {
  GetObjectCommand,
  PutObjectCommand,
} from '@screenshot-to-data/common/dist/s3';
import sharp from 'sharp';
import { z } from 'zod';
import { fs, path } from 'zx';

import { config } from '@/config';
import { pino } from '@/lib/pino';
import { prisma } from '@/lib/prisma';
import { s3 } from '@/lib/s3';
import { getDescription } from '@/utilities/get-description';
import { resizeImageToSupportedResolution } from '@/utilities/resize-image-to-supported-resolution';

const optionsSchema = z.object({
  filename: z.string(),
});

export const saveDescriptionForLocalImage = async (
  options: z.infer<typeof optionsSchema>,
) => {
  const args = optionsSchema.parse(options);

  pino.info({
    msg: `Processing local file.`,
    file: args.filename,
  });

  const buffer = config.RESIZE_TO_SUPPORTED_RESOLUTION
    ? await resizeImageToSupportedResolution({ image: args.filename })
    : await fs.readFile(args.filename);

  const resizedSharpImage = sharp(buffer);

  const resizedSharpImageMetadata = await resizedSharpImage.metadata();

  const resizedSharpImageMetadataWidth = resizedSharpImageMetadata.width;

  const resizedSharpImageMetadataHeight = resizedSharpImageMetadata.height;

  if (
    typeof resizedSharpImageMetadataWidth !== 'number' ||
    typeof resizedSharpImageMetadataHeight !== 'number'
  ) {
    throw new Error('Could not read resizedSharpImageMetadata');
  }

  const hash = crypto.createHash('sha256');

  hash.update(buffer.toString('utf-8'));

  const sha256 = hash.digest('hex');

  const extension = path.extname(args.filename);

  const filename = `${sha256}${extension}`;

  const base64 = buffer.toString('base64');

  const [exists, description] = await Promise.all([
    (async function () {
      try {
        await s3.send(
          new GetObjectCommand({
            Bucket: config.S3_BUCKET,
            Key: decodeURIComponent(filename),
          }),
        );

        return true;
      } catch (error) {
        const parsed = z
          .object({
            Code: z.literal('NoSuchKey'),
          })
          .safeParse(error);

        if (parsed.success) {
          return false;
        }

        throw error;
      }
    })(),
    // `Lorem ipsum dolor, sit amet consectetur adipisicing elit. Dolor laborum amet saepe sed in fugiat et adipisci, vel consectetur inventore corrupti tempore hic sint repudiandae nesciunt natus labore quam veniam eveniet, voluptatibus aut eum eligendi rerum doloribus. Dolore, similique doloribus natus totam quasi optio officia. Hic incidunt labore amet suscipit commodi odio vero perspiciatis ad nulla. Soluta illum exercitationem quaerat ad impedit dolores illo iusto, nostrum tenetur obcaecati similique quisquam beatae iste libero, amet tempore ut incidunt, praesentium eaque. Unde eius maxime fugiat eveniet perferendis illo numquam maiores, nulla ratione distinctio nihil veritatis repellat aspernatur ad quisquam quis eaque quasi.` ??
    await getDescription({ filename: args.filename, base64 }),
  ]);

  if (exists !== true) {
    await s3.send(
      new PutObjectCommand({
        Bucket: config.S3_BUCKET,
        Key: filename,
        Body: buffer,
      }),
    );
  } else {
    pino.info({
      msg: 'File already exists in S3. Skipping upload.',
      file: filename,
    });
  }

  await prisma.screenshot.upsert({
    where: {
      S3Filename: filename,
    },
    create: {
      S3Filename: filename,
      OriginalFilename: path.basename(args.filename),
      Uploader: '941a7558-2b54-47f1-af3b-d5c1838d99d5',
      Description: description,
      Width: resizedSharpImageMetadataWidth,
      Height: resizedSharpImageMetadataHeight,
    },
    update: {
      Description: description,
      OriginalFilename: path.basename(args.filename),
      Uploader: '941a7558-2b54-47f1-af3b-d5c1838d99d5',
      Width: resizedSharpImageMetadataWidth,
      Height: resizedSharpImageMetadataHeight,
      UpdatedAt: new Date(),
    },
  });
};
