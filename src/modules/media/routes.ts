import type { FastifyPluginAsync } from "fastify";
import { mediaInclude } from "../../lib/includes.js";
import { toMediaAsset } from "../../lib/serializers.js";

export const mediaRoutes: FastifyPluginAsync = async (app) => {
  app.get("/", async () => {
    const assets = await app.prisma.mediaAsset.findMany({
      include: mediaInclude,
      orderBy: [{ createdAt: "desc" }],
      take: 100
    });

    return {
      mediaAssets: assets.map(toMediaAsset)
    };
  });
};
