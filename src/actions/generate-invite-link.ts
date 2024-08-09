'use server';
import { v4 as uuidv4 } from 'uuid';
import { currentProfile } from '@/database/current-profile';
import { db } from '@/lib/prisma';

export default async function generateInviteLink(groupspaceId: string) {
  try {
    const profile = await currentProfile();
    if (!profile) return null;

    const groupspace = await db.groupSpace.update({
      where: {
        id: groupspaceId,
        ownerId: profile.id,
      },
      data: {
        inviteCode: uuidv4(),
      },
    });
    return groupspace;
  } catch (error) {
    console.log('[GROUPSPACE_ID]', error);
    return null;
  }
}
