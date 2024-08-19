'use client';
import * as z from 'zod';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTransition } from 'react';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { ModeToggle } from '../mode-toggle';
import FileUpload from '@/components/file-upload';
import { CreateZoneSchema } from '@/schemas';

import { useParams, useRouter } from 'next/navigation';
import { useModal } from '@/hooks/use-modal-store';
import { ZoneType } from '@prisma/client';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { createZone } from '@/actions/zone';

export const CreateZoneModal = () => {
  const { isOpen, onClose, type } = useModal();
  const router = useRouter();
  const params: { groupspaceId: string } = useParams();
  const groupspaceId = params.groupspaceId;
  const isModalOpen = isOpen && type === 'createZone';

  const [isPending, startTransition] = useTransition();
  function onSubmit(values: z.infer<typeof CreateZoneSchema>) {
    startTransition(async () => {
      const res = await createZone(groupspaceId, values);
    });
    form.reset();
    router.refresh();
    onClose();
  }
  const form = useForm({
    resolver: zodResolver(CreateZoneSchema),
    defaultValues: {
      name: '',
      type: ZoneType.TEXT,
    },
  });

  const handleClose = () => {
    form.reset();
    onClose();
  };
  return (
    <Dialog open={isModalOpen} onOpenChange={handleClose}>
      <DialogContent className="overflow-hidden">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle>
            <ModeToggle />
            Create zone
          </DialogTitle>
          <DialogDescription>
            Zone could be Text, Audio, Video
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="space-y-8 px-6">
              <div className="text-center flex items-center justify-center "></div>

              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className=" uppercase font-bold">
                      Zone name
                    </FormLabel>
                    <FormControl>
                      <Input
                        disabled={isPending}
                        placeholder="enter name here..."
                        {...field}
                        className=" border-0 bg-foreground/10 "
                      />
                    </FormControl>

                    <FormMessage className="text-red-500" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className=" uppercase font-bold">
                      Zone type
                    </FormLabel>
                    <FormControl>
                      <Select
                        disabled={isPending}
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className=" border-0 bg-foreground/10 focus:ring-0  ring-offset-0 focus:ring-offset-0 capitalize outline-none">
                            <SelectValue placeholder="Select a zone type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {Object.values(ZoneType).map((type) => (
                            <SelectItem
                              key={type}
                              value={type}
                              className="capitalize"
                            >
                              {type.toLowerCase()}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>

                    <FormMessage className="text-red-500" />
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter className="px-6 py-4">
              <Button variant="primary" disabled={isPending} type="submit">
                Create
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};