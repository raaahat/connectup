import { ModeToggle } from '@/components/mode-toggle';
import { Button } from '@/components/ui/button';
import { initialProfile } from '@/lib/initial-profile';
import { db } from '@/lib/prisma';
import { UserButton } from '@clerk/nextjs';
import { auth, currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

export default async function SetupPage() {
  const profile = await initialProfile();

  const server = await db.server.findFirst({
    where: {
      members: {
        some: {
          profileId: profile.id,
        },
      },
    },
  });
  if (server) {
    return redirect(`/servers/${server.id}`);
  }
  return <div>Create A Server</div>;
}
