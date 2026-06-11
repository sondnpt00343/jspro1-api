import { Type, type Static } from "@sinclair/typebox";
import type { FastifyPluginAsync } from "fastify";
import { badRequest, forbidden, notFound } from "../../lib/api-error.js";
import { postDetailInclude, userSummaryInclude } from "../../lib/includes.js";
import { makeUniqueSlug } from "../../lib/slug.js";
import { toPostDetail, toIso, toUserSummary } from "../../lib/serializers.js";

const UuidParams = Type.Object({
  id: Type.String({
    pattern: "^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$"
  })
});

const uuidPattern = "^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$";

const PreferenceBody = Type.Object({
  themePreference: Type.Union([Type.Literal("system"), Type.Literal("light"), Type.Literal("dark")])
});

const PostCreateBody = Type.Object({
  title: Type.String({ minLength: 1, maxLength: 220 }),
  excerpt: Type.Optional(Type.String({ maxLength: 500 })),
  bodyHtml: Type.Optional(Type.String()),
  bodyJson: Type.Optional(Type.Unknown()),
  categorySlug: Type.Optional(Type.String()),
  tagSlugs: Type.Optional(Type.Array(Type.String())),
  coverAssetId: Type.Optional(Type.String({ pattern: uuidPattern }))
});

const PostPatchBody = Type.Partial(PostCreateBody);

function toMyPost(post: {
  id: string;
  title: string;
  slug: string;
  status: string;
  updatedAt: Date;
  publishedAt: Date | null;
}) {
  return {
    id: post.id,
    title: post.title,
    slug: post.slug,
    status: post.status,
    updatedAt: post.updatedAt.toISOString(),
    publishedAt: toIso(post.publishedAt),
    viewHref: `/posts/${post.slug}`,
    editHref: `/me/posts/${post.id}/edit`
  };
}

function hasPublishableBody(post: { bodyHtml: string; bodyJson: unknown }) {
  if (post.bodyHtml.trim().length > 0) {
    return true;
  }

  return JSON.stringify(post.bodyJson ?? {}) !== "{}";
}

async function resolveCategoryId(app: Parameters<FastifyPluginAsync>[0], categorySlug?: string) {
  const category = await app.prisma.category.findFirst({
    where: {
      slug: categorySlug ?? "cong-nghe",
      isActive: true
    }
  });

  if (!category) {
    throw badRequest("Danh mục không hợp lệ.");
  }

  return category.id;
}

async function resolveTagIds(app: Parameters<FastifyPluginAsync>[0], tagSlugs?: string[]) {
  if (!tagSlugs || tagSlugs.length === 0) {
    return [];
  }

  const tags = await app.prisma.tag.findMany({
    where: {
      slug: {
        in: tagSlugs
      },
      isActive: true
    }
  });

  if (tags.length !== new Set(tagSlugs).size) {
    throw badRequest("Một hoặc nhiều tag không hợp lệ.");
  }

  return tags.map((tag) => tag.id);
}

async function ensurePostOwner(app: Parameters<FastifyPluginAsync>[0], postId: string, authorId: string) {
  const post = await app.prisma.post.findFirst({
    where: {
      id: postId,
      deletedAt: null
    }
  });

  if (!post) {
    throw notFound("Không tìm thấy bài viết.");
  }

  if (post.authorId !== authorId) {
    throw forbidden("Bạn không thể sửa bài viết của người khác.");
  }

  return post;
}

async function loadPostDetail(app: Parameters<FastifyPluginAsync>[0], id: string) {
  return app.prisma.post.findUniqueOrThrow({
    where: { id },
    include: postDetailInclude
  });
}

export const mePostRoutes: FastifyPluginAsync = async (app) => {
  app.patch<{ Body: Static<typeof PreferenceBody> }>(
    "/preferences",
    {
      schema: {
        body: PreferenceBody
      }
    },
    async (request) => {
      const user = await app.requireAuth(request);
      const updatedUser = await app.prisma.user.update({
        where: {
          id: user.id
        },
        data: {
          profile: {
            upsert: {
              create: {
                displayName: user.name,
                themePreference: request.body.themePreference
              },
              update: {
                themePreference: request.body.themePreference
              }
            }
          }
        },
        include: userSummaryInclude
      });

      return {
        user: toUserSummary(updatedUser)
      };
    }
  );

  app.get("/posts", async (request) => {
    const user = await app.requireAuth(request);
    const posts = await app.prisma.post.findMany({
      where: {
        authorId: user.id,
        deletedAt: null
      },
      orderBy: [{ updatedAt: "desc" }]
    });

    return {
      posts: posts.map(toMyPost)
    };
  });

  app.post<{ Body: Static<typeof PostCreateBody> }>(
    "/posts",
    {
      schema: {
        body: PostCreateBody
      }
    },
    async (request, reply) => {
      const user = await app.requireAuth(request);
      const title = request.body.title.trim();
      if (!title) {
        throw badRequest("Tiêu đề không được để trống.");
      }

      const [categoryId, tagIds] = await Promise.all([
        resolveCategoryId(app, request.body.categorySlug),
        resolveTagIds(app, request.body.tagSlugs)
      ]);

      const slug = await makeUniqueSlug(title, async (candidate) => {
        const existing = await app.prisma.post.findUnique({
          where: {
            slug: candidate
          },
          select: {
            id: true
          }
        });
        return Boolean(existing);
      });

      const post = await app.prisma.post.create({
        data: {
          authorId: user.id,
          categoryId,
          coverAssetId: request.body.coverAssetId,
          title,
          slug,
          excerpt: request.body.excerpt?.trim() || null,
          bodyHtml: request.body.bodyHtml ?? "",
          bodyJson: request.body.bodyJson ?? {},
          status: "draft",
          readMinutes: 1
        }
      });

      if (tagIds.length > 0) {
        await app.prisma.postTag.createMany({
          data: tagIds.map((tagId) => ({
            postId: post.id,
            tagId
          })),
          skipDuplicates: true
        });
      }

      const detail = await loadPostDetail(app, post.id);
      return reply.status(201).send({
        post: toPostDetail(detail, [])
      });
    }
  );

  app.patch<{ Params: Static<typeof UuidParams>; Body: Static<typeof PostPatchBody> }>(
    "/posts/:id",
    {
      schema: {
        params: UuidParams,
        body: PostPatchBody
      }
    },
    async (request) => {
      const user = await app.requireAuth(request);
      await ensurePostOwner(app, request.params.id, user.id);

      const data: Record<string, unknown> = {};
      if (request.body.title !== undefined) {
        const title = request.body.title.trim();
        if (!title) {
          throw badRequest("Tiêu đề không được để trống.");
        }
        data.title = title;
      }
      if (request.body.excerpt !== undefined) {
        data.excerpt = request.body.excerpt.trim() || null;
      }
      if (request.body.bodyHtml !== undefined) {
        data.bodyHtml = request.body.bodyHtml;
      }
      if (request.body.bodyJson !== undefined) {
        data.bodyJson = request.body.bodyJson;
      }
      if (request.body.categorySlug !== undefined) {
        data.categoryId = await resolveCategoryId(app, request.body.categorySlug);
      }
      if (request.body.coverAssetId !== undefined) {
        data.coverAssetId = request.body.coverAssetId;
      }

      await app.prisma.post.update({
        where: {
          id: request.params.id
        },
        data
      });

      if (request.body.tagSlugs !== undefined) {
        const tagIds = await resolveTagIds(app, request.body.tagSlugs);
        await app.prisma.$transaction([
          app.prisma.postTag.deleteMany({
            where: {
              postId: request.params.id
            }
          }),
          app.prisma.postTag.createMany({
            data: tagIds.map((tagId) => ({
              postId: request.params.id,
              tagId
            })),
            skipDuplicates: true
          })
        ]);
      }

      const detail = await loadPostDetail(app, request.params.id);
      return {
        post: toPostDetail(detail, [])
      };
    }
  );

  app.post<{ Params: Static<typeof UuidParams> }>(
    "/posts/:id/publish",
    {
      schema: {
        params: UuidParams
      }
    },
    async (request) => {
      const user = await app.requireAuth(request);
      const post = await ensurePostOwner(app, request.params.id, user.id);

      if (!post.title.trim() || !hasPublishableBody(post)) {
        throw badRequest("Bài viết cần có tiêu đề và nội dung trước khi xuất bản.");
      }

      await app.prisma.post.update({
        where: {
          id: post.id
        },
        data: {
          status: "published",
          publishedAt: post.publishedAt ?? new Date()
        }
      });

      const detail = await app.prisma.post.findUniqueOrThrow({
        where: {
          id: post.id
        },
        include: {
          ...postDetailInclude,
          author: {
            include: userSummaryInclude
          }
        }
      });

      return {
        post: toPostDetail(detail, [])
      };
    }
  );

  app.post<{ Params: Static<typeof UuidParams> }>(
    "/posts/:id/archive",
    {
      schema: {
        params: UuidParams
      }
    },
    async (request) => {
      const user = await app.requireAuth(request);
      const post = await ensurePostOwner(app, request.params.id, user.id);

      await app.prisma.post.update({
        where: {
          id: post.id
        },
        data: {
          status: "archived"
        }
      });

      const detail = await loadPostDetail(app, post.id);
      return {
        post: toPostDetail(detail, [])
      };
    }
  );
};
