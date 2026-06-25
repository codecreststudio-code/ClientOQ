import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import crypto from 'crypto';

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get('x-razorpay-signature');
    const body = JSON.parse(rawBody);
    
    // Check if the event is a payment capture
    if (body.event !== 'payment.captured') {
      return NextResponse.json({ message: 'Event ignored' });
    }

    const payment = body.payload.payment.entity;
    const { invoiceId } = payment.notes;

    if (!invoiceId) {
      return NextResponse.json({ message: 'No invoiceId in notes, ignored' });
    }

    // Lookup the invoice and organization
    const invoice = await prisma.invoice.findUnique({
      where: { id: invoiceId },
      include: { organization: true }
    });

    if (!invoice) {
      return NextResponse.json({ message: 'Invoice not found' }, { status: 404 });
    }

    const razorpayKeySecret = (invoice.organization as any).razorpayKeySecret;
    if (!razorpayKeySecret) {
      return NextResponse.json({ message: 'No razorpayKeySecret configured for this tenant' }, { status: 400 });
    }

    // Verify signature using the TENANT'S razorpay key secret (since they generated the webhook or the order)
    // NOTE: In Razorpay, webhook secrets are technically configured in the dashboard per webhook endpoint.
    // Since this is a multi-tenant app with dynamic keys, ideally the tenant creates a webhook in their Razorpay dashboard
    // pointing to our URL, using their own Razorpay Key Secret as the Webhook Secret to make it easy.
    // We will assume the webhook secret is the same as the Razorpay Key Secret.
    const expectedSignature = crypto
      .createHmac('sha256', razorpayKeySecret)
      .update(rawBody)
      .digest('hex');

    if (expectedSignature !== signature) {
      return NextResponse.json({ message: 'Invalid signature' }, { status: 400 });
    }

    // Mark invoice as paid
    await prisma.invoice.update({
      where: { id: invoiceId },
      data: { status: 'Paid' }
    });

    // Create payment record
    await prisma.payment.create({
      data: {
        invoiceId: invoiceId,
        amount: invoice.totalAmount,
        paymentGateway: 'Razorpay',
        paymentMethod: 'Online',
        status: 'Completed',
        transactionId: payment.id,
      }
    });

    // Notify the agency owner(s)
    const orgOwners = await prisma.user.findMany({
      where: { organizationId: invoice.organizationId, role: 'Owner' },
      select: { id: true }
    });
    for (const owner of orgOwners) {
      await prisma.notification.create({
        data: {
          userId: owner.id,
          title: 'Invoice Paid!',
          message: `Client paid invoice ${invoice.invoiceNumber} via Razorpay.`,
          type: 'Payment',
        }
      }).catch(() => {});
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Razorpay Webhook Error:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
