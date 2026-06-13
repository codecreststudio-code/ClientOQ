import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { PrismaService } from './prisma.service';
import { AuthService } from './auth/auth.service';
import { MailService } from './mail/mail.service';
import { AuthController } from './auth/auth.controller';
import { CrmController } from './crm/crm.controller';
import { ClientsController } from './clients/clients.controller';
import { ProjectsController } from './projects/projects.controller';
import { FinanceController } from './finance/finance.controller';
import { FinanceWebhookController } from './finance/finance-webhook.controller';
import { WhatsappController } from './whatsapp/whatsapp.controller';
import { WhatsappWebhookController } from './whatsapp/whatsapp-webhook.controller';
import { AiController } from './ai/ai.controller';
import { AutomationsController } from './automations/automations.controller';
import { AnalyticsController } from './analytics/analytics.controller';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'super-secret-key-agencyos-ai-2026-development',
      signOptions: { expiresIn: '7d' },
    }),
    ThrottlerModule.forRoot([{
      ttl: 60000,
      limit: 100,
    }]),
  ],
  controllers: [
    AuthController,
    CrmController,
    ClientsController,
    ProjectsController,
    FinanceController,
    FinanceWebhookController,
    WhatsappController,
    WhatsappWebhookController,
    AiController,
    AutomationsController,
    AnalyticsController,
  ],
  providers: [
    PrismaService,
    AuthService,
    MailService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
