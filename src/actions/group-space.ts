import { currentProfile } from '@/database/current-profile';
import { ProfileSchema } from '@/schemas';
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { v4 as uuidv4 } from 'uuid';
export const createGroupSpace = async (
  values: z.infer<typeof ProfileSchema>
) => {
  try {
    const profile = await currentProfile();
    if (!profile) {
      return new NextResponse('Unauthorized', { status: 401 });
    }
  } catch (error) {
    console.log('[SERVERS_POST]', error);
  }
};
