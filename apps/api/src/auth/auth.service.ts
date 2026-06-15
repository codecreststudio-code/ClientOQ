import { Injectable, UnauthorizedException, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { JwtService } from '@nestjs/jwt';
import { MailService } from '../mail/mail.service';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private mailService: MailService
  ) {}

  async login(body: any, ipAddress?: string) {
    const { email, password } = body;
    const user = await this.prisma.user.findUnique({
      where: { email },
      include: { organization: true }
    });

    if (!user) {
      await this.prisma.loginAttempt.create({
        data: {
          email,
          ipAddress: ipAddress || null,
          success: false
        }
      });
      throw new UnauthorizedException('Invalid credentials');
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      await this.prisma.loginAttempt.create({
        data: {
          email,
          ipAddress: ipAddress || null,
          success: false
        }
      });
      throw new UnauthorizedException('Invalid credentials');
    }

    // Success
    await this.prisma.loginAttempt.create({
      data: {
        email,
        ipAddress: ipAddress || null,
        success: true
      }
    });

    const payload = {
      sub: user.id,
      email: user.email,
      orgId: user.organizationId,
      role: user.role
    };

    const token = this.jwtService.sign(payload);

    return {
      token,
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        organizationId: user.organizationId,
        organizationName: user.organization?.name || null,
        isEmailVerified: user.isEmailVerified
      }
    };
  }

  async register(body: any) {
    const { orgName, firstName, lastName, email, password, phone } = body;

    const existingUser = await this.prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      throw new BadRequestException('Email already registered');
    }

    // Slugify orgName
    const slug = orgName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

    const org = await this.prisma.organization.create({
      data: {
        name: orgName,
        slug
      }
    });

    const passwordHash = await bcrypt.hash(password, 12);
    const emailVerificationToken = crypto.randomBytes(32).toString('hex');

    const user = await this.prisma.user.create({
      data: {
        organizationId: org.id,
        firstName,
        lastName,
        email,
        phone,
        passwordHash,
        role: 'Owner',
        status: 'Active',
        isEmailVerified: false,
        emailVerificationToken
      }
    });

    // Dispatch welcome email asynchronously
    this.mailService.sendWelcomeEmail(user.email, `${firstName} ${lastName}`, orgName).catch(err => {
      console.error('Failed to send welcome email:', err);
    });

    // Send verification email
    const verificationUrl = `${process.env.NEXT_PUBLIC_API_URL?.replace('3001', '3000') || 'http://localhost:3000'}/api/auth/verify-email?token=${emailVerificationToken}`;
    this.mailService.sendMail(
      user.email,
      'Verify your AgencyOS email',
      `Hi ${firstName},\n\nWelcome to AgencyOS! Please click the link below to verify your email address:\n\n${verificationUrl}\n\nThank you,\nAgencyOS Team`
    ).catch(err => {
      console.error('Failed to send verification email:', err);
    });

    const payload = {
      sub: user.id,
      email: user.email,
      orgId: org.id,
      role: user.role
    };

    const token = this.jwtService.sign(payload);

    return {
      token,
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        organizationId: org.id,
        organizationName: org.name,
        isEmailVerified: false
      }
    };
  }

  async getUsersByOrg(orgId: string) {
    return this.prisma.user.findMany({
      where: { organizationId: orgId },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        role: true,
        status: true,
        lastLogin: true,
        timezone: true
      },
      orderBy: { firstName: 'asc' }
    });
  }

  async getMe(userId: string): Promise<any> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { organization: true }
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      organizationId: user.organizationId,
      organizationName: user.organization?.name || null,
      isEmailVerified: user.isEmailVerified,
      phone: user.phone,
      bio: user.bio,
      timezone: user.timezone,
      notificationPreferences: user.notificationPreferences
    };
  }

  async updateProfile(userId: string, body: any): Promise<any> {
    const { phone, bio, timezone, notificationPreferences } = body;
    const updated = await this.prisma.user.update({
      where: { id: userId },
      data: {
        phone,
        bio,
        timezone,
        notificationPreferences
      }
    });
    return {
      id: updated.id,
      firstName: updated.firstName,
      lastName: updated.lastName,
      email: updated.email,
      role: updated.role,
      phone: updated.phone,
      bio: updated.bio,
      timezone: updated.timezone,
      notificationPreferences: updated.notificationPreferences
    };
  }

  // ─── Password Reset Flow ───────────────────────────────────────────

  async forgotPassword(email: string) {
    // Always return success to prevent email enumeration
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) {
      return { success: true, message: 'If that email is registered, a reset link has been sent.' };
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    // Store token in UserSession table as reset record
    await this.prisma.userSession.create({
      data: {
        userId: user.id,
        deviceInfo: `password-reset:${resetToken}`,
        expiresAt,
      }
    });

    const resetUrl = `${process.env.NEXT_PUBLIC_API_URL?.replace('3001', '3000') || 'http://localhost:3000'}/?auth=reset&token=${resetToken}`;

    await this.mailService.sendMail(
      user.email,
      'Reset your AgencyOS password',
      `Hi ${user.firstName},\n\nClick the link below to reset your password (valid for 1 hour):\n\n${resetUrl}\n\nIf you did not request this, ignore this email.\n\nAgencyOS Team`
    );

    return { success: true, message: 'If that email is registered, a reset link has been sent.' };
  }

  async resetPassword(token: string, newPassword: string) {
    if (!newPassword || newPassword.length < 8) {
      throw new BadRequestException('Password must be at least 8 characters.');
    }

    const session = await this.prisma.userSession.findFirst({
      where: {
        deviceInfo: { startsWith: 'password-reset:' },
        expiresAt: { gt: new Date() }
      }
    });

    // Find the one matching this token
    const sessions = await this.prisma.userSession.findMany({
      where: { deviceInfo: `password-reset:${token}`, expiresAt: { gt: new Date() } }
    });

    if (!sessions.length) {
      throw new BadRequestException('Invalid or expired reset token.');
    }

    const resetSession = sessions[0];
    const passwordHash = await bcrypt.hash(newPassword, 12);

    await this.prisma.user.update({
      where: { id: resetSession.userId },
      data: { passwordHash }
    });

    // Invalidate the reset token
    await this.prisma.userSession.delete({ where: { id: resetSession.id } });

    return { success: true, message: 'Password reset successfully. You can now log in.' };
  }

  // ─── Refresh Token ────────────────────────────────────────────────

  async refreshToken(userId: string, orgId: string, role: string, email: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user || user.status !== 'Active') {
      throw new UnauthorizedException('User not found or inactive.');
    }

    const payload = { sub: user.id, email: user.email, orgId, role };
    const token = this.jwtService.sign(payload);

    return { token };
  }

  async verifyEmail(token: string): Promise<boolean> {
    if (!token) {
      return false;
    }
    const user = await this.prisma.user.findFirst({
      where: { emailVerificationToken: token }
    });

    if (!user) {
      return false;
    }

    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        isEmailVerified: true,
        emailVerificationToken: null
      }
    });

    return true;
  }

  async resendVerification(userId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    if (user.isEmailVerified) {
      throw new BadRequestException('Email is already verified');
    }

    const emailVerificationToken = crypto.randomBytes(32).toString('hex');
    await this.prisma.user.update({
      where: { id: user.id },
      data: { emailVerificationToken }
    });

    const verificationUrl = `${process.env.NEXT_PUBLIC_API_URL?.replace('3001', '3000') || 'http://localhost:3000'}/api/auth/verify-email?token=${emailVerificationToken}`;
    
    await this.mailService.sendMail(
      user.email,
      'Verify your AgencyOS email',
      `Hi ${user.firstName},\n\nPlease click the link below to verify your email address:\n\n${verificationUrl}\n\nThank you,\nAgencyOS Team`
    );

    return { success: true, message: 'Verification email sent' };
  }
}
