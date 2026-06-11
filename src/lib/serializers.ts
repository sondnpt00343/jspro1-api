import type {
  Category,
  MediaAsset,
  MediaVariant,
  NavigationItem,
  Page,
  Post,
  Tag,
  User,
  UserProfile
} from "@prisma/client";

type MediaWithVariants = MediaAsset & { variants?: MediaVariant[] };
type UserWithProfile = User & {
  profile?: (UserProfile & { avatar?: MediaWithVariants | null }) | null;
};
type PostCardSource = Post & {
  category: Category;
  cover?: MediaWithVariants | null;
};

function toCamelKey(value: string): string {
  return value.replace(/-([a-z0-9])/g, (_, char: string) => char.toUpperCase());
}

function toNavigationBucket(location: string): string {
  return location.replace(/_([a-z])/g, (_, char: string) => char.toUpperCase());
}

export function toIso(value: Date | null | undefined): string | null {
  return value ? value.toISOString() : null;
}

export function toMediaAsset(asset?: MediaWithVariants | null) {
  if (!asset) {
    return null;
  }

  const variants = Object.fromEntries(
    (asset.variants ?? []).map((variant) => [
      toCamelKey(variant.variantKey),
      {
        url: variant.url,
        width: variant.width,
        height: variant.height
      }
    ])
  );

  return {
    id: asset.id,
    kind: asset.kind,
    url: asset.url,
    altText: asset.altText,
    width: asset.width,
    height: asset.height,
    ...(Object.keys(variants).length ? { variants } : {})
  };
}

export function toCategorySummary(category: Category) {
  return {
    id: category.id,
    name: category.name,
    slug: category.slug,
    description: category.description
  };
}

export function toTagSummary(tag: Tag) {
  return {
    id: tag.id,
    name: tag.name,
    slug: tag.slug,
    description: tag.description
  };
}

export function toUserSummary(user: UserWithProfile) {
  return {
    id: user.id,
    name: user.name,
    displayName: user.profile?.displayName ?? user.name,
    headline: user.profile?.headline ?? null,
    bio: user.profile?.bio ?? null,
    avatar: toMediaAsset(user.profile?.avatar ?? null)
  };
}

export function toPageContent(page: Page) {
  return {
    id: page.id,
    slug: page.slug,
    title: page.title,
    lead: page.lead,
    bodyHtml: page.bodyHtml,
    seoTitle: page.seoTitle,
    metaDescription: page.metaDescription
  };
}

export function toPostCard(post: PostCardSource) {
  return {
    id: post.id,
    title: post.title,
    slug: post.slug,
    excerpt: post.excerpt,
    category: toCategorySummary(post.category),
    cover: toMediaAsset(post.cover ?? null),
    readMinutes: post.readMinutes,
    publishedAt: toIso(post.publishedAt),
    href: `/posts/${post.slug}`
  };
}

export function toPostDetail(
  post: PostCardSource & {
    author: UserWithProfile;
    tags: { tag: Tag }[];
  },
  relatedPosts: PostCardSource[]
) {
  return {
    ...toPostCard(post),
    bodyHtml: post.bodyHtml,
    bodyJson: post.bodyJson,
    status: post.status,
    seoTitle: post.seoTitle,
    metaDescription: post.metaDescription,
    tags: post.tags.map(({ tag }) => toTagSummary(tag)),
    author: toUserSummary(post.author),
    relatedPosts: relatedPosts.map(toPostCard)
  };
}

export function toNavigationItem(item: NavigationItem) {
  return {
    id: item.id,
    location: item.location,
    label: item.label,
    href: item.href,
    iconClass: item.iconClass,
    authState: item.authState
  };
}

export function groupNavigation(items: NavigationItem[]) {
  const grouped: Record<string, ReturnType<typeof toNavigationItem>[]> = {
    headerPrimary: [],
    headerSecondary: [],
    userMenu: [],
    footer: []
  };

  for (const item of items) {
    grouped[toNavigationBucket(item.location)].push(toNavigationItem(item));
  }

  return grouped;
}
