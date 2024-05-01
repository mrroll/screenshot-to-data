import sharp from 'sharp';
import { z } from 'zod';

import { SUPPORTED_RESOLUTIONS } from '@/constants/server/LLAVA';

const optionsSchema = z.object({
  image: z.instanceof(Buffer),
});

export const cropImageToLlavaSupportedResolution = async (
  options: z.infer<typeof optionsSchema>,
) => {
  const args = optionsSchema.parse(options);

  const originalSharpImage = sharp(args.image);

  const originalSharpImageMetadata = await originalSharpImage.metadata();

  const originalSharpImageMetadataWidth = originalSharpImageMetadata.width;

  const originalSharpImageMetadataHeight = originalSharpImageMetadata.height;

  if (
    typeof originalSharpImageMetadataWidth !== 'number' ||
    typeof originalSharpImageMetadataHeight !== 'number'
  ) {
    throw new Error('Could not read originalSharpImageMetadata');
  }

  const orientation =
    originalSharpImageMetadataWidth > originalSharpImageMetadataHeight
      ? 'landscape'
      : 'portrait';

  const longSideSize =
    orientation === 'landscape'
      ? originalSharpImageMetadataWidth
      : originalSharpImageMetadataHeight;

  const longSideSizeAccessor = orientation === 'landscape' ? 'width' : 'height';

  const longSideAllowedSize = SUPPORTED_RESOLUTIONS
    // Make TS happy
    .map((item) => ({
      ...item,
      difference: 0,
    }))
    .reduce(
      (accumulator, currentValue) => {
        const difference = Math.abs(
          currentValue[longSideSizeAccessor] - longSideSize,
        );

        if (difference < accumulator.difference) {
          return {
            [longSideSizeAccessor]: currentValue[longSideSizeAccessor],
            difference,
          };
        }

        return accumulator;
      },
      {
        [longSideSizeAccessor]: Number.MAX_SAFE_INTEGER,
        difference: Number.MAX_SAFE_INTEGER,
      },
    )[longSideSizeAccessor];

  if (typeof longSideAllowedSize !== 'number') {
    throw new Error('Could not find longSideAllowedSize');
  }

  const shortSideSizeAccessor =
    orientation === 'landscape' ? 'height' : 'width';

  const shortSideAllowedSize = SUPPORTED_RESOLUTIONS.find(
    (SUPPORTED_RESOLUTIONS) => {
      return (
        SUPPORTED_RESOLUTIONS[longSideSizeAccessor] === longSideAllowedSize
      );
    },
  )?.[shortSideSizeAccessor];

  if (typeof shortSideAllowedSize !== 'number') {
    throw new Error('Could not find shortSizeAllowedSize');
  }

  const cropOptions: Parameters<(typeof originalSharpImage)['extract']>[0] = {
    top: 0,
    left: 0,
    width: 0,
    height: 0,
  };

  const originalSharpImageMetadataLongSideSizeAccessor =
    originalSharpImageMetadata[longSideSizeAccessor];
  const originalSharpImageMetadataShortSideSizeAccessor =
    originalSharpImageMetadata[shortSideSizeAccessor];

  if (
    typeof originalSharpImageMetadataLongSideSizeAccessor !== 'number' ||
    typeof originalSharpImageMetadataShortSideSizeAccessor !== 'number'
  ) {
    throw new Error('Could not read originalSharpImageMetadata');
  }

  cropOptions[longSideSizeAccessor] =
    longSideAllowedSize > originalSharpImageMetadataLongSideSizeAccessor
      ? originalSharpImageMetadataLongSideSizeAccessor
      : longSideAllowedSize;

  cropOptions[shortSideSizeAccessor] =
    shortSideAllowedSize > originalSharpImageMetadataShortSideSizeAccessor
      ? originalSharpImageMetadataShortSideSizeAccessor
      : shortSideAllowedSize;

  const cropped = originalSharpImage.extract(cropOptions);

  return cropped.toBuffer();
};
