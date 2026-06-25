import { NextRequest, NextResponse } from 'next/server';
import * as jwt from 'jsonwebtoken';

const JWT_SECRET = (() => {
  const secret = process.env.JWT_SECRET;
  if (!secret || secret.length < 32) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('JWT_SECRET must be a strong 32+ char secret in production.');
    }
    console.warn('[WARN] JWT_SECRET is weak — set a strong one for production.');
  }
  return secret;
})();

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
    return jwt.verify(token, JWT_SECRET as string) as AuthUser;
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

export function requireRole(req: NextRequest, allowedRoles: string[]): { user: AuthUser } | { error: NextResponse } {
  const auth = requireAuth(req);
  if ('error' in auth) return auth;
  
  // SuperAdmin overrides role checks, except if we want explicit non-SuperAdmin constraints
  if (auth.user.role === 'SuperAdmin') {
    return auth;
  }
  
  if (!allowedRoles.includes(auth.user.role)) {
    return { error: NextResponse.json({ message: `Forbidden — Requires one of roles: ${allowedRoles.join(', ')}` }, { status: 403 }) };
  }
  
  return auth;
}

export function ok(data: any, status = 200) {
  return NextResponse.json(data, { status });
}

export function err(message: string, status = 400) {
  return NextResponse.json({ message }, { status });
}
