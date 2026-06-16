import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { ok, err } from '@/lib/api-middleware';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const subdomain = searchParams.get('subdomain')?.trim().toLowerCase();

    if (!subdomain) {
      return err('Subdomain parameter is required', 400);
    }

    const org = await prisma.organization.findUnique({
      where: { subdomain },
      select: {
        id: true,
        name: true,
        logoUrl: true,
        themeColor: true,
      },
    });

    if (!org) {
      return ok({ found: false });
    }

    return ok({
      found: true,
      id: org.id,
      name: org.name,
      logoUrl: org.logoUrl,
      themeColor: org.themeColor,
    });
  } catch (error: any) {
    return err(error.message || 'Server error loading public branding details', 500);
  }
}
