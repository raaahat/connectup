import { NextApiRequest } from 'next';

import { NextApiResponseServerIo } from '@/types';
import { currentProfilePages } from '@/lib/current-profile-pages';
import { db } from '@/lib/prisma';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponseServerIo
) {
  if (req.method !== 'POST')
    return res.status(405).json({ error: 'Method not allowed' });

  try {
    const profile = await currentProfilePages(req);
    const { content, fileUrl } = req.body;
    const { groupspaceId, zoneId } = req.query;

    if (!profile) return res.status(401).json({ error: 'Unauthorized' });

    if (!groupspaceId)
      return res.status(400).json({ error: 'Groupspace ID Missing' });

    if (!zoneId) return res.status(400).json({ error: 'Zone ID Missing' });

    if (!content) return res.status(400).json({ error: 'Content Missing' });

    const groupspace = await db.groupSpace.findFirst({
      where: {
        id: groupspaceId as string,
        members: {
          some: {
            profileId: profile.id,
          },
        },
      },
      include: {
        members: true,
      },
    });

    if (!groupspace)
      return res.status(404).json({ message: 'Groupspace not found' });

    const zone = await db.zone.findFirst({
      where: {
        id: zoneId as string,
        groupspaceId: groupspaceId as string,
      },
    });

    if (!zone) return res.status(404).json({ message: 'Zone not found' });

    const member = groupspace.members.find(
      (member) => member.profileId === profile.id
    );

    if (!member) return res.status(404).json({ message: 'Member not found' });

    const message = await db.message.create({
      data: {
        content,
        fileUrl,
        zoneId: zoneId as string,
        memberId: member.id,
      },
      include: {
        member: {
          include: {
            profile: true,
          },
        },
      },
    });

    const zoneKey = `chat:${zoneId}:messages`;

    res?.socket?.server?.io?.emit(zoneKey, message);

    return res.status(200).json(message);
  } catch (error) {
    console.error('[MESSAGES_POST]', error);
    return res.status(500).json({ error: 'Internal Groupspace Error' });
  }
}
