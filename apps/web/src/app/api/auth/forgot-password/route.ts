import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { ok, err } from '@/lib/api-middleware';
import * as crypto from 'crypto';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email } = body;

    if (!email) {
      return err('Email is required', 400);
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      // Prevent enumeration
      return ok({ success: true, message: 'If that email is registered, a reset link has been sent.' });
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    await prisma.userSession.create({
      data: {
        userId: user.id,
        deviceInfo: `password-reset:${resetToken}`,
        expiresAt,
      }
    });

    const origin = req.nextUrl.origin;
    const resetUrl = `${origin}/?auth=reset&token=${resetToken}`;
    console.log(`[Email Mock Service] Password reset email to ${email} with link: ${resetUrl}`);

    return ok({ success: true, message: 'If that email is registered, a reset link has been sent.' });
  } catch (error: any) {
    return err(error.message || 'Error processing forgot password request', 500);
  }
}
