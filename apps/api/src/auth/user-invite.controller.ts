import { Controller, Post, Body, Get, Param, UseGuards, Request, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { AuthGuard } from './auth.guard';
import { RolesGuard } from './roles.guard';
import { Roles } from './roles.decorator';
import { MailService } from '../mail/mail.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';

@Controller('api/auth/invites')
export class UserInviteController {
  constructor(
    private prisma: PrismaService,
    private mailService: MailService,
    private jwtService: JwtService
  ) {}

  @Post('create')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('Owner', 'Manager')
  async createInvite(@Request() req: any, @Body() body: any) {
    const orgId = req.user.orgId;
    const { email, role } = body;

    if (!email || !role) {
      throw new BadRequestException('Email and role are required');
    }

    const userExists = await this.prisma.user.findUnique({ where: { email } });
    if (userExists) {
      throw new BadRequestException('User with this email already exists');
    }

    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    const invite = await this.prisma.userInvite.create({
      data: {
        organizationId: orgId,
        email,
        role,
        token,
        invitedBy: req.user.id,
        status: 'Pending',
        expiresAt
      },
      include: {
        organization: true
      }
    });

    const inviteLink = `${process.env.NEXT_PUBLIC_API_URL?.replace('3001', '3000') || 'https://client-oq.vercel.app'}/?auth=register&inviteToken=${token}`;

    await this.mailService.sendMail(
      email,
      `You are invited to join ${invite.organization.name} on Clientoq`,
      `Hello,\n\nYou have been invited to join ${invite.organization.name} as a ${role}.\n\nClick the link below to accept the invitation:\n${inviteLink}\n\nThis invitation expires in 7 days.`
    );

    return {
      message: 'Invitation sent successfully',
      invite: {
        id: invite.id,
        email: invite.email,
        role: invite.role,
        status: invite.status,
        expiresAt: invite.expiresAt,
      }
    };
  }

  @Get('list')
  @UseGuards(AuthGuard)
  async listInvites(@Request() req: any) {
    const orgId = req.user.orgId;
    return this.prisma.userInvite.findMany({
      where: { organizationId: orgId },
      orderBy: { createdAt: 'desc' }
    });
  }

  @Get('validate/:token')
  async validateInvite(@Param('token') token: string) {
    const invite = await this.prisma.userInvite.findUnique({
      where: { token },
      include: { organization: true }
    });

    if (!invite || invite.status !== 'Pending') {
      throw new BadRequestException('Invalid or expired invitation');
    }

    if (new Date() > invite.expiresAt) {
      await this.prisma.userInvite.update({
        where: { id: invite.id },
        data: { status: 'Expired' }
      });
      throw new BadRequestException('Invitation has expired');
    }

    return {
      email: invite.email,
      role: invite.role,
      organizationName: invite.organization.name
    };
  }

  @Post('accept')
  async acceptInvite(@Body() body: any) {
    const { token, firstName, lastName, password, phone } = body;

    const invite = await this.prisma.userInvite.findUnique({
      where: { token },
      include: { organization: true }
    });

    if (!invite || invite.status !== 'Pending' || new Date() > invite.expiresAt) {
      throw new BadRequestException('Invalid or expired invitation');
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const user = await this.prisma.user.create({
      data: {
        organizationId: invite.organizationId,
        firstName,
        lastName,
        email: invite.email,
        passwordHash,
        role: invite.role,
        phone,
        status: 'Active',
        isEmailVerified: true,
        emailVerificationToken: null
      }
    });

    await this.prisma.userInvite.update({
      where: { id: invite.id },
      data: { status: 'Accepted' }
    });

    const payload = {
      sub: user.id,
      email: user.email,
      orgId: user.organizationId,
      role: user.role
    };

    const jwtToken = this.jwtService.sign(payload);

    return {
      token: jwtToken,
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        organizationId: user.organizationId,
        organizationName: invite.organization.name
      }
    };
  }
}
