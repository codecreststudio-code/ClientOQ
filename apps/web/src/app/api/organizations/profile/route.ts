import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth, ok, err } from '@/lib/api-middleware';

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

export async function PATCH(req: NextRequest) {
  const auth = requireAuth(req);
  if ('error' in auth) return auth.error;

  const { orgId, role } = auth.user;

  if (!orgId) {
    return err('No organization context associated with user session', 400);
  }

  // Authorize: Only Owner or Manager roles can update brand settings
  if (role !== 'Owner' && role !== 'Manager' && role !== 'SuperAdmin') {
    return err('Forbidden — Only organization Owners or Managers can configure branding settings', 403);
  }

    try {
      const body = await req.json();
      const { name, logoUrl, themeColor, subdomain, website, industry, teamSize, razorpayKeyId, razorpayKeySecret, stripePublishableKey, stripeSecretKey } = body;

      const currentOrg = await prisma.organization.findUnique({
        where: { id: orgId },
      });

      if (!currentOrg) {
        return err('Organization not found', 404);
      }

      const updateData: any = {};

      if (name !== undefined) {
        updateData.name = name.trim();
      }

      if (website !== undefined) {
        updateData.website = website ? website.trim() : null;
      }

      if (industry !== undefined) {
        updateData.industry = industry ? industry.trim() : null;
      }

      if (teamSize !== undefined) {
        updateData.teamSize = teamSize ? Number(teamSize) : null;
      }

      if (logoUrl !== undefined) {
        updateData.logoUrl = logoUrl.trim() || null;
      }

      if (themeColor !== undefined) {
        updateData.themeColor = themeColor.trim() || null;
      }

      if (subdomain !== undefined) {
      const cleanSubdomain = subdomain.trim().toLowerCase();

      if (cleanSubdomain === '') {
        updateData.subdomain = null;
      } else if (cleanSubdomain !== currentOrg.subdomain) {
        // Validation format
        const subdomainRegex = /^[a-z0-9](?:[a-z0-9-]{1,28}[a-z0-9])?$/;
        if (!subdomainRegex.test(cleanSubdomain)) {
          return err('Subdomain must be 3-30 characters, contain only letters, numbers, and hyphens, and cannot start/end with a hyphen.', 400);
        }

        // Reserved check
        if (RESERVED_SUBDOMAINS.includes(cleanSubdomain)) {
          return err('This subdomain is reserved and cannot be registered.', 400);
        }

        // Uniqueness check
        const duplicate = await prisma.organization.findFirst({
          where: { subdomain: cleanSubdomain },
        });

        if (duplicate) {
          return err('This subdomain is already registered to another tenant.', 400);
        }

        updateData.subdomain = cleanSubdomain;
      }
    }

      if (razorpayKeyId !== undefined) updateData.razorpayKeyId = razorpayKeyId;
      if (razorpayKeySecret !== undefined) updateData.razorpayKeySecret = razorpayKeySecret;
      if (stripePublishableKey !== undefined) updateData.stripePublishableKey = stripePublishableKey;
      if (stripeSecretKey !== undefined) updateData.stripeSecretKey = stripeSecretKey;

    const updated = await prisma.organization.update({
      where: { id: orgId },
      data: updateData,
    });

    return ok({
      success: true,
      message: 'Organization brand settings updated successfully',
      organization: {
        id: updated.id,
        name: updated.name,
        logoUrl: updated.logoUrl,
        themeColor: updated.themeColor,
        subdomain: updated.subdomain,
        razorpayKeyId: updated.razorpayKeyId,
        stripePublishableKey: updated.stripePublishableKey,
      },
    });
  } catch (error: any) {
    return err(error.message || 'Error updating organization settings', 500);
  }
}
