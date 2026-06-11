import { Prisma } from "@prisma/client";

export const mediaInclude = Prisma.validator<Prisma.MediaAssetInclude>()({
  variants: true
});

export const postCardInclude = Prisma.validator<Prisma.PostInclude>()({
  category: true,
  cover: {
    include: mediaInclude
  }
});

export const postDetailInclude = Prisma.validator<Prisma.PostInclude>()({
  ...postCardInclude,
  author: {
    include: {
      profile: {
        include: {
          avatar: {
            include: mediaInclude
          }
        }
      }
    }
  },
  tags: {
    include: {
      tag: true
    },
    orderBy: {
      tag: {
        sortOrder: "asc"
      }
    }
  }
});

export const userSummaryInclude = Prisma.validator<Prisma.UserInclude>()({
  profile: {
    include: {
      avatar: {
        include: mediaInclude
      }
    }
  }
});

export const publicPostWhere = Prisma.validator<Prisma.PostWhereInput>()({
  status: "published",
  deletedAt: null,
  publishedAt: {
    not: null
  }
});

export const publicPostOrderBy: Prisma.PostOrderByWithRelationInput[] = [
  { publishedAt: "desc" },
  { updatedAt: "desc" }
];
