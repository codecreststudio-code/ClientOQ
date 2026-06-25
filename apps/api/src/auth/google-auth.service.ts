import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { JwtService } from '@nestjs/jwt';
import { OAuth2Client } from 'google-auth-library';

const SUPER_ADMIN_EMAILS = (process.env.SUPER_ADMIN_EMAILS || '').split(',').map(e => e.trim().toLowerCase()).filter(Boolean);

@Injectable()
export class GoogleAuthService {
  private oauthClient: OAuth2Client;

  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService
  ) {
    this.oauthClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
  }

  async loginWithGoogle(idToken: string) {
    // Verify the Google ID token
    let ticket: any;
    try {
      ticket = await this.oauthClient.verifyIdToken({
        idToken,
        audience: process.env.GOOGLE_CLIENT_ID,
      });
    } catch (err) {
      throw new UnauthorizedException('Invalid Google ID token');
    }

    const payload = ticket.getPayload();
    if (!payload || !payload.email) {
      throw new BadRequestException('Google token payload is missing email');
    }

    const { email, given_name, family_name, sub: googleSub } = payload;
    const firstName = given_name || email.split('@')[0];
    const lastName = family_name || '';

    // Check if this email should be SuperAdmin
    const isSuperAdmin = SUPER_ADMIN_EMAILS.includes(email.toLowerCase());

    // Find or create user
    let user = await this.prisma.user.findUnique({
      where: { email },
      include: { organization: true }
    });

    if (!user) {
      // Auto-create org for new Google users (unless SuperAdmin — they have no org)
      let orgId: string | null = null;

      if (!isSuperAdmin) {
        // Create a default organization for new Google users
        const orgName = `${firstName}'s Agency`;
        const slug = email.split('@')[0].toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Date.now();
        const org = await this.prisma.organization.create({
          data: { name: orgName, slug }
        });
        orgId = org.id;
      }

      const bcrypt = await import('bcrypt');
      const crypto = await import('crypto');
      const randomPass = crypto.randomBytes(32).toString('hex');
      const passwordHash = await bcrypt.hash(randomPass, 12);

      user = await this.prisma.user.create({
        data: {
          email,
          firstName,
          lastName,
          passwordHash,
          organizationId: orgId,
          role: isSuperAdmin ? 'SuperAdmin' : 'Owner',
          status: 'Active',
          isEmailVerified: true // Google verifies email for us
        },
        include: { organization: true }
      });
    } else if (isSuperAdmin && user.role !== 'SuperAdmin') {
      // Auto-promote to SuperAdmin if this is the designated email
      user = await this.prisma.user.update({
        where: { id: user.id },
        data: { role: 'SuperAdmin', isEmailVerified: true },
        include: { organization: true }
      }) as any;
    }

    const jwtPayload = {
      sub: user.id,
      email: user.email,
      orgId: user.organizationId,
      role: user.role
    };

    const token = this.jwtService.sign(jwtPayload);

    return {
      token,
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        organizationId: user.organizationId,
        organizationName: (user as any).organization?.name || null,
        isEmailVerified: user.isEmailVerified
      }
    };
  }
}
