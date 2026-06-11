import { describe, expect, it } from "vitest";

const baseUrl = process.env.E2E_BASE_URL;

type JsonObject = Record<string, unknown>;

function requireBaseUrl(): string {
  if (!baseUrl) {
    throw new Error("Set E2E_BASE_URL to run public API E2E tests.");
  }

  return baseUrl.replace(/\/$/, "");
}

function getSetCookie(headers: Headers): string {
  const getSetCookie = (headers as Headers & { getSetCookie?: () => string[] }).getSetCookie;
  const values = getSetCookie ? getSetCookie.call(headers) : [];
  return values.join("; ") || headers.get("set-cookie") || "";
}

function toCookieHeader(setCookie: string): string {
  return setCookie
    .split(",")
    .map((part) => part.trim().split(";")[0])
    .filter((part) => part.includes("="))
    .join("; ");
}

async function requestJson<T extends JsonObject>(
  path: string,
  options: RequestInit & { expectedStatus?: number } = {}
): Promise<{ body: T; response: Response }> {
  const response = await fetch(`${requireBaseUrl()}${path}`, {
    ...options,
    headers: {
      accept: "application/json",
      ...(options.body ? { "content-type": "application/json" } : {}),
      ...options.headers
    }
  });
  const text = await response.text();
  const body = text ? (JSON.parse(text) as T) : ({} as T);
  expect(response.status, `${path} status`).toBe(options.expectedStatus ?? 200);
  return { body, response };
}

describe("public production API", () => {
  it("covers public read, auth, owner-write, archive cleanup and contact routes", async () => {
    const unique = `${Date.now()}-${Math.random().toString(16).slice(2)}`;

    const health = await requestJson<{ ok: boolean }>("/health");
    expect(health.body.ok).toBe(true);
    expect(health.response.headers.get("strict-transport-security")).toContain("max-age=63072000");
    expect(health.response.headers.get("x-frame-options")).toContain("DENY");

    expect((await requestJson<{ ok: boolean }>("/ready")).body.ok).toBe(true);

    const site = await requestJson<{
      brand: { name: string };
      navigation: { headerPrimary: unknown[]; footer: unknown[] };
      currentUser: null;
    }>("/api/site");
    expect(site.body.brand.name).toBe("Blog UI");
    expect(site.body.navigation.headerPrimary.length).toBeGreaterThan(0);
    expect(site.body.currentUser).toBeNull();

    const home = await requestJson<{
      page: { slug: string };
      heroSlides: unknown[];
      latestPosts: { slug: string }[];
      topicTags: { slug: string }[];
    }>("/api/home");
    expect(home.body.page.slug).toBe("home");
    expect(home.body.heroSlides).toHaveLength(4);
    expect(home.body.latestPosts.length).toBeGreaterThan(0);
    expect(home.body.topicTags.length).toBeGreaterThan(0);

    for (const slug of ["home", "about", "contact"]) {
      const page = await requestJson<{ page: { slug: string; title: string } }>(`/api/pages/${slug}`);
      expect(page.body.page.slug).toBe(slug);
      expect(page.body.page.title.length).toBeGreaterThan(0);
    }

    const categories = await requestJson<{ categories: { slug: string }[] }>("/api/categories");
    expect(categories.body.categories.map((category) => category.slug)).toContain("cong-nghe");

    const category = await requestJson<{
      category: { slug: string };
      posts: { href: string; category: { slug: string } }[];
      pagination: { total: number };
    }>("/api/categories/cong-nghe?page=1&perPage=5");
    expect(category.body.category.slug).toBe("cong-nghe");
    expect(category.body.posts.length).toBeGreaterThan(0);
    expect(category.body.posts[0].href).toMatch(/^\/posts\//);
    expect(category.body.pagination.total).toBeGreaterThan(0);

    const tags = await requestJson<{ tags: { slug: string }[] }>("/api/tags");
    expect(tags.body.tags.map((tag) => tag.slug)).toContain("front-end-mobile-apps");

    const media = await requestJson<{ mediaAssets: { url: string; altText: string }[] }>("/api/media-assets");
    expect(media.body.mediaAssets.length).toBeGreaterThan(0);
    expect(media.body.mediaAssets[0].url.length).toBeGreaterThan(0);

    const postDetail = await requestJson<{
      post: { slug: string; author: { displayName: string }; tags: unknown[] };
      relatedPosts: unknown[];
    }>("/api/posts/gioi-thieu-ve-du-an-blog");
    expect(postDetail.body.post.slug).toBe("gioi-thieu-ve-du-an-blog");
    expect(postDetail.body.post.author.displayName).toBe("Nguyễn Văn A");
    expect(postDetail.body.post.tags.length).toBeGreaterThan(0);
    expect(postDetail.body.relatedPosts.length).toBeGreaterThan(0);

    await requestJson<{ error: { code: string } }>("/api/posts/mau-sac-va-bien-css", {
      expectedStatus: 404
    });

    await requestJson<{ error: { code: string } }>("/api/contact-messages", {
      method: "POST",
      expectedStatus: 400,
      body: JSON.stringify({
        name: "E2E",
        email: `contact-${unique}@example.com`,
        message: "Ngắn"
      })
    });

    const contact = await requestJson<{ contactMessage: { status: string } }>("/api/contact-messages", {
      method: "POST",
      expectedStatus: 201,
      body: JSON.stringify({
        name: "Kiểm thử E2E",
        email: `contact-${unique}@example.com`,
        message: "Nội dung kiểm thử public API đủ dài."
      })
    });
    expect(contact.body.contactMessage.status).toBe("new");

    const email = `author-${unique}@example.com`;
    const password = `Password-${unique}`;
    const register = await requestJson<{ user: { id: string; displayName: string } }>("/api/auth/register", {
      method: "POST",
      expectedStatus: 201,
      body: JSON.stringify({
        name: "Tác giả E2E",
        email,
        password
      })
    });
    expect(register.body.user.displayName).toBe("Tác giả E2E");
    expect(getSetCookie(register.response.headers)).toContain("HttpOnly");

    const login = await requestJson<{ user: { id: string } }>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({
        email,
        password
      })
    });
    expect(login.body.user.id).toBe(register.body.user.id);
    const cookie = toCookieHeader(getSetCookie(login.response.headers));
    expect(cookie).toContain("blog_session=");

    const me = await requestJson<{ user: { id: string } }>("/api/auth/me", {
      headers: { cookie }
    });
    expect(me.body.user.id).toBe(register.body.user.id);

    const preferences = await requestJson<{ user: { displayName: string } }>("/api/me/preferences", {
      method: "PATCH",
      headers: { cookie },
      body: JSON.stringify({ themePreference: "dark" })
    });
    expect(preferences.body.user.displayName).toBe("Tác giả E2E");

    const create = await requestJson<{
      post: { id: string; slug: string; status: string; title: string };
    }>("/api/me/posts", {
      method: "POST",
      expectedStatus: 201,
      headers: { cookie },
      body: JSON.stringify({
        title: `E2E public API ${unique}`,
        excerpt: "Bài viết kiểm thử sẽ được archive sau khi xác minh.",
        categorySlug: "cong-nghe",
        tagSlugs: ["front-end-mobile-apps"]
      })
    });
    expect(create.body.post.status).toBe("draft");

    await requestJson<{ error: { code: string } }>(`/api/me/posts/${create.body.post.id}/publish`, {
      method: "POST",
      expectedStatus: 400,
      headers: { cookie }
    });

    const patch = await requestJson<{ post: { id: string; status: string } }>(
      `/api/me/posts/${create.body.post.id}`,
      {
        method: "PATCH",
        headers: { cookie },
        body: JSON.stringify({
          bodyHtml: "<p>Nội dung kiểm thử public API đủ để xuất bản.</p>",
          tagSlugs: ["front-end-mobile-apps", "back-end-devops"]
        })
      }
    );
    expect(patch.body.post.id).toBe(create.body.post.id);

    const publish = await requestJson<{ post: { slug: string; status: string; publishedAt: string } }>(
      `/api/me/posts/${create.body.post.id}/publish`,
      {
        method: "POST",
        headers: { cookie }
      }
    );
    expect(publish.body.post.status).toBe("published");
    expect(publish.body.post.publishedAt).toEqual(expect.any(String));

    const publicCreated = await requestJson<{ post: { slug: string; status: string } }>(
      `/api/posts/${publish.body.post.slug}`
    );
    expect(publicCreated.body.post.status).toBe("published");

    const archive = await requestJson<{ post: { id: string; status: string } }>(
      `/api/me/posts/${create.body.post.id}/archive`,
      {
        method: "POST",
        headers: { cookie }
      }
    );
    expect(archive.body.post.status).toBe("archived");

    await requestJson<{ error: { code: string } }>(`/api/posts/${publish.body.post.slug}`, {
      expectedStatus: 404
    });

    const myPosts = await requestJson<{ posts: { id: string; status: string }[] }>("/api/me/posts", {
      headers: { cookie }
    });
    expect(myPosts.body.posts).toEqual(
      expect.arrayContaining([expect.objectContaining({ id: create.body.post.id, status: "archived" })])
    );

    const logout = await requestJson<{ ok: boolean }>("/api/auth/logout", {
      method: "POST",
      headers: { cookie }
    });
    expect(logout.body.ok).toBe(true);

    await requestJson<{ error: { code: string } }>("/api/auth/me", {
      headers: { cookie },
      expectedStatus: 401
    });
  }, 60_000);
});
