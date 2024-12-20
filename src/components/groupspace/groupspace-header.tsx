'use client';

import { GroupSpaceWithMembersWithProfiles } from '@/types';
import { MemberRole } from '@prisma/client';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import {
  ChevronDown,
  LogOutIcon,
  PlusCircle,
  Settings,
  Trash,
  UserPlus,
  Users,
} from 'lucide-react';
import { useModal } from '@/hooks/use-modal-store';

type GroupSpaceHeaderProps = {
  groupspace: GroupSpaceWithMembersWithProfiles;
  role?: MemberRole;
};
export const GroupSpaceHeader = ({
  groupspace,
  role,
}: GroupSpaceHeaderProps) => {
  const { onOpen } = useModal();
  const isAdmin = role === MemberRole.ADMIN;
  const isModerator = isAdmin || role === MemberRole.MODERATOR;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="focus:outline-none" asChild>
        <button className="w-full text-md font-semibold px-3 flex items-center h-12 border-neutral-200 dark:border-neutral-800 border-b-2 hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition">
          {groupspace.name}
          <ChevronDown className="h-5 w-5 ml-auto " />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 text-xs font-medium text-neutral-800 dark:text-neutral-400 space-y-[2px]">
        {isModerator && (
          <DropdownMenuItem
            onClick={() => onOpen('invite', { groupspace })}
            className="text-indigo-600 dark:text-indigo-400 px-3 py-2 text-sm cursor-pointer"
          >
            Invite People
            <UserPlus className="h-4 w-4 ml-auto" />
          </DropdownMenuItem>
        )}
        {isAdmin && (
          <DropdownMenuItem
            onClick={() => onOpen('editGroupspace', { groupspace })}
            className="px-3 py-2 text-sm cursor-pointer"
          >
            Groupspace Settings
            <Settings className="h-4 w-4 ml-auto" />
          </DropdownMenuItem>
        )}
        {isAdmin && (
          <DropdownMenuItem
            className="px-3 py-2 text-sm cursor-pointer"
            onClick={() => onOpen('members', { groupspace })}
          >
            Manage Members
            <Users className="h-4 w-4 ml-auto" />
          </DropdownMenuItem>
        )}
        {isModerator && (
          <DropdownMenuItem
            onClick={() => onOpen('createZone')}
            className="px-3 py-2 text-sm cursor-pointer"
          >
            Create Zone
            <PlusCircle className="h-4 w-4 ml-auto" />
          </DropdownMenuItem>
        )}
        {isModerator && <DropdownMenuSeparator />}
        {isAdmin && (
          <DropdownMenuItem
            onClick={() => {
              onOpen('deleteGroupspace', { groupspace });
            }}
            className="px-3 py-2 text-sm cursor-pointer text-rose-500"
          >
            Delete Groupspace
            <Trash className="h-4 w-4 ml-auto" />
          </DropdownMenuItem>
        )}
        {!isAdmin && (
          <DropdownMenuItem
            onClick={() => {
              onOpen('leaveGroupspace', { groupspace });
            }}
            className="px-3 py-2 text-sm cursor-pointer text-rose-500"
          >
            Leave Groupspace
            <LogOutIcon className="h-4 w-4 ml-auto" />
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
