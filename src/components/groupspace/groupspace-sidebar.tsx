import { currentProfile } from '@/database/current-profile';
import { db } from '@/lib/prisma';
import { MemberRole, ZoneType } from '@prisma/client';
import { redirect } from 'next/navigation';
import { GroupSpaceHeader } from './groupspace-header';
import { Hash, Mic, ShieldAlert, ShieldCheck, Video } from 'lucide-react';
import { GroupspaceSearch } from './groupspace-search';
import { ScrollArea } from '../ui/scroll-area';

const iconMap = {
  [ZoneType.TEXT]: <Hash className="mr-2 h-4 w-4" />,
  [ZoneType.AUDIO]: <Mic className="mr-2 h-4 w-4" />,
  [ZoneType.VIDEO]: <Video className="mr-2 h-4 w-4" />,
};

const roleIconMap = {
  [MemberRole.GUEST]: null,
  [MemberRole.MODERATOR]: (
    <ShieldCheck className="h-4 w-4 mr-2 text-indigo-500" />
  ),
  [MemberRole.ADMIN]: <ShieldAlert className="h-4 w-4 mr-2 text-rose-500" />,
};

type GroupSpaceSidebarProps = {
  groupsapceId: string;
};
export const GroupSpaceSidebar = async ({
  groupsapceId,
}: GroupSpaceSidebarProps) => {
  const profile = await currentProfile();
  if (!profile) return redirect('/');

  const groupSpace = await db.groupSpace.findUnique({
    where: {
      id: groupsapceId,
    },
    include: {
      zones: {
        orderBy: {
          createdAt: 'asc',
        },
      },
      members: {
        include: {
          profile: true,
        },
        orderBy: {
          role: 'asc',
        },
      },
    },
  });
  if (!groupSpace) return redirect('/');
  const textZones = groupSpace?.zones.filter(
    (zone) => zone.type === ZoneType.TEXT
  );
  const audioZones = groupSpace?.zones.filter(
    (zone) => zone.type === ZoneType.AUDIO
  );
  const videoZones = groupSpace?.zones.filter(
    (zone) => zone.type === ZoneType.VIDEO
  );
  const members = groupSpace?.members.filter(
    (member) => member.profileId !== profile.id
  );

  const role = groupSpace.members.find(
    (member) => member.profileId === profile.id
  )?.role;

  return (
    <div className=" flex flex-col h-full text-foreground w-full dark:bg-[#2B2D31] bg-[#F2F3F5]">
      <GroupSpaceHeader groupspace={groupSpace} role={role} />
      <ScrollArea className="flex-1 px-3">
        <div className="mt-2">
          <GroupspaceSearch
            data={[
              {
                label: 'Text Zones',
                type: 'zone',
                data: textZones?.map((zone) => ({
                  id: zone.id,
                  name: zone.name,
                  icon: iconMap[zone.type],
                })),
              },
              {
                label: 'Voice Zones',
                type: 'zone',
                data: audioZones?.map((zone) => ({
                  id: zone.id,
                  name: zone.name,
                  icon: iconMap[zone.type],
                })),
              },
              {
                label: 'Video Zones',
                type: 'zone',
                data: videoZones?.map((zone) => ({
                  id: zone.id,
                  name: zone.name,
                  icon: iconMap[zone.type],
                })),
              },
              {
                label: 'Members',
                type: 'member',
                data: members?.map((member) => ({
                  id: member.id,
                  name: member.profile.name,
                  icon: roleIconMap[member.role],
                })),
              },
            ]}
          />
        </div>
      </ScrollArea>
    </div>
  );
};
