import { Type, type Static } from "@sinclair/typebox";
import type { FastifyPluginAsync } from "fastify";
import { notFound } from "../../lib/api-error.js";
import { SLUG_PATTERN } from "../../lib/slug.js";
import { toPageContent } from "../../lib/serializers.js";

const PageParams = Type.Object({
  slug: Type.String({ pattern: SLUG_PATTERN.source })
});

export const pageRoutes: FastifyPluginAsync = async (app) => {
  app.get<{ Params: Static<typeof PageParams> }>(
    "/:slug",
    {
      schema: {
        params: PageParams
      }
    },
    async (request) => {
      const page = await app.prisma.page.findFirst({
        where: {
          slug: request.params.slug,
          status: "published"
        }
      });

      if (!page) {
        throw notFound("Không tìm thấy trang.");
      }

      return {
        page: toPageContent(page)
      };
    }
  );
};
