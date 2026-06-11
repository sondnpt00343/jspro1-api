import cookie from "@fastify/cookie";
import cors from "@fastify/cors";
import helmet from "@fastify/helmet";
import rateLimit from "@fastify/rate-limit";
import swagger from "@fastify/swagger";
import swaggerUi from "@fastify/swagger-ui";
import type { PrismaClient } from "@prisma/client";
import Fastify from "fastify";
import { env, isTest } from "./config/env.js";
import { registerErrorHandler } from "./lib/error-handler.js";
import { registerAuth } from "./plugins/auth.js";
import { registerPrisma } from "./plugins/prisma.js";
import { authRoutes } from "./modules/auth/routes.js";
import { categoryRoutes } from "./modules/categories/routes.js";
import { contactRoutes } from "./modules/contact/routes.js";
import { healthRoutes } from "./modules/health/routes.js";
import { homeRoutes } from "./modules/home/routes.js";
import { mediaRoutes } from "./modules/media/routes.js";
import { mePostRoutes } from "./modules/me-posts/routes.js";
import { pageRoutes } from "./modules/pages/routes.js";
import { postRoutes } from "./modules/posts/routes.js";
import { siteRoutes } from "./modules/site/routes.js";
import { tagRoutes } from "./modules/tags/routes.js";

export type BuildAppOptions = {
  prisma?: PrismaClient;
  logger?: boolean;
};

export async function buildApp(options: BuildAppOptions = {}) {
  const app = Fastify({
    logger: options.logger ?? !isTest(),
    trustProxy: true
  });

  registerErrorHandler(app);
  registerPrisma(app, options.prisma);

  await app.register(helmet, {
    contentSecurityPolicy: false,
    referrerPolicy: {
      policy: "strict-origin-when-cross-origin"
    },
    strictTransportSecurity: {
      maxAge: 63072000,
      includeSubDomains: true,
      preload: true
    },
    xFrameOptions: {
      action: "deny"
    }
  });
  await app.register(cors, {
    credentials: true,
    origin(origin, callback) {
      if (!origin || env.CORS_ORIGINS.includes(origin)) {
        callback(null, true);
        return;
      }
      callback(new Error("Origin is not allowed"), false);
    }
  });
  await app.register(cookie);
  await app.register(rateLimit, {
    max: env.RATE_LIMIT_MAX,
    timeWindow: env.RATE_LIMIT_WINDOW
  });
  await app.register(swagger, {
    openapi: {
      info: {
        title: "Vite Blog API",
        version: "0.1.0"
      }
    }
  });
  await app.register(swaggerUi, {
    routePrefix: "/docs"
  });

  registerAuth(app);

  await app.register(healthRoutes);
  await app.register(siteRoutes, { prefix: "/api" });
  await app.register(pageRoutes, { prefix: "/api/pages" });
  await app.register(homeRoutes, { prefix: "/api" });
  await app.register(categoryRoutes, { prefix: "/api/categories" });
  await app.register(tagRoutes, { prefix: "/api/tags" });
  await app.register(postRoutes, { prefix: "/api/posts" });
  await app.register(authRoutes, { prefix: "/api/auth" });
  await app.register(mePostRoutes, { prefix: "/api/me" });
  await app.register(contactRoutes, { prefix: "/api" });
  await app.register(mediaRoutes, { prefix: "/api/media-assets" });

  return app;
}
