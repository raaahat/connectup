import React from 'react';
import { Menu } from 'lucide-react';

import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import NavigationSidebar from '@/components/navigation/navigation-sidebar';
import { GroupSpaceSidebar } from '@/components/groupspace/groupspace-sidebar';

export function MobileToggle({ groupspaceId }: { groupspaceId: string }) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="p-0 flex gap-0">
        <div className="w-[72px]">
          <NavigationSidebar />
        </div>
        <GroupSpaceSidebar groupspaceId={groupspaceId} />
      </SheetContent>
    </Sheet>
  );
}
