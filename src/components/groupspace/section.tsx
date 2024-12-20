'use client';
import { GroupSpaceWithMembersWithProfiles } from '@/types';
import { MemberRole, ZoneType } from '@prisma/client';
import { ActionTooltip } from '../action-tooltip';
import { useModal } from '@/hooks/use-modal-store';
import { Plus, Settings } from 'lucide-react';

type GroupspaceSectionProps = {
  label: string;
  role?: MemberRole;
  sectionType: 'zones' | 'members';
  zoneType?: ZoneType;
  groupspace?: GroupSpaceWithMembersWithProfiles;
};

export function GroupspaceSection({
  label,
  sectionType,
  groupspace,
  role,
  zoneType,
}: GroupspaceSectionProps) {
  const { onOpen } = useModal();

  return (
    <div className="flex items-center justify-between py-2">
      <p className="text-xs uppercase font-semibold text-zinc-500 dark:text-zinc-400">
        {label}
      </p>
      {role !== MemberRole.GUEST && sectionType === 'zones' && (
        <ActionTooltip label="Create Zone" side="top">
          <button
            onClick={() => onOpen('createZone', { zoneType })}
            className="text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300 transition"
          >
            <Plus className="h-4 w-4" />
          </button>
        </ActionTooltip>
      )}
      {role === MemberRole.ADMIN && sectionType === 'members' && (
        <ActionTooltip label="Manage Members" side="top">
          <button
            onClick={() => onOpen('members', { groupspace })}
            className="text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300 transition"
          >
            <Settings className="h-4 w-4" />
          </button>
        </ActionTooltip>
      )}
    </div>
  );
}
