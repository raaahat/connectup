import { redirect } from 'next/navigation';

import { auth } from '@clerk/nextjs/server';
import { currentProfile } from '@/database/current-profile';
import { db } from '@/lib/prisma';

interface GroupspaceIdPageProps {
  params: {
    groupspaceId: string;
  };
}

export default async function GroupspaceIdPage({
  params,
}: GroupspaceIdPageProps) {
  const profile = await currentProfile();

  if (!profile) return auth().redirectToSignIn();

  const groupspace = await db.groupSpace.findUnique({
    where: {
      id: params.groupspaceId,
      members: {
        some: {
          profileId: profile.id,
        },
      },
    },
    include: {
      zones: {
        where: {
          name: 'home',
        },
        orderBy: { createdAt: 'asc' },
      },
    },
  });

  const initialChannel = groupspace?.zones[0];

  if (initialChannel?.name !== 'home') return null;

  return redirect(
    `/groupspaces/${params.groupspaceId}/zones/${initialChannel?.id}`
  );
}
