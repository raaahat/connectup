import { currentProfile } from '@/database/current-profile';
import { db } from '@/lib/prisma';
import { ZoneType } from '@prisma/client';
import { redirect } from 'next/navigation';
import { GroupSpaceHeader } from './groupspace-header';

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
    </div>
  );
};
