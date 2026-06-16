import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import nodemailer from 'nodemailer';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, org, message } = body;

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Name, email, and message are required' },
        { status: 400 }
      );
    }

    const serviceId = process.env.EMAILJS_SERVICE_ID;
    const templateId = process.env.EMAILJS_TEMPLATE_ID;
    const publicKey = process.env.EMAILJS_PUBLIC_KEY;
    const privateKey = process.env.EMAILJS_PRIVATE_KEY;

    // 1. Try EmailJS first if configured
    if (serviceId && templateId && publicKey) {
      const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          service_id: serviceId,
          template_id: templateId,
          user_id: publicKey,
          ...(privateKey ? { accessToken: privateKey } : {}),
          template_params: {
            from_name: name,
            from_email: email,
            org_name: org || 'N/A',
            message: message,
            to_email: 'codecreststudion@gmail.com',
          },
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`EmailJS failed: ${errorText}`);
      }

      return NextResponse.json({ success: true, message: 'Message sent via EmailJS.' });
    }

    // 2. Fallback to SMTP/Nodemailer
    const settings = await prisma.platformSettings.findUnique({
      where: { id: 'default' },
    });

    if (!settings || !settings.smtpHost || !settings.smtpUser || !settings.smtpPass) {
      return NextResponse.json(
        { error: 'Mailer is not configured. Please define EmailJS environment variables or configure SMTP settings in the dashboard.' },
        { status: 500 }
      );
    }

    const transporter = nodemailer.createTransport({
      host: settings.smtpHost,
      port: settings.smtpPort || 587,
      secure: settings.smtpPort === 465, // true for 465, false for other ports
      auth: {
        user: settings.smtpUser,
        pass: settings.smtpPass,
      },
    });

    // Send the email
    await transporter.sendMail({
      from: `"${settings.systemName || 'Clientoq'} Contact Form" <${settings.smtpFrom || settings.smtpUser}>`,
      to: 'codecreststudion@gmail.com', // Explicitly asked to send to this email
      subject: `New Contact Inquiry from ${name}`,
      text: `
You have received a new contact inquiry:

Name: ${name}
Email: ${email}
Organization: ${org || 'N/A'}

Message:
${message}
      `,
      html: `
        <div style="font-family: sans-serif; padding: 20px; line-height: 1.5;">
          <h2 style="color: #333;">New Contact Inquiry</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Organization:</strong> ${org || 'N/A'}</p>
          <hr style="border: 1px solid #eee; margin: 20px 0;" />
          <h3 style="color: #333;">Message:</h3>
          <p style="white-space: pre-wrap;">${message}</p>
        </div>
      `,
    });

    return NextResponse.json({ success: true, message: 'Message sent via SMTP.' });
  } catch (error: any) {
    console.error('Contact form email error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to send message.' },
      { status: 500 }
    );
  }
}
