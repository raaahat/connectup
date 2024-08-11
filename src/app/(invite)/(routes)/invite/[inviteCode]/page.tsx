import React from 'react';

import { redirect } from 'next/navigation';
import { currentProfile } from '@/database/current-profile';
import { auth } from '@clerk/nextjs/server';
import { db } from '@/lib/prisma';

interface InviteCodPageProps {
  params: {
    inviteCode: string;
  };
}

export default async function InviteCodPage({
  params: { inviteCode },
}: InviteCodPageProps) {
  const profile = await currentProfile();

  if (!profile) return auth().redirectToSignIn();

  if (!inviteCode) return redirect('/');

  const existingGroupspace = await db.groupSpace.findFirst({
    where: {
      inviteCode,
      members: {
        some: {
          profileId: profile.id,
        },
      },
    },
  });

  if (existingGroupspace)
    return redirect(`/groupspaces/${existingGroupspace.id}`);

  const groupSpace = await db.groupSpace.update({
    where: {
      inviteCode,
    },
    data: {
      members: {
        create: [{ profileId: profile.id }],
      },
    },
  });

  if (groupSpace) return redirect(`/groupspaces/${groupSpace.id}`);

  return null;
}
