'use server';
import { currentProfile } from '@/database/current-profile';
import { ProfileSchema } from '@/schemas';
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { v4 as uuidv4 } from 'uuid';
import { db } from '@/lib/prisma';
import { MemberRole } from '@prisma/client';
export const createGroupSpace = async ({
  name,
  imageUrl,
}: z.infer<typeof ProfileSchema>) => {
  try {
    const profile = await currentProfile();
    if (!profile) {
      return new NextResponse('Unauthorized', { status: 401 });
    }
    const groupspace = await db.groupSpace.create({
      data: {
        ownerId: profile.id,
        name,
        imageUrl,
        inviteCode: uuidv4(),
        zones: {
          create: [
            {
              name: 'home',
              creatorId: profile.id,
            },
          ],
        },
        members: {
          create: [
            {
              profileId: profile.id,
              role: MemberRole.ADMIN,
            },
          ],
        },
      },
    });
    return groupspace;
  } catch (error) {
    console.log('[SERVERS_POST]', error);
  }
};
