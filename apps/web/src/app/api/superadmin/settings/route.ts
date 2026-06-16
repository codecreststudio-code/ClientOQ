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
    let settings = await prisma.platformSettings.findUnique({
      where: { id: 'default' },
    });

    if (!settings) {
      // Create default row if it doesn't exist yet
      settings = await prisma.platformSettings.create({
        data: {
          id: 'default',
          systemName: 'Clientoq',
          supportEmail: 'support@clientoq.com',
          allowRegistration: true,
          maintenanceMode: false,
          smtpPort: 587, // just in case
        } as any,
      });
    }

    return ok(settings);
  } catch (error: any) {
    return err(error.message || 'Error loading platform settings', 500);
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
    
    // We clean or structure fields to prevent inserting fields that are not in the schema.
    const {
      systemName,
      supportEmail,
      allowRegistration,
      maintenanceMode,
      stripeSecretKey,
      stripeWebhookSecret,
      openaiApiKey,
      metaToken,
      metaPhoneId,
      googleClientId,
      googleClientSecret,
      smtpHost,
      smtpPort,
      smtpUser,
      smtpPass,
      smtpFrom,
    } = body;

    const updated = await prisma.platformSettings.upsert({
      where: { id: 'default' },
      update: {
        systemName,
        supportEmail,
        allowRegistration,
        maintenanceMode,
        stripeSecretKey,
        stripeWebhookSecret,
        openaiApiKey,
        metaToken,
        metaPhoneId,
        googleClientId,
        googleClientSecret,
        smtpHost,
        smtpPort: smtpPort ? parseInt(smtpPort.toString()) : undefined,
        smtpUser,
        smtpPass,
        smtpFrom,
      },
      create: {
        id: 'default',
        systemName: systemName ?? 'Clientoq',
        supportEmail: supportEmail ?? 'support@clientoq.com',
        allowRegistration: allowRegistration ?? true,
        maintenanceMode: maintenanceMode ?? false,
        stripeSecretKey,
        stripeWebhookSecret,
        openaiApiKey,
        metaToken,
        metaPhoneId,
        googleClientId,
        googleClientSecret,
        smtpHost,
        smtpPort: smtpPort ? parseInt(smtpPort.toString()) : 587,
        smtpUser,
        smtpPass,
        smtpFrom,
      },
    });

    return ok({
      success: true,
      message: 'Platform settings updated successfully',
      settings: updated,
    });
  } catch (error: any) {
    return err(error.message || 'Error updating platform settings', 500);
  }
}
