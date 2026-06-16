import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { requireAuth } from '@/lib/api-middleware';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const auth = requireAuth(request);
    if ('error' in auth) return auth.error;
    const user = auth.user;
    
    if (!user.orgId) {
      return NextResponse.json({ error: 'User does not belong to an organization' }, { status: 400 });
    }

    const body = await request.json();
    const { planId, clientId } = body;
    
    if (!planId) {
      return NextResponse.json({ error: 'Plan ID is required' }, { status: 400 });
    }
    
    // Verify plan exists
    const plan = await prisma.subscriptionPlan.findUnique({
      where: { id: planId }
    });
    
    if (!plan) {
      return NextResponse.json({ error: 'Plan not found' }, { status: 404 });
    }
    
    // Ensure the plan belongs to the organization
    if (plan.organizationId !== user.orgId) {
      return NextResponse.json({ error: 'Plan not found in your organization' }, { status: 404 });
    }

    // For now, we require a clientId to be passed.
    if (!clientId) {
      return NextResponse.json({ error: 'Client ID is required' }, { status: 400 });
    }
    
    // Mock Stripe checkout or direct subscription creation
    const currentPeriodEnd = new Date();
    if (plan.interval === 'year') {
      currentPeriodEnd.setFullYear(currentPeriodEnd.getFullYear() + 1);
    } else {
      currentPeriodEnd.setMonth(currentPeriodEnd.getMonth() + 1);
    }

    const subscription = await prisma.clientSubscription.create({
      data: {
        organizationId: user.orgId,
        clientId,
        planId,
        status: 'active',
        currentPeriodEnd
      }
    });
    
    return NextResponse.json({ success: true, subscription });
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to create subscription' }, { status: 500 });
  }
}
