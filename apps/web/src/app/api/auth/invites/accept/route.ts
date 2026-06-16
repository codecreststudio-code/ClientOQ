import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { ok, err } from '@/lib/api-middleware';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-key-agencyos-ai-2026-development';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { token, firstName, lastName, password, phone } = body;

    if (!token || !firstName || !password) {
      return err('Token, first name, and password are required', 400);
    }

    const invite = await prisma.userInvite.findUnique({
      where: { token },
      include: { organization: true }
    });

    if (!invite || invite.status !== 'Pending' || new Date() > invite.expiresAt) {
      return err('Invalid or expired invitation', 400);
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: {
        organizationId: invite.organizationId,
        firstName,
        lastName: lastName || '',
        email: invite.email,
        passwordHash,
        role: invite.role,
        phone: phone || null,
        status: 'Active',
        isEmailVerified: true,
        emailVerificationToken: null
      }
    });

    await prisma.userInvite.update({
      where: { id: invite.id },
      data: { status: 'Accepted' }
    });

    const jwtToken = jwt.sign(
      {
        sub: user.id,
        email: user.email,
        orgId: user.organizationId,
        role: user.role
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    const result = {
      token: jwtToken,
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        organizationId: user.organizationId,
        organizationName: invite.organization.name
      }
    };

    const res = NextResponse.json(result);
    res.cookies.set('clientoq_jwt', jwtToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7
    });

    return res;
  } catch (error: any) {
    return err(error.message || 'Error accepting invitation', 500);
  }
}
