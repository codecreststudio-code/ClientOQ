import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth, ok, err } from '@/lib/api-middleware';
import * as crypto from 'crypto';

export async function POST(req: NextRequest) {
  const auth = requireAuth(req);
  if ('error' in auth) return auth.error;
  const { sub: userId } = auth.user;

  try {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      return err('User not found', 404);
    }
    if (user.isEmailVerified) {
      return err('Email is already verified', 400);
    }

    const emailVerificationToken = crypto.randomBytes(32).toString('hex');
    await prisma.user.update({
      where: { id: user.id },
      data: { emailVerificationToken }
    });

    const origin = req.nextUrl.origin;
    const verificationUrl = `${origin}/api/auth/verify-email?token=${emailVerificationToken}`;
    console.log(`[Email Mock Service] Email verification to ${user.email} with link: ${verificationUrl}`);

    return ok({ success: true, message: 'Verification email sent' });
  } catch (error: any) {
    return err(error.message || 'Error resending verification email', 500);
  }
}
