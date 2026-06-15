import { Controller, Get } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Controller('api')
export class HealthController {
  constructor(private prisma: PrismaService) {}

  @Get('health')
  async health() {
    let dbStatus = 'connected';
    try {
      await this.prisma.$queryRaw`SELECT 1`;
    } catch {
      dbStatus = 'disconnected';
    }

    return {
      status: dbStatus === 'connected' ? 'ok' : 'degraded',
      db: dbStatus,
      uptime: Math.floor(process.uptime()),
      timestamp: new Date().toISOString(),
      version: process.env.npm_package_version || '1.0.0',
      environment: process.env.NODE_ENV || 'development',
    };
  }
}
