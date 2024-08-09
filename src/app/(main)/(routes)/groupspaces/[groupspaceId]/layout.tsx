import { GroupSpaceSidebar } from '@/components/groupspace/groupspace-sidebar';
import { currentProfile } from '@/database/current-profile';
import { db } from '@/lib/prisma';
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

import React from 'react';

const GroupspaceIdLayout = async ({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { groupspaceId: string };
}) => {
  const profile = await currentProfile();

  if (!profile) return auth().redirectToSignIn();
  const groupSpace = await db.groupSpace.findUnique({
    where: {
      id: params.groupspaceId,
      members: {
        some: {
          profileId: profile.id,
        },
      },
    },
  });
  if (!groupSpace) return redirect('/');
  return (
    <div className=" h-full">
      <div className="flex h-full w-60 z-20 flex-col fixed  inset-y-0 ">
        <GroupSpaceSidebar groupsapceId={params.groupspaceId} />
      </div>
      <main className=" h-full md:pl-60">{children}</main>
    </div>
  );
};

export default GroupspaceIdLayout;
