import { Type, type Static } from "@sinclair/typebox";
import type { FastifyPluginAsync } from "fastify";
import { notFound } from "../../lib/api-error.js";
import { postCardInclude, postDetailInclude, publicPostOrderBy, publicPostWhere } from "../../lib/includes.js";
import { SLUG_PATTERN } from "../../lib/slug.js";
import { toPostCard, toPostDetail } from "../../lib/serializers.js";

const PostParams = Type.Object({
  slug: Type.String({ pattern: SLUG_PATTERN.source })
});

export const postRoutes: FastifyPluginAsync = async (app) => {
  app.get<{ Params: Static<typeof PostParams> }>(
    "/:slug",
    {
      schema: {
        params: PostParams
      }
    },
    async (request) => {
      const post = await app.prisma.post.findFirst({
        where: {
          ...publicPostWhere,
          slug: request.params.slug
        },
        include: postDetailInclude
      });

      if (!post) {
        throw notFound("Không tìm thấy bài viết.");
      }

      const directRelations = await app.prisma.postRelation.findMany({
        where: {
          postId: post.id,
          relatedPost: publicPostWhere
        },
        include: {
          relatedPost: {
            include: postCardInclude
          }
        },
        orderBy: [{ sortOrder: "asc" }],
        take: 6
      });

      let relatedPosts = directRelations.map((relation) => relation.relatedPost);

      if (relatedPosts.length === 0) {
        relatedPosts = await app.prisma.post.findMany({
          where: {
            ...publicPostWhere,
            categoryId: post.categoryId,
            id: {
              not: post.id
            }
          },
          include: postCardInclude,
          orderBy: publicPostOrderBy,
          take: 3
        });
      }

      return {
        post: toPostDetail(post, relatedPosts),
        relatedPosts: relatedPosts.map(toPostCard)
      };
    }
  );
};
