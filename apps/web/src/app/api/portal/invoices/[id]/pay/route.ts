import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireRole } from '@/lib/api-middleware';
import Razorpay from 'razorpay';

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  // Only the Client should be initiating payments from the portal
  const auth = requireRole(req, ['Client']);
  if ('error' in auth) return auth.error;
  
  const { orgId } = auth.user;

  if (!orgId) {
    return NextResponse.json({ message: 'Unauthorized, no organization id found' }, { status: 401 });
  }

  try {
    const invoice = await prisma.invoice.findUnique({
      where: { id, organizationId: orgId },
      include: { organization: true }
    });

    if (!invoice) {
      return NextResponse.json({ message: 'Invoice not found' }, { status: 404 });
    }

    if (invoice.status === 'Paid') {
      return NextResponse.json({ message: 'Invoice already paid' }, { status: 400 });
    }

    const org = invoice.organization as any;

    // Tenant must have configured Razorpay keys
    if (!org.razorpayKeyId || !org.razorpayKeySecret) {
      return NextResponse.json({ message: 'Payment gateway not configured by the agency' }, { status: 400 });
    }

    // Initialize Razorpay with the TENANT'S keys
    const razorpay = new Razorpay({
      key_id: org.razorpayKeyId,
      key_secret: org.razorpayKeySecret,
    });

    // Create an order
    const options = {
      amount: Math.round(invoice.totalAmount * 100), // amount in the smallest currency unit (paise)
      currency: "INR",
      receipt: invoice.invoiceNumber,
      notes: {
        invoiceId: invoice.id,
        clientId: invoice.clientId,
      }
    };

    const order = await razorpay.orders.create(options);

    return NextResponse.json({ 
      orderId: order.id,
      amount: options.amount,
      currency: options.currency,
      keyId: org.razorpayKeyId // Safe to send public key ID to client
    });

  } catch (error: any) {
    console.error('Razorpay Order Error:', error);
    return NextResponse.json({ message: error.message || 'Failed to create payment order' }, { status: 500 });
  }
}
