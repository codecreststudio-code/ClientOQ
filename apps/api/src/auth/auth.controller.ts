import { Controller, Post, Body, Get, Put, UseGuards, Request, Query, Res } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { AuthService } from './auth.service';
import { AuthGuard } from './auth.guard';
import { LoginDto, RegisterDto } from './dto/auth.dto';
import { Response } from 'express';

@Controller('api/auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  async login(@Body() body: LoginDto, @Request() req: any) {
    const ip = req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    return this.authService.login(body, ip);
  }

  @Post('register')
  @Throttle({ default: { limit: 3, ttl: 60000 } })
  async register(@Body() body: RegisterDto) {
    return this.authService.register(body);
  }

  @Get('verify-email')
  async verifyEmail(@Query('token') token: string, @Res() res: Response) {
    const success = await this.authService.verifyEmail(token);
    const redirectUrl = `${process.env.NEXT_PUBLIC_API_URL?.replace('3001', '3000') || 'http://localhost:3000'}/?verified=${success}`;
    return res.redirect(redirectUrl);
  }

  @Post('resend-verification')
  @UseGuards(AuthGuard)
  @Throttle({ default: { limit: 2, ttl: 60000 } })
  async resendVerification(@Request() req: any) {
    return this.authService.resendVerification(req.user.id);
  }

  @Get('me')
  @UseGuards(AuthGuard)
  async me(@Request() req: any) {
    const user = await this.authService.getMe(req.user.id);
    return { user };
  }

  @Get('users')
  @UseGuards(AuthGuard)
  async getUsers(@Request() req: any): Promise<any> {
    const orgId = req.user.orgId;
    return this.authService.getUsersByOrg(orgId);
  }

  @Put('profile')
  @UseGuards(AuthGuard)
  async updateProfile(@Request() req: any, @Body() body: any): Promise<any> {
    const userId = req.user.id;
    return this.authService.updateProfile(userId, body);
  }

  @Post('forgot-password')
  @Throttle({ default: { limit: 3, ttl: 60000 } })
  async forgotPassword(@Body() body: { email: string }) {
    return this.authService.forgotPassword(body.email);
  }

  @Post('reset-password')
  @Throttle({ default: { limit: 3, ttl: 60000 } })
  async resetPassword(@Body() body: { token: string; newPassword: string }) {
    return this.authService.resetPassword(body.token, body.newPassword);
  }

  @Post('refresh')
  @UseGuards(AuthGuard)
  async refresh(@Request() req: any) {
    const { id, orgId, role, email } = req.user;
    return this.authService.refreshToken(id, orgId, role, email);
  }
}
