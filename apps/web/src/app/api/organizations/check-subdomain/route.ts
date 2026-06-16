import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { ok, err } from '@/lib/api-middleware';

const RESERVED_SUBDOMAINS = [
  'www',
  'api',
  'admin',
  'superadmin',
  'app',
  'auth',
  'portal',
  'mail',
  'platform',
  'clientoq',
  'agencyos',
];

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const subdomain = searchParams.get('subdomain')?.trim().toLowerCase();

    if (!subdomain) {
      return err('Subdomain parameter is required', 400);
    }

    // Format validation: alphanumeric and hyphens, 3-30 chars, no leading/trailing hyphens
    const subdomainRegex = /^[a-z0-9](?:[a-z0-9-]{1,28}[a-z0-9])?$/;
    if (!subdomainRegex.test(subdomain)) {
      return ok({
        available: false,
        reason: 'Subdomain must be 3-30 characters, contain only letters, numbers, and hyphens, and cannot start or end with a hyphen.',
      });
    }

    // Reserved check
    if (RESERVED_SUBDOMAINS.includes(subdomain)) {
      return ok({
        available: false,
        reason: 'This subdomain is reserved and cannot be used.',
      });
    }

    // Uniqueness check
    const existing = await prisma.organization.findUnique({
      where: { subdomain },
    });

    if (existing) {
      return ok({
        available: false,
        reason: 'This subdomain is already taken.',
      });
    }

    return ok({ available: true });
  } catch (error: any) {
    return err(error.message || 'Server error checking subdomain availability', 500);
  }
}
