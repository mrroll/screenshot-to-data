import sharp from 'sharp';
import { z } from 'zod';

import { SUPPORTED_RESOLUTIONS } from '@/constants/server/LLAVA';

const optionsSchema = z.object({
  image: z.instanceof(Buffer),
});

export const resizeImageToLlavaSupportedResolution = async (
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

  const longSideAllowedSize = SUPPORTED_RESOLUTIONS.reduce(
    (accumulator, currentValue) => {
      const currentClosestLargeDimension = accumulator[longSideSizeAccessor];

      if (typeof currentClosestLargeDimension !== 'number') {
        return accumulator;
      }

      if (
        Math.abs(currentValue[longSideSizeAccessor] - longSideSize) <
        currentClosestLargeDimension
      ) {
        return currentValue;
      }

      return accumulator;
    },
    { [longSideSizeAccessor]: Number.MAX_SAFE_INTEGER },
  )[longSideSizeAccessor];

  if (typeof longSideAllowedSize !== 'number') {
    throw new Error('Could not find longSideAllowedSize');
  }

  const longSideResizeScale = longSideAllowedSize / longSideSize;

  const longSideResizeWidth =
    longSideResizeScale > 1
      ? originalSharpImageMetadataWidth
      : Math.round(originalSharpImageMetadataWidth * longSideResizeScale);

  const longSideResizeHeight =
    longSideResizeScale > 1
      ? originalSharpImageMetadataHeight
      : Math.round(originalSharpImageMetadataHeight * longSideResizeScale);

  const shortSideSize =
    orientation === 'landscape' ? longSideResizeHeight : longSideResizeWidth;

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

  const shortSideResizeScale = shortSideAllowedSize / shortSideSize;

  const shortSideResizeWidth =
    shortSideResizeScale > 1
      ? longSideResizeWidth
      : Math.round(longSideResizeWidth * shortSideResizeScale);

  const shortSideResizeHeight =
    shortSideResizeScale > 1
      ? longSideResizeHeight
      : Math.round(longSideResizeHeight * shortSideResizeScale);

  const resized = originalSharpImage.resize(
    shortSideResizeWidth,
    shortSideResizeHeight,
  );

  return resized.toBuffer();
};
