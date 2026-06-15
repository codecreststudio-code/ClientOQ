import { Module } from "@nestjs/common";
import { APP_FILTER, APP_GUARD } from "@nestjs/core";
import { JwtModule } from "@nestjs/jwt";
import { ThrottlerModule, ThrottlerGuard } from "@nestjs/throttler";
import { LoggerModule } from "nestjs-pino";
import { SentryModule, SentryGlobalFilter } from "@sentry/nestjs/setup";
import { GlobalHttpExceptionFilter } from "./common/http-exception.filter";
import { PrismaService } from "./prisma.service";
import { AuthService } from "./auth/auth.service";
import { MailService } from "./mail/mail.service";
import { AuthController } from "./auth/auth.controller";
import { GoogleAuthController } from "./auth/google-auth.controller";
import { GoogleAuthService } from "./auth/google-auth.service";
import { UserInviteController } from "./auth/user-invite.controller";
import { CrmController } from "./crm/crm.controller";
import { ClientsController } from "./clients/clients.controller";
import { ProjectsController } from "./projects/projects.controller";
import { FinanceController } from "./finance/finance.controller";
import { FinanceWebhookController } from "./finance/finance-webhook.controller";
import { WhatsappController } from "./whatsapp/whatsapp.controller";
import { WhatsappWebhookController } from "./whatsapp/whatsapp-webhook.controller";
import { AiController } from "./ai/ai.controller";
import { AutomationsController } from "./automations/automations.controller";
import { AnalyticsController } from "./analytics/analytics.controller";
import { SearchController } from "./search/search.controller";
import { TimeLogsController } from "./projects/time-logs.controller";
import { NotificationsController } from "./notifications/notifications.controller";
import { ProposalsController } from "./crm/proposals.controller";
import { FilesController } from "./files/files.controller";
import { ReportsController } from "./analytics/reports.controller";
import { ImportController } from "./crm/import.controller";
import { HealthController } from "./common/health.controller";

@Module({
  imports: [
    SentryModule.forRoot(),
    LoggerModule.forRoot({
      pinoHttp: {
        transport:
          process.env.NODE_ENV !== "production"
            ? { target: "pino-pretty", options: { colorize: true } }
            : undefined,
        level: process.env.NODE_ENV !== "production" ? "debug" : "info",
      },
    }),
    JwtModule.register({
      secret: (() => {
        const secret = process.env.JWT_SECRET;
        if (!secret || secret.includes("development") || secret.length < 32) {
          if (process.env.NODE_ENV === "production") {
            throw new Error(
              "JWT_SECRET must be a strong 32+ char secret in production. Set it in your environment.",
            );
          }
          console.warn(
            "[WARN] Using weak JWT_SECRET — set a strong one before deploying to production!",
          );
        }
        return (
          secret || "super-secret-key-clientoq-ai-2026-development"
        );
      })(),
      signOptions: { expiresIn: process.env.JWT_EXPIRY || "15m" },
    }),
    ThrottlerModule.forRoot([
      {
        ttl: parseInt(process.env.THROTTLE_TTL_MS || "60000"),
        limit: parseInt(process.env.THROTTLE_LIMIT || "200"),
      },
    ]),
  ],
  controllers: [
    AuthController,
    GoogleAuthController,
    UserInviteController,
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
    SearchController,
    TimeLogsController,
    NotificationsController,
    ProposalsController,
    FilesController,
    ReportsController,
    ImportController,
    HealthController,
  ],
  providers: [
    PrismaService,
    AuthService,
    GoogleAuthService,
    MailService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    {
      provide: APP_FILTER,
      useClass: SentryGlobalFilter,
    },
    {
      provide: APP_FILTER,
      useClass: GlobalHttpExceptionFilter,
    },
  ],
})
export class AppModule {}