import { HealthTypes } from '@/graphql/schema/Objects/Health/types';
import { LockTypes } from '@/graphql/schema/Objects/Lock/types';
import { S3SignedURLTypes } from '@/graphql/schema/Objects/S3SignedURL/types';
import { ScreenshotTypes } from '@/graphql/schema/Objects/Screenshot/types';
import { UserTypes } from '@/graphql/schema/Objects/User/types';
import { DateTimeISOTypes } from '@/graphql/schema/Scalars/DateTimeISO/types';
import { JSONTypes } from '@/graphql/schema/Scalars/JSON/types';
import { SafeIntTypes } from '@/graphql/schema/Scalars/SafeInt/types';
import { VoidTypes } from '@/graphql/schema/Scalars/Void/types';

export const typeDefs = [
  // Scalars
  DateTimeISOTypes,
  JSONTypes,
  SafeIntTypes,
  VoidTypes,

  // Objects
  HealthTypes,
  LockTypes,
  S3SignedURLTypes,
  ScreenshotTypes,
  UserTypes,
];
