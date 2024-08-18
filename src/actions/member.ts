'use server';
import { currentProfile } from '@/database/current-profile';
import { auth } from '@clerk/nextjs/server';
import { db } from '@/lib/prisma';
import { MemberRole } from '@prisma/client';

export const editMemberRole = async (
  memberId: string | undefined,
  groupspaceId: string | undefined,
  role: MemberRole
) => {
  if (!groupspaceId || !memberId || !role) return null;

  const profile = await currentProfile();
  if (!profile) return auth().redirectToSignIn();

  const groupspace = await db.groupSpace.update({
    where: { id: groupspaceId, ownerId: profile.id },
    data: {
      members: {
        update: {
          where: {
            id: memberId,
            profileId: {
              not: profile.id,
            },
          },
          data: { role },
        },
      },
    },
    include: {
      members: {
        include: {
          profile: true,
        },
        orderBy: {
          role: 'asc',
        },
      },
    },
  });
  if (!groupspace) return null;
  return groupspace;
};

export const kickMember = async (
  memberId: string | undefined,
  groupspaceId: string | undefined
) => {
  if (!groupspaceId || !memberId) return null;

  const profile = await currentProfile();
  if (!profile) return auth().redirectToSignIn();

  const groupspace = await db.groupSpace.update({
    where: {
      id: groupspaceId,
      ownerId: profile.id,
    },
    data: {
      members: {
        deleteMany: {
          id: memberId,
          profileId: {
            not: profile.id,
          },
        },
      },
    },
    include: {
      members: {
        include: {
          profile: true,
        },
        orderBy: {
          role: 'asc',
        },
      },
    },
  });
  if (!groupspace) return null;
  return groupspace;
};
