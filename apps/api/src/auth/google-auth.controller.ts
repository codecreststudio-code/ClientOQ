import { Controller, Post, Body, Res } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { GoogleAuthService } from './google-auth.service';
import { Response } from 'express';

@Controller('api/auth')
export class GoogleAuthController {
  constructor(private googleAuthService: GoogleAuthService) {}

  @Post('google')
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  async googleLogin(
    @Body() body: { credential: string },
    @Res({ passthrough: true }) res: Response
  ) {
    const result = await this.googleAuthService.loginWithGoogle(body.credential);
    res.cookie('clientoq_jwt', result.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 15 * 60 * 1000
    });
    return result;
  }
}
