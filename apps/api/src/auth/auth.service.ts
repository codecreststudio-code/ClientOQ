import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { JwtService } from '@nestjs/jwt';
import { MailService } from '../mail/mail.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private mailService: MailService
  ) {}

  async login(body: any) {
    const { email, password } = body;
    const user = await this.prisma.user.findUnique({
      where: { email },
      include: { organization: true }
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

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
        organizationName: user.organization?.name || null
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

    const user = await this.prisma.user.create({
      data: {
        organizationId: org.id,
        firstName,
        lastName,
        email,
        phone,
        passwordHash,
        role: 'Owner',
        status: 'Active'
      }
    });

    // Dispatch welcome email asynchronously
    this.mailService.sendWelcomeEmail(user.email, `${firstName} ${lastName}`, orgName).catch(err => {
      console.error('Failed to send welcome email:', err);
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
        organizationName: org.name
      }
    };
  }
}
