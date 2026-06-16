import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth, ok, err } from '@/lib/api-middleware';

export async function GET(req: NextRequest) {
  const auth = requireAuth(req);
  if ('error' in auth) return auth.error;
  const { role } = auth.user;

  if (role !== 'SuperAdmin') {
    return err('Forbidden — Requires SuperAdmin role', 403);
  }

  try {
    const orgs = await prisma.organization.findMany({
      include: {
        _count: {
          select: {
            users: true,
            projects: true,
            leads: true,
            invoices: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    // Calculate Platform KPIs
    const totalOrgs = orgs.length;
    let totalUsers = 0;
    let premiumCount = 0;
    let standardCount = 0;
    let freeCount = 0;
    let mrr = 0;

    const formattedOrgs = orgs.map((org) => {
      totalUsers += org._count.users;

      let planPrice = 0;
      if (org.subscriptionPlan === 'Premium') {
        premiumCount++;
        planPrice = 1999;
      } else if (org.subscriptionPlan === 'Standard') {
        standardCount++;
        planPrice = 999;
      } else {
        freeCount++;
      }

      mrr += planPrice;

      return {
        id: org.id,
        name: org.name,
        plan: org.subscriptionPlan,
        users: org._count.users,
        mrr: `₹${planPrice.toLocaleString()}`,
        status: org.subscriptionStatus || 'Active',
        joined: org.createdAt.toISOString().slice(0, 7), // YYYY-MM
      };
    });

    return ok({
      kpis: {
        totalOrganizations: totalOrgs,
        activeUsers: totalUsers,
        platformMRR: `₹${mrr.toLocaleString()}`,
        premiumCount,
        standardCount,
        freeCount,
      },
      organizations: formattedOrgs,
    });
  } catch (error: any) {
    return err(error.message || 'Error loading platform data', 500);
  }
}

export async function PATCH(req: NextRequest) {
  const auth = requireAuth(req);
  if ('error' in auth) return auth.error;
  const { role } = auth.user;

  if (role !== 'SuperAdmin') {
    return err('Forbidden — Requires SuperAdmin role', 403);
  }

  try {
    const body = await req.json();
    const { id, plan, status } = body;

    if (!id) return err('Organization ID is required', 400);

    const updated = await prisma.organization.update({
      where: { id },
      data: {
        subscriptionPlan: plan,
        subscriptionStatus: status,
      },
    });

    return ok({
      success: true,
      message: 'Organization updated successfully',
      organization: updated,
    });
  } catch (error: any) {
    return err(error.message || 'Error updating organization', 500);
  }
}
