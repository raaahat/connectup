'use client';

import { Member, MemberRole, Profile, GroupSpace } from '@prisma/client';
import { ShieldAlert, ShieldCheck } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';

import { cn } from '@/lib/utils';
import { UserAvatar } from '@/components/ui/user-avatar';
import { ActionTooltip } from '../action-tooltip';

interface GroupspaceMemberProps {
  member: Member & { profile: Profile };
  groupspace: GroupSpace;
}

const roleIconMap = {
  [MemberRole.GUEST]: null,
  [MemberRole.MODERATOR]: (
    <ActionTooltip label="Moderator" side="top">
      <ShieldCheck className="h-4 w-4 ml-2 text-indigo-500" />
    </ActionTooltip>
  ),
  [MemberRole.ADMIN]: (
    <ActionTooltip label="Admin" side="top">
      <ShieldAlert className="h-4 w-4 ml-2 text-rose-500" />
    </ActionTooltip>
  ),
};

export const GroupspaceMember = ({
  member,
  groupspace,
}: GroupspaceMemberProps) => {
  const params = useParams();
  const router = useRouter();

  const icon = roleIconMap[member.role];

  const onClick = () =>
    router.push(
      `/groupspaces/${params?.groupspaceId}/conversations/${member.id}`
    );

  return (
    <button
      onClick={onClick}
      className={cn(
        'group px-2 py-2 rounded-md flex items-center gap-x-2 w-full hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition mb-1',
        params?.memberId === member.id && 'bg-zinc-700/20 dark:bg-zinc-700'
      )}
    >
      <UserAvatar
        src={member.profile.imageUrl}
        className="h-6 w-6 md:h-6 md:w-6"
      />
      <p
        className={cn(
          'font-semibold text-sm text-zinc-500 group-hover:text-zinc-600 dark:text-zinc-400 dark:group-hover:text-zinc-300 transition',
          params?.memberId === member.id &&
            'text-primary dark:text-zinc-200 dark:group-hover:text-white'
        )}
      >
        {member.profile.name}
      </p>
      {icon}
    </button>
  );
};
