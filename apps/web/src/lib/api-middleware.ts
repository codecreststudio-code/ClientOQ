import { NextRequest, NextResponse } from 'next/server';
import * as jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-key-agencyos-ai-2026-development';

export interface AuthUser {
  sub: string;
  email: string;
  orgId: string | null;
  role: string;
  orgSubdomain?: string | null;
}

export function getToken(req: NextRequest): string | null {
  const auth = req.headers.get('authorization');
  if (auth?.startsWith('Bearer ')) return auth.slice(7);
  const cookie = req.cookies.get('clientoq_jwt')?.value;
  return cookie || null;
}

export function verifyAuth(req: NextRequest): AuthUser | null {
  const token = getToken(req);
  if (!token) return null;
  try {
    return jwt.verify(token, JWT_SECRET) as AuthUser;
  } catch {
    return null;
  }
}

export function requireAuth(req: NextRequest): { user: AuthUser } | { error: NextResponse } {
  const user = verifyAuth(req);
  if (!user) {
    return { error: NextResponse.json({ message: 'Unauthorized' }, { status: 401 }) };
  }

  // Impersonation support for SuperAdmin
  if (user.role === 'SuperAdmin') {
    const impersonated = req.headers.get('x-impersonate-org');
    if (impersonated) {
      user.orgId = impersonated;
    }
  }

  // Tenant subdomain isolation check
  const tenantSubdomain = req.headers.get('x-tenant-subdomain');
  if (tenantSubdomain && user.role !== 'SuperAdmin') {
    if (user.orgSubdomain !== tenantSubdomain.toLowerCase()) {
      return { error: NextResponse.json({ message: 'Forbidden — You do not have access to this tenant portal' }, { status: 403 }) };
    }
  }

  return { user };
}

export function ok(data: unknown, status = 200) {
  return NextResponse.json(data, { status });
}

export function err(message: string, status = 400) {
  return NextResponse.json({ message }, { status });
}
