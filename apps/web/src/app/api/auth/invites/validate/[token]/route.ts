import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { ok, err } from '@/lib/api-middleware';

export async function GET(req: NextRequest, { params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;

  try {
    const invite = await prisma.userInvite.findUnique({
      where: { token },
      include: { organization: true }
    });

    if (!invite || invite.status !== 'Pending') {
      return err('Invalid or expired invitation', 400);
    }

    if (new Date() > invite.expiresAt) {
      await prisma.userInvite.update({
        where: { id: invite.id },
        data: { status: 'Expired' }
      });
      return err('Invitation has expired', 400);
    }

    return ok({
      email: invite.email,
      role: invite.role,
      organizationName: invite.organization.name
    });
  } catch (error: any) {
    return err(error.message || 'Error validating invitation', 500);
  }
}
