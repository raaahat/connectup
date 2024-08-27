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
import { createGroupSpace } from '@/actions/group-space';
import { useRouter } from 'next/navigation';

export const InitialModal = () => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  function onSubmit(values: z.infer<typeof ProfileSchema>) {
    startTransition(() => {
      createGroupSpace(values).then((data) => {});
    });
    form.reset();
    router.refresh;
    window.location.reload();
  }
  const form = useForm({
    resolver: zodResolver(ProfileSchema),
    defaultValues: {
      name: '',
      imageUrl: '',
    },
  });
  return (
    <Dialog open>
      <DialogContent className="overflow-hidden">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle>
            <ModeToggle />
            Customize your groupspace
          </DialogTitle>
          <DialogDescription>
            Give your groupspace a personality with a name and an image. You can
            always change it later.
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
                        This will be your groupspace icon
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
                      Groupspace name
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
                Create
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
