import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { ok, err } from '@/lib/api-middleware';
import * as bcrypt from 'bcryptjs';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { token, newPassword } = body;

    if (!token || !newPassword) {
      return err('Token and new password are required', 400);
    }

    if (newPassword.length < 8) {
      return err('Password must be at least 8 characters.', 400);
    }

    const sessions = await prisma.userSession.findMany({
      where: { deviceInfo: `password-reset:${token}`, expiresAt: { gt: new Date() } }
    });

    if (!sessions.length) {
      return err('Invalid or expired reset token.', 400);
    }

    const resetSession = sessions[0];
    const passwordHash = await bcrypt.hash(newPassword, 12);

    await prisma.user.update({
      where: { id: resetSession.userId },
      data: { passwordHash }
    });

    // Invalidate the reset token
    await prisma.userSession.delete({ where: { id: resetSession.id } });

    return ok({ success: true, message: 'Password reset successfully. You can now log in.' });
  } catch (error: any) {
    return err(error.message || 'Error resetting password', 500);
  }
}
