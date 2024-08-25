'use client';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

import { ModeToggle } from '../mode-toggle';

import { useModal } from '@/hooks/use-modal-store';
import { Button } from '../ui/button';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { deleteZone } from '@/actions/zone';

export const DeleteZoneModal = () => {
  const { isOpen, onClose, type, data } = useModal();
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const { zone, groupspace } = data;
  if (!zone) return null;

  const isModalOpen = isOpen && type === 'deleteZone';
  const onClick = async () => {
    try {
      setIsLoading(true);
      await deleteZone(groupspace?.id, zone.id);
      onClose();
      router.refresh();
      router.push(`/groupspaces/${groupspace?.id}`);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className="overflow-hidden">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl text-center font-bold">
            <ModeToggle />
            Delete Zone
          </DialogTitle>
          <DialogDescription className=" text-center pt-4">
            Are sure you want to permanently delete{' '}
            <span className=" font-bold text-indigo-500">#{zone.name}</span>?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <div className="flex items-center justify-between w-full">
            <Button variant="ghost" disabled={isLoading} onClick={onClose}>
              Cancel
            </Button>
            <Button variant="primary" disabled={isLoading} onClick={onClick}>
              Confirm
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
