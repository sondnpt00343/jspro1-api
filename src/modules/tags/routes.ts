import type { FastifyPluginAsync } from "fastify";
import { toTagSummary } from "../../lib/serializers.js";

export const tagRoutes: FastifyPluginAsync = async (app) => {
  app.get("/", async () => {
    const tags = await app.prisma.tag.findMany({
      where: {
        isActive: true
      },
      orderBy: [{ sortOrder: "asc" }, { name: "asc" }]
    });

    return {
      tags: tags.map(toTagSummary)
    };
  });
};
