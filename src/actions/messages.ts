'use server';
import { currentProfile } from '@/database/current-profile';
import { auth } from '@clerk/nextjs/server';
import { db } from '@/lib/prisma';
import { Message } from '@prisma/client';

const MESSAGES_BATCH = 10;
//cursor
type ParamKey = 'zoneId' | 'conversationId';
type MessagesParams = {
  cursor?: string;
  zoneId?: string;
  conversationId?: string;
};
export const messages = async ({ cursor, zoneId }: MessagesParams) => {
  console.log(`cursor: ${cursor}, zoneId: ${zoneId}`);
  if (!zoneId) return undefined;

  const profile = await currentProfile();
  if (!profile) return auth().redirectToSignIn();
  let res;
  if (cursor) {
    res = await db.message.findMany({
      take: MESSAGES_BATCH,
      skip: 1,
      cursor: {
        id: cursor,
      },
      where: {
        zoneId,
      },
      include: {
        member: {
          include: {
            profile: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  } else {
    res = await db.message.findMany({
      take: MESSAGES_BATCH,
      where: { zoneId },
      include: {
        member: {
          include: {
            profile: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  let nextCursor = null;

  if (res.length === MESSAGES_BATCH) {
    nextCursor = res[MESSAGES_BATCH - 1].id;
  }
  return { items: res, nextCursor };
};
