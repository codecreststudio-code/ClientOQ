import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    let token = '';

    const authHeader = request.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
    } else if (request.headers.cookie) {
      // Parse cookies manually to support HTTP-only cookie authentication
      const cookies = request.headers.cookie.split(';').reduce((acc, cookie) => {
        const parts = cookie.trim().split('=');
        const key = parts[0];
        const val = parts.slice(1).join('=');
        acc[key] = val;
        return acc;
      }, {} as Record<string, string>);
      token = cookies['clientoq_jwt'];
    }

    if (!token) {
      throw new UnauthorizedException('Missing or invalid auth token');
    }

    try {
      const payload = this.jwtService.verify(token);
      request.user = {
        id: payload.sub,
        email: payload.email,
        orgId: payload.orgId,
        role: payload.role
      };
      return true;
    } catch (err) {
      throw new UnauthorizedException('Token verification failed');
    }
  }
}
