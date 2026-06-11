import type { FastifyPluginAsync } from "fastify";
import { notFound } from "../../lib/api-error.js";
import { mediaInclude, postCardInclude, publicPostOrderBy, publicPostWhere } from "../../lib/includes.js";
import { toMediaAsset, toPageContent, toPostCard, toTagSummary } from "../../lib/serializers.js";

export const homeRoutes: FastifyPluginAsync = async (app) => {
  app.get("/home", async () => {
    const [page, heroSlides, latestPosts, topicTags] = await Promise.all([
      app.prisma.page.findFirst({
        where: {
          slug: "home",
          status: "published"
        }
      }),
      app.prisma.heroSlide.findMany({
        where: {
          page: {
            slug: "home"
          },
          isActive: true
        },
        include: {
          media: {
            include: mediaInclude
          }
        },
        orderBy: [{ sortOrder: "asc" }]
      }),
      app.prisma.post.findMany({
        where: publicPostWhere,
        include: postCardInclude,
        orderBy: publicPostOrderBy,
        take: 12
      }),
      app.prisma.tag.findMany({
        where: {
          isActive: true
        },
        orderBy: [{ sortOrder: "asc" }, { name: "asc" }]
      })
    ]);

    if (!page) {
      throw notFound("Không tìm thấy dữ liệu trang chủ.");
    }

    return {
      page: toPageContent(page),
      heroSlides: heroSlides.map((slide) => ({
        id: slide.id,
        title: slide.title,
        subtitle: slide.subtitle,
        linkUrl: slide.linkUrl,
        media: toMediaAsset(slide.media),
        sortOrder: slide.sortOrder
      })),
      latestPosts: latestPosts.map(toPostCard),
      topicTags: topicTags.map(toTagSummary)
    };
  });
};
