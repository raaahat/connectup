'use client';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import qs from 'query-string';
import { ModeToggle } from '../mode-toggle';

import { useModal } from '@/hooks/use-modal-store';
import { Button } from '../ui/button';
import { useState } from 'react';
import axios from 'axios';

export const DeleteMessageModal = () => {
  const {
    isOpen,
    onClose,
    type,
    data: { apiUrl, query },
  } = useModal();
  const [isLoading, setIsLoading] = useState(false);

  const isModalOpen = isOpen && type === 'deleteMessage';
  const onClick = async () => {
    try {
      setIsLoading(true);

      const url = qs.stringifyUrl({
        url: apiUrl || '',
        query,
      });

      await axios.delete(url);

      onClose();
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
            Delete Message
          </DialogTitle>
          <DialogDescription className=" text-center pt-4">
            Are you sure you want to do this?
            <br />
            The message will be permanently deleted.
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
