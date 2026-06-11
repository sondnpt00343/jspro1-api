import type { PrismaClient } from "@prisma/client";
import type { UserSummarySource } from "../types/user.js";

declare module "fastify" {
  interface FastifyInstance {
    prisma: PrismaClient;
    authenticateOptional: (request: import("fastify").FastifyRequest) => Promise<void>;
    requireAuth: (request: import("fastify").FastifyRequest) => Promise<UserSummarySource>;
  }

  interface FastifyRequest {
    currentUser?: UserSummarySource;
    currentSessionId?: string;
  }
}
