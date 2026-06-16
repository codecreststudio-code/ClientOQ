import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-key-agencyos-ai-2026-development';
const SUPER_ADMIN_EMAILS = ['codecreststudio@gmail.com'];

function signToken(payload: object) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

export function verifyToken(token: string) {
  return jwt.verify(token, JWT_SECRET) as any;
}

export async function handleLogin(body: any) {
  const { email, password } = body;
  const user = await prisma.user.findUnique({
    where: { email },
    include: { organization: true }
  });

  if (!user) throw new Error('Invalid credentials');
  const isMatch = await bcrypt.compare(password, user.passwordHash);
  if (!isMatch) throw new Error('Invalid credentials');

  const token = signToken({ sub: user.id, email: user.email, orgId: user.organizationId, role: user.role });

  return {
    token,
    user: {
      id: user.id, firstName: user.firstName, lastName: user.lastName,
      email: user.email, role: user.role, organizationId: user.organizationId,
      organizationName: (user as any).organization?.name || null, isEmailVerified: user.isEmailVerified
    }
  };
}

export async function handleRegister(body: any) {
  const { orgName, firstName, lastName, email, password } = body;
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) throw new Error('Email already registered');

  const slug = orgName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') + '-' + Date.now();
  const org = await prisma.organization.create({ data: { name: orgName, slug } });

  const passwordHash = await bcrypt.hash(password, 12);
  const user = await prisma.user.create({
    data: {
      organizationId: org.id, firstName, lastName, email, passwordHash,
      role: 'Owner', status: 'Active', isEmailVerified: true
    }
  });

  const token = signToken({ sub: user.id, email: user.email, orgId: org.id, role: user.role });

  return {
    token,
    user: {
      id: user.id, firstName: user.firstName, lastName: user.lastName,
      email: user.email, role: user.role, organizationId: org.id,
      organizationName: org.name, isEmailVerified: true
    }
  };
}

export async function handleGoogleLogin(credential: string) {
  const { OAuth2Client } = await import('google-auth-library');
  const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

  const ticket = await client.verifyIdToken({
    idToken: credential,
    audience: process.env.GOOGLE_CLIENT_ID
  });

  const payload = ticket.getPayload();
  if (!payload?.email) throw new Error('Google token missing email');

  const { email, given_name: firstName = 'User', family_name: lastName = '' } = payload;
  const isSuperAdmin = SUPER_ADMIN_EMAILS.includes(email.toLowerCase());

  let user: any = await prisma.user.findUnique({
    where: { email },
    include: { organization: true }
  });

  if (!user) {
    let orgId: string | null = null;
    if (!isSuperAdmin) {
      const slug = email.split('@')[0].toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Date.now();
      const org = await prisma.organization.create({ data: { name: `${firstName}'s Agency`, slug } });
      orgId = org.id;
    }
    const passwordHash = await bcrypt.hash(require('crypto').randomBytes(32).toString('hex'), 10);
    user = await prisma.user.create({
      data: {
        email, firstName, lastName, passwordHash,
        organizationId: orgId,
        role: isSuperAdmin ? 'SuperAdmin' : 'Owner',
        status: 'Active', isEmailVerified: true
      },
      include: { organization: true }
    });
  } else if (isSuperAdmin && user.role !== 'SuperAdmin') {
    user = await prisma.user.update({
      where: { id: user.id },
      data: { role: 'SuperAdmin', isEmailVerified: true },
      include: { organization: true }
    });
  }

  const token = signToken({ sub: user.id, email: user.email, orgId: user.organizationId, role: user.role });

  return {
    token,
    user: {
      id: user.id, firstName: user.firstName, lastName: user.lastName,
      email: user.email, role: user.role, organizationId: user.organizationId,
      organizationName: user.organization?.name || null, isEmailVerified: true
    }
  };
}

export async function handleGetMe(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { organization: true }
  });
  if (!user) throw new Error('User not found');
  return {
    id: user.id, firstName: user.firstName, lastName: user.lastName,
    email: user.email, role: user.role, organizationId: user.organizationId,
    organizationName: (user as any).organization?.name || null,
    isEmailVerified: user.isEmailVerified, phone: user.phone, bio: user.bio, timezone: user.timezone
  };
}

export async function handleUpdateProfile(userId: string, body: any) {
  const updated = await prisma.user.update({
    where: { id: userId },
    data: { phone: body.phone, bio: body.bio, timezone: body.timezone }
  });
  return { id: updated.id, firstName: updated.firstName, lastName: updated.lastName, email: updated.email, role: updated.role, phone: updated.phone, bio: updated.bio, timezone: updated.timezone };
}

export function getTokenFromRequest(req: Request): string | null {
  const auth = req.headers.get('authorization');
  if (auth?.startsWith('Bearer ')) return auth.slice(7);
  return null;
}
