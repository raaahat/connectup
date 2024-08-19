import { ZoneType } from '@prisma/client';
import * as z from 'zod';

export const ProfileSchema = z.object({
  name: z.string().min(1, { message: 'Server name is required.' }),
  imageUrl: z.string().min(1, { message: 'Server image is required.' }),
});

export const CreateZoneSchema = z.object({
  name: z
    .string()
    .min(1, { message: 'Zone name is required.' })
    .refine((name) => name !== 'home', {
      message: "Zone name cannot be 'home'",
    }),
  type: z.nativeEnum(ZoneType),
});
