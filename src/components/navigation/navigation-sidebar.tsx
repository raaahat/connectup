import { currentProfile } from '@/database/current-profile';
import { redirect } from 'next/navigation';
import { NavigationAction } from './navigation-action';
import { Separator } from '../ui/separator';
import { ScrollArea } from '../ui/scroll-area';
import { db } from '@/lib/prisma';
import { NavigationItem } from './navigation-item';
import { ModeToggle } from '../mode-toggle';
import { UserButton } from '@clerk/nextjs';

const NavigationSidebar = async () => {
  const profile = await currentProfile();

  if (!profile) {
    return redirect('/');
  }
  const groupSpaces = await db.groupSpace.findMany({
    where: {
      members: {
        some: {
          profileId: profile.id,
        },
      },
    },
  });
  return (
    <div className="flex flex-col items-center h-full w-full space-y-4 text-primary dark:bg-background  py-3">
      <NavigationAction />
      <Separator className="h-[2px] bg-zinc-200 dark:bg-zinc-700 rounded-md w-10 mx-auto" />
      <ScrollArea className="flex-1 w-full ">
        {groupSpaces.map((groupSpace) => {
          return (
            <div key={groupSpace.id} className="  mb-4">
              <NavigationItem
                name={groupSpace.name}
                imageUrl={groupSpace.imageUrl}
                id={groupSpace.id}
              />
            </div>
          );
        })}
      </ScrollArea>
      <div className="pb-3 mt-auto flex items-center flex-col gap-y-4">
        <ModeToggle />
        <UserButton
          appearance={{
            elements: {
              avatarBox: 'h-[48px] w-[48px]',
            },
          }}
        />
      </div>
    </div>
  );
};

export default NavigationSidebar;
