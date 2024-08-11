'use server';
import { z } from 'zod';
import { ProfileSchema } from './../schemas/index';
import { currentProfile } from '@/database/current-profile';
import { auth } from '@clerk/nextjs/server';
import { db } from '@/lib/prisma';

export const editGroupSpace = async (
  groupspaceId: string | undefined,
  { name, imageUrl }: z.infer<typeof ProfileSchema>
) => {
  if (!groupspaceId) return null;
  const profile = await currentProfile();
  if (!profile) return auth().redirectToSignIn();

  const groupspace = await db.groupSpace.update({
    where: { id: groupspaceId, ownerId: profile.id },
    data: { name, imageUrl },
  });
  return groupspace;
};
