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
import { deleteGroupspace } from '@/actions/group-space';

export const DeleteGroupspaceModal = () => {
  const { isOpen, onClose, type, data } = useModal();
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const { groupspace } = data;
  if (!groupspace) return null;

  const isModalOpen = isOpen && type === 'deleteGroupspace';
  const onClick = async () => {
    try {
      setIsLoading(true);
      await deleteGroupspace(groupspace.id);
      onClose();
      router.refresh();
      router.push('/');
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
            Delete Groupspace
          </DialogTitle>
          <DialogDescription className=" text-center pt-4">
            Are sure you want to permanently delete{' '}
            <span className=" font-bold text-indigo-500"></span>
            {groupspace.name}?
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
