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
import { useEffect, useTransition } from 'react';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { ModeToggle } from '../mode-toggle';
import FileUpload from '@/components/file-upload';
import { ProfileSchema } from '@/schemas';
import { useRouter } from 'next/navigation';
import { useModal } from '@/hooks/use-modal-store';
import { editGroupSpace } from '@/actions/edit-groupspace';

export const EditGroupspaceModal = () => {
  const { isOpen, onClose, type, data } = useModal();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const { groupspace } = data;
  const isModalOpen = isOpen && type === 'editGroupspace';

  function onSubmit(values: z.infer<typeof ProfileSchema>) {
    startTransition(() => {
      editGroupSpace(groupspace?.id, values).then((data) => {
        if (!data) console.log('Internal Error');
      });
    });
    form.reset();
    router.refresh();
    onClose();
  }
  const form = useForm({
    resolver: zodResolver(ProfileSchema),
    defaultValues: {
      name: '',
      imageUrl: '',
    },
  });
  useEffect(() => {
    if (groupspace) {
      form.setValue('name', groupspace.name);
      form.setValue('imageUrl', groupspace.imageUrl);
    }
  }, [groupspace, form]);

  const handleClose = () => {
    onClose();
  };
  return (
    <Dialog open={isModalOpen} onOpenChange={handleClose}>
      <DialogContent className="overflow-hidden">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle>
            <ModeToggle />
            Edit your Group Space
          </DialogTitle>
          <DialogDescription>
            Give your Group Space a personality with a name and an image. You
            can always change it later.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="space-y-8 px-6">
              <div className="text-center flex items-center justify-center ">
                <FormField
                  control={form.control}
                  name="imageUrl"
                  render={({ field }) => (
                    <FormItem className="flex flex-col items-center justify-center">
                      <FormControl>
                        <FileUpload
                          endpoint="serverImage"
                          value={field.value}
                          onChange={field.onChange}
                        />
                      </FormControl>
                      <FormDescription className="text-xs">
                        This will be your Group icon
                      </FormDescription>
                      <FormMessage className="text-red-500" />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className=" uppercase font-bold">
                      Group Space name
                    </FormLabel>
                    <FormControl>
                      <Input
                        disabled={isPending}
                        placeholder="enter name here..."
                        {...field}
                        className=" border-0 bg-foreground/10 "
                      />
                    </FormControl>
                    <FormDescription className="text-xs">
                      This will be your public groupspace name.
                    </FormDescription>
                    <FormMessage className="text-red-500" />
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter className="px-6 py-4">
              <Button variant="primary" disabled={isPending} type="submit">
                Save
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
