import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth, ok, err } from '@/lib/api-middleware';
import * as crypto from 'crypto';

export async function POST(req: NextRequest) {
  const auth = requireAuth(req);
  if ('error' in auth) return auth.error;
  const { orgId, sub: userId, role: userRole } = auth.user;
  if (!orgId) return err('No organization', 403);

  // Restrict to Owners and Managers
  if (userRole !== 'Owner' && userRole !== 'Manager') {
    return err('Forbidden — Requires Owner or Manager role', 403);
  }

  try {
    const body = await req.json();
    const { email, role } = body;

    if (!email || !role) {
      return err('Email and role are required', 400);
    }

    const userExists = await prisma.user.findUnique({ where: { email } });
    if (userExists) {
      return err('User with this email already exists', 400);
    }

    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    const invite = await prisma.userInvite.create({
      data: {
        organizationId: orgId,
        email,
        role,
        token,
        invitedBy: userId,
        status: 'Pending',
        expiresAt
      },
      include: {
        organization: true
      }
    });

    const origin = req.nextUrl.origin || 'https://client-oq.vercel.app';
    const inviteLink = `${origin}/?auth=register&inviteToken=${token}`;
    console.log(`[Email Mock Service] Sending invite email to ${email} with link: ${inviteLink}`);

    return ok({
      message: 'Invitation generated successfully',
      invite: {
        id: invite.id,
        email: invite.email,
        role: invite.role,
        status: invite.status,
        expiresAt: invite.expiresAt,
        token: invite.token,
        inviteLink
      }
    }, 201);
  } catch (error: any) {
    return err(error.message || 'Error creating invitation', 500);
  }
}
