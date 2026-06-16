import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth, ok, err } from '@/lib/api-middleware';
import * as bcrypt from 'bcryptjs';

export async function PATCH(req: NextRequest) {
  return handleProfileUpdate(req);
}

export async function PUT(req: NextRequest) {
  return handleProfileUpdate(req);
}

async function handleProfileUpdate(req: NextRequest) {
  const auth = requireAuth(req);
  if ('error' in auth) return auth.error;
  const { sub } = auth.user;

  const body = await req.json();

  if (body.type === 'password') {
    const user = await prisma.user.findUnique({ where: { id: sub } });
    if (!user) return err('User not found', 404);
    const isMatch = await bcrypt.compare(body.currentPassword, user.passwordHash);
    if (!isMatch) return err('Current password is incorrect', 400);
    const passwordHash = await bcrypt.hash(body.newPassword, 12);
    await prisma.user.update({ where: { id: sub }, data: { passwordHash } });
    return ok({ success: true, message: 'Password updated successfully' });
  }

  const updated = await prisma.user.update({
    where: { id: sub },
    data: {
      firstName: body.firstName,
      lastName: body.lastName,
      phone: body.phone,
      bio: body.bio,
      timezone: body.timezone,
      avatarUrl: body.avatarUrl,
      notificationPreferences: body.notificationPreferences,
    },
    include: { organization: true },
  });

  return ok({
    id: updated.id,
    firstName: updated.firstName,
    lastName: updated.lastName,
    email: updated.email,
    role: updated.role,
    phone: updated.phone,
    bio: updated.bio,
    timezone: updated.timezone,
    avatarUrl: updated.avatarUrl,
    notificationPreferences: updated.notificationPreferences,
    organizationId: updated.organizationId,
    organizationName: (updated as any).organization?.name || null,
  });
}
