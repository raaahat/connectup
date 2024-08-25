'use server';
import { CreateZoneSchema } from '@/schemas';
import { currentProfile } from '@/database/current-profile';
import { db } from '@/lib/prisma';
import { auth } from '@clerk/nextjs/server';
import { z } from 'zod';
import { MemberRole } from '@prisma/client';

export const createZone = async (
  groupspaceId: string | undefined,
  { name, type }: z.infer<typeof CreateZoneSchema>
) => {
  if (!groupspaceId) return null;

  const profile = await currentProfile();
  if (!profile) return auth().redirectToSignIn();

  if (name === 'home') return null;
  const groupspace = await db.groupSpace.update({
    where: {
      id: groupspaceId,
      members: {
        some: {
          profileId: profile.id,
          role: {
            in: [MemberRole.ADMIN, MemberRole.MODERATOR],
          },
        },
      },
    },
    data: {
      zones: {
        create: {
          creatorId: profile.id,
          name,
          type,
        },
      },
    },
  });
  if (!groupspace) return null;
  return groupspace;
};
export const editZone = async (
  groupspaceId: string | undefined,
  zoneId: string | undefined,
  { name, type }: z.infer<typeof CreateZoneSchema>
) => {
  if (!groupspaceId || !zoneId) return null;

  const profile = await currentProfile();
  if (!profile) return auth().redirectToSignIn();

  if (name === 'home') return null;
  const groupspace = await db.groupSpace.update({
    where: {
      id: groupspaceId,
      members: {
        some: {
          profileId: profile.id,
          role: {
            in: [MemberRole.ADMIN, MemberRole.MODERATOR],
          },
        },
      },
    },
    data: {
      zones: {
        update: {
          where: {
            id: zoneId,
            NOT: {
              name: 'home',
            },
          },
          data: {
            name,
            type,
          },
        },
      },
    },
  });
  if (!groupspace) return null;
  return groupspace;
};
