'use client';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

import { ModeToggle } from '../mode-toggle';

import { useModal } from '@/hooks/use-modal-store';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Check, Copy, RefreshCw } from 'lucide-react';
import { useState } from 'react';
import { useOrigin } from '@/hooks/use-origin';
import generateInviteLink from '@/actions/generate-invite-link';

export const InviteModal = () => {
  const { isOpen, onOpen, onClose, type, data } = useModal();
  const origin = useOrigin();

  const [copied, setCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { groupspace } = data;
  if (!groupspace) return null;
  const inviteUrl = `${origin}/invite/${groupspace?.inviteCode}`;
  const isModalOpen = isOpen && type === 'invite';

  const onCopy = () => {
    navigator.clipboard.writeText(inviteUrl);
    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 1000);
  };
  const onNew = async () => {
    try {
      setIsLoading(true);

      const response = await generateInviteLink(groupspace.id);
      if (!response) return null;
      onOpen('invite', { groupspace: response });
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
            Invite Friends
          </DialogTitle>
        </DialogHeader>
        <div className=" p-6">
          <Label className="uppercase text-xs font-bold">
            Groupspace invite link
          </Label>
          <div className="flex items-center mt-2 gap-x-2">
            <Input
              readOnly
              disabled={isLoading}
              value={inviteUrl}
              className=" border-0 bg-foreground/10 focus-visible:ring-0 focus-visible:ring-offset-0"
            />
            <Button disabled={isLoading} onClick={onCopy} size="icon">
              {copied ? (
                <Check className="w-4 h-4" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </Button>
          </div>
          <Button
            disabled={isLoading}
            onClick={onNew}
            variant="link"
            size="sm"
            className="text-xs text-muted-foreground  mt-4"
          >
            Generate a new link
            <RefreshCw className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
