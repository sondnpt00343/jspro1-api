import { Type, type Static } from "@sinclair/typebox";
import type { FastifyPluginAsync } from "fastify";
import { notFound } from "../../lib/api-error.js";
import { postCardInclude, publicPostOrderBy, publicPostWhere } from "../../lib/includes.js";
import { SLUG_PATTERN } from "../../lib/slug.js";
import { toCategorySummary, toPostCard } from "../../lib/serializers.js";

const CategoryParams = Type.Object({
  slug: Type.String({ pattern: SLUG_PATTERN.source })
});

const CategoryQuery = Type.Object({
  page: Type.Optional(Type.Integer({ minimum: 1, default: 1 })),
  perPage: Type.Optional(Type.Integer({ minimum: 1, maximum: 50, default: 12 }))
});

export const categoryRoutes: FastifyPluginAsync = async (app) => {
  app.get("/", async () => {
    const categories = await app.prisma.category.findMany({
      where: {
        isActive: true
      },
      orderBy: [{ sortOrder: "asc" }, { name: "asc" }]
    });

    return {
      categories: categories.map(toCategorySummary)
    };
  });

  app.get<{ Params: Static<typeof CategoryParams>; Querystring: Static<typeof CategoryQuery> }>(
    "/:slug",
    {
      schema: {
        params: CategoryParams,
        querystring: CategoryQuery
      }
    },
    async (request) => {
      const page = request.query.page ?? 1;
      const perPage = request.query.perPage ?? 12;
      const category = await app.prisma.category.findFirst({
        where: {
          slug: request.params.slug,
          isActive: true
        }
      });

      if (!category) {
        throw notFound("Không tìm thấy danh mục.");
      }

      const where = {
        ...publicPostWhere,
        categoryId: category.id
      };
      const [total, posts] = await Promise.all([
        app.prisma.post.count({ where }),
        app.prisma.post.findMany({
          where,
          include: postCardInclude,
          orderBy: publicPostOrderBy,
          skip: (page - 1) * perPage,
          take: perPage
        })
      ]);

      return {
        category: toCategorySummary(category),
        posts: posts.map(toPostCard),
        pagination: {
          page,
          perPage,
          total
        }
      };
    }
  );
};
