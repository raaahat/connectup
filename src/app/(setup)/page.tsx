import { InitialModal } from '@/components/modals/initial-modal';
import { initialProfile } from '@/lib/initial-profile';
import { db } from '@/lib/prisma';
import { redirect } from 'next/navigation';

export default async function SetupPage() {
  const profile = await initialProfile();

  const groupSpace = await db.groupSpace.findFirst({
    where: {
      members: {
        some: {
          profileId: profile.id,
        },
      },
    },
  });
  if (groupSpace) {
    return redirect(`/groupSpaces/${groupSpace.id}`);
  }
  return <InitialModal />;
}
