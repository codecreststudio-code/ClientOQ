import "./instrument";

import * as fs from "fs";
import * as path from "path";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ValidationPipe } from "@nestjs/common";
import helmet from "helmet";
import { GlobalHttpExceptionFilter } from "./common/http-exception.filter";
import { Logger } from "nestjs-pino";

function loadEnv() {
  let currentDir = __dirname;
  while (currentDir) {
    const envPath = path.join(currentDir, ".env");
    if (fs.existsSync(envPath)) {
      console.log(`Loading environment from: ${envPath}`);
      try {
        if (typeof process.loadEnvFile === "function") {
          process.loadEnvFile(envPath);
        } else {
          const content = fs.readFileSync(envPath, "utf8");
          for (const line of content.split("\n")) {
            const trimmed = line.trim();
            if (trimmed && !trimmed.startsWith("#")) {
              const equalIdx = trimmed.indexOf("=");
              if (equalIdx > 0) {
                const key = trimmed.slice(0, equalIdx).trim();
                let val = trimmed.slice(equalIdx + 1).trim();
                if (
                  (val.startsWith('"') && val.endsWith('"')) ||
                  (val.startsWith("'") && val.endsWith("'"))
                ) {
                  val = val.slice(1, -1);
                }
                process.env[key] = val;
              }
            }
          }
        }
      } catch (err) {
        console.error(`Error loading env file:`, err);
      }
      break;
    }
    const parentDir = path.dirname(currentDir);
    if (parentDir === currentDir) {
      break;
    }
    currentDir = parentDir;
  }
}
loadEnv();

function validateEnvironment() {
  const required = ['DATABASE_URL', 'JWT_SECRET'];
  const missing = required.filter(key => !process.env[key]);
  if (missing.length > 0) {
    throw new Error(`CRITICAL CONFIG ERROR: Missing required environment variables: ${missing.join(', ')}`);
  }

  if (process.env.NODE_ENV === 'production') {
    const secret = process.env.JWT_SECRET;
    if (!secret || secret.includes('development') || secret.length < 32) {
      throw new Error('CRITICAL CONFIG ERROR: JWT_SECRET must be a strong 32+ character secret in production.');
    }
  }
}
validateEnvironment();

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });
  app.useLogger(app.get(Logger));

  app.use(helmet());

  const allowedOrigins = process.env.ALLOWED_ORIGINS
    ? process.env.ALLOWED_ORIGINS.split(",")
    : ["http://localhost:3000", "http://127.0.0.1:3000", "https://client-oq.vercel.app"];

  app.enableCors({
    origin: allowedOrigins,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  app.useGlobalFilters(new GlobalHttpExceptionFilter());

  const port = process.env.PORT || 3001;
  await app.listen(port);
  console.log(`Clientoq API running on http://localhost:${port}`);
}
bootstrap();