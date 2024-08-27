import { GroupSpace, Zone, ZoneType } from '@prisma/client';
import { create } from 'zustand';

export type ModalType =
  | 'createGroupspace'
  | 'invite'
  | 'editGroupspace'
  | 'members'
  | 'createZone'
  | 'leaveGroupspace'
  | 'deleteGroupspace'
  | 'editZone'
  | 'deleteZone'
  | 'messageFile';

type ModalData = {
  groupspace?: GroupSpace;
  zoneType?: ZoneType;
  zone?: Zone;
  apiUrl?: string;
  query?: Record<string, any>;
};
export type ModalStore = {
  type: ModalType | null;
  data: ModalData;
  isOpen: boolean;
  onOpen: (type: ModalType, data?: ModalData) => void;
  onClose: () => void;
};

export const useModal = create<ModalStore>((set) => ({
  type: null,
  data: {},
  isOpen: false,
  onOpen: (type, data = {}) => set({ isOpen: true, type, data }),
  onClose: () => set({ isOpen: false, type: null }),
}));
