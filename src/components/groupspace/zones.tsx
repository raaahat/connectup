'use client';

import React from 'react';
import { Zone, ZoneType, MemberRole, GroupSpace } from '@prisma/client';
import { Edit, Hash, Lock, Mic, Trash, Video } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';

import { cn } from '@/lib/utils';
import { ActionTooltip } from '@/components/action-tooltip';
import { ModalType, useModal } from '@/hooks/use-modal-store';

interface GroupspaceZoneProps {
  zone: Zone;
  groupspace: GroupSpace;
  role?: MemberRole;
}

const iconMap = {
  [ZoneType.TEXT]: Hash,
  [ZoneType.AUDIO]: Mic,
  [ZoneType.VIDEO]: Video,
};

export function GroupspaceZone({
  zone,
  groupspace,
  role,
}: GroupspaceZoneProps) {
  const { onOpen } = useModal();
  const params = useParams();
  const router = useRouter();

  const Icon = iconMap[zone.type];

  const onClick = () =>
    router.push(`/groupspaces/${params?.groupspaceId}/zones/${zone.id}`);

  const onAction = (e: React.MouseEvent, action: ModalType) => {
    e.stopPropagation();

    onOpen(action, { zone, groupspace });
  };

  return (
    <button
      className={cn(
        'group px-2 py-2 rounded-md flex items-center gap-x-2 w-full hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition mb-1',
        params?.zoneId === zone.id && 'bg-zinc-700/20 dark:bg-zinc-700'
      )}
      onClick={onClick}
    >
      <Icon className="flex-shrink-0 w-5 h-5 text-zinc-500 dark:text-zinc-400" />
      <p
        className={cn(
          'line-clamp-1 font-semibold text-sm text-zinc-500 group-hover:text-zinc-600 dark:text-zinc-400 dark:group-hover:text-zinc-300 transition',
          params?.zoneId === zone.id &&
            'text-primary dark:text-zinc-200 dark:group-hover:text-white'
        )}
      >
        {zone.name}
      </p>
      {zone.name !== 'home' && role !== MemberRole.GUEST && (
        <div className="ml-auto flex items-center gap-x-2">
          <ActionTooltip label="Edit">
            <Edit
              onClick={(e) => {
                onAction(e, 'editZone');
              }}
              className="hidden group-hover:block w-4 h-4 text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300 transition"
            />
          </ActionTooltip>
          <ActionTooltip label="Delete">
            <Trash
              onClick={(e) => {
                onAction(e, 'deleteZone');
              }}
              className="hidden group-hover:block w-4 h-4 text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300 transition"
            />
          </ActionTooltip>
        </div>
      )}
      {zone.name === 'home' && (
        <Lock className="ml-auto w-4 h-4 text-zinc-500 dark:text-zinc-400" />
      )}
    </button>
  );
}
