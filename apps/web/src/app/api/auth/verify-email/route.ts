import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const token = searchParams.get('token');

  let success = false;
  if (token) {
    const user = await prisma.user.findFirst({
      where: { emailVerificationToken: token }
    });

    if (user) {
      await prisma.user.update({
        where: { id: user.id },
        data: {
          isEmailVerified: true,
          emailVerificationToken: null
        }
      });
      success = true;
    }
  }

  // Redirect to home page with verified query param
  const base = req.nextUrl.origin;
  const redirectUrl = `${base}/?verified=${success}`;
  return NextResponse.redirect(redirectUrl);
}
