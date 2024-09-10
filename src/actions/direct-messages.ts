'use server';
import { currentProfile } from '@/database/current-profile';
import { auth } from '@clerk/nextjs/server';
import { db } from '@/lib/prisma';

const MESSAGES_BATCH = 10;
//cursor
type MessagesParams = {
  cursor?: string;
  zoneId?: string;
  conversationId?: string;
};
export const getDirectMessages = async ({
  cursor,
  conversationId,
}: MessagesParams) => {
  if (!conversationId) return undefined;

  const profile = await currentProfile();
  if (!profile) return auth().redirectToSignIn();
  let res;
  if (cursor) {
    res = await db.directMessage.findMany({
      take: MESSAGES_BATCH,
      skip: 1,
      cursor: {
        id: cursor,
      },
      where: {
        conversationId,
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
    res = await db.directMessage.findMany({
      take: MESSAGES_BATCH,
      where: { conversationId },
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
