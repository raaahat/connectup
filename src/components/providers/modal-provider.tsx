'use client';

import { useEffect, useState } from 'react';
import { EditGroupspaceModal } from '../modals/edit';
import { InviteModal } from '../modals/invite-modal';
import { CreateGroupspaceModal } from '../modals/create';
import { MembersModal } from '../modals/members-modal';
import { CreateZoneModal } from '../modals/create-zone';
import { LeaveGroupspaceModal } from '../modals/leave-groupspace-modal';

export const ModalProvider = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <>
      <CreateGroupspaceModal />
      <InviteModal />
      <EditGroupspaceModal />
      <MembersModal />
      <CreateZoneModal />
      <LeaveGroupspaceModal />
    </>
  );
};
