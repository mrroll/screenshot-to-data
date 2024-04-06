import { z } from 'zod';
import { fs, glob, path } from 'zx';

import { config } from '@/config';
import { saveDescriptionForLocalImage } from '@/utilities/save-description-for-local-image';

const optionsSchema = z.object({
  files: z.string(),
});

export const describeLocalFiles = async (
  options: z.infer<typeof optionsSchema>,
) => {
  const args = optionsSchema.parse(options);

  const resolved = path.isAbsolute(args.files)
    ? args.files
    : path.resolve(args.files);

  const stats = await fs.stat(resolved).catch((error) => {
    if (error instanceof Error !== true) {
      throw error;
    }

    const parsed = z
      .object({
        code: z.literal('ENOENT'),
      })
      .safeParse(error);

    if (parsed.success !== true) {
      throw error;
    }

    throw new Error(`Path does not exist: ${resolved}`);
  });

  if (stats.isDirectory() !== true) {
    return saveDescriptionForLocalImage({ filename: resolved });
  }

  const extensions =
    config.IMAGE_EXTENSIONS.length > 1
      ? `**/*.{${config.IMAGE_EXTENSIONS.join(',')}}`
      : `**/*.${config.IMAGE_EXTENSIONS[0]}`;

  const patterns = path.join(resolved, extensions);

  const images = await glob(patterns);

  if (images.length === 0) {
    throw new Error(`No images found in ${patterns}`);
  }

  for (const image of images) {
    await saveDescriptionForLocalImage({ filename: image });
  }
};
