import React from 'react';

import { redirect } from 'next/navigation';
import { currentProfile } from '@/database/current-profile';
import { auth } from '@clerk/nextjs/server';
import { db } from '@/lib/prisma';
import { ChatHeader } from '@/components/chat/chat-header';

interface ZoneIdPageProps {
  params: {
    groupspaceId: string;
    zoneId: string;
  };
}

export default async function ZoneIdPage({
  params: { zoneId, groupspaceId },
}: ZoneIdPageProps) {
  const profile = await currentProfile();

  if (!profile) return auth().redirectToSignIn();

  const zone = await db.zone.findUnique({
    where: { id: zoneId },
  });

  const member = await db.member.findFirst({
    where: { groupSpaceId: groupspaceId, profileId: profile.id },
  });

  if (!zone || !member) return redirect('/');

  return (
    <div className="bg-white dark:bg-[#313338] flex flex-col h-full">
      <ChatHeader
        name={zone.name}
        groupspaceId={zone.groupspaceId}
        type="zone"
      />
      {/* {zone.type === ZoneType.TEXT && (
        <>
          <ChatMessages
            member={member}
            name={zone.name}
            chatId={zone.id}
            type="zone"
            apiUrl="/api/messages"
            socketUrl="/api/socket/messages"
            socketQuery={{
              zoneId: zone.id,
              groupspaceId: zone.groupspaceId,
            }}
            paramKey="zoneId"
            paramValue={zone.id}
          />
          <ChatInput
            name={zone.name}
            type="zone"
            apiUrl="/api/socket/messages"
            query={{
              zoneId: zone.id,
              groupspaceId: zone.groupspaceId,
            }}
          />
        </>
      )}
      {zone.type === ZoneType.AUDIO && (
        <MediaRoom chatId={zone.id} video={false} audio={true} />
      )}
      {zone.type === ZoneType.VIDEO && (
        <MediaRoom chatId={zone.id} video={true} audio={true} />
      )} */}
    </div>
  );
}
