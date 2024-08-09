import { GroupSpace, Member, Profile } from '@prisma/client';

export type GroupSpaceWithMembersWithProfiles = GroupSpace & {
  members: (Member & { profile: Profile })[];
};
