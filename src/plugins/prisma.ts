import { PrismaClient } from "@prisma/client";
import type { FastifyInstance } from "fastify";

export function registerPrisma(app: FastifyInstance, prisma?: PrismaClient) {
  const client = prisma ?? new PrismaClient();
  app.decorate("prisma", client);

  app.addHook("onClose", async () => {
    await client.$disconnect();
  });
}
