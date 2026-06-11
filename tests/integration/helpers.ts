import { PrismaClient } from "@prisma/client";
import type { FastifyInstance } from "fastify";
import { afterAll, beforeAll, describe } from "vitest";
import { buildApp } from "../../src/app.js";

export function isSafeIntegrationDatabase(url = process.env.DATABASE_URL ?? "") {
  return url.includes("jspro1_api_test") && (url.includes("localhost:55432") || url.includes("postgres-test:5432"));
}

export const describeDb = isSafeIntegrationDatabase() ? describe : describe.skip;

export function useIntegrationApp() {
  let prisma: PrismaClient;
  let app: FastifyInstance;

  beforeAll(async () => {
    prisma = new PrismaClient();
    app = await buildApp({
      prisma,
      logger: false
    });
    await app.ready();

    const pages = await prisma.page.count();
    if (pages === 0) {
      throw new Error("Integration DB is empty. Run npm run db:deploy and npm run db:seed against the test DB first.");
    }
  });

  afterAll(async () => {
    await app.close();
  });

  return {
    get app() {
      return app;
    },
    get prisma() {
      return prisma;
    }
  };
}

export function extractCookie(headers: Record<string, unknown>): string {
  const raw = headers["set-cookie"];
  const value = Array.isArray(raw) ? raw[0] : raw;
  if (typeof value !== "string") {
    throw new Error("Missing set-cookie header.");
  }

  return value.split(";")[0];
}
