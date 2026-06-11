import { describeDb, useIntegrationApp } from "./helpers.js";

describeDb("public API", () => {
  const ctx = useIntegrationApp();

  it("returns site chrome from DB-backed settings and navigation", async () => {
    const response = await ctx.app.inject({
      method: "GET",
      url: "/api/site"
    });

    expect(response.statusCode).toBe(200);
    const body = response.json();
    expect(body.brand.name).toBe("Blog UI");
    expect(body.navigation.headerPrimary).toEqual(
      expect.arrayContaining([expect.objectContaining({ label: "Trang chủ", href: "/" })])
    );
    expect(body.currentUser).toBeNull();
  });

  it("returns the home contract and excludes draft posts", async () => {
    const response = await ctx.app.inject({
      method: "GET",
      url: "/api/home"
    });

    expect(response.statusCode).toBe(200);
    const body = response.json();
    expect(body.page.slug).toBe("home");
    expect(body.heroSlides).toHaveLength(4);
    expect(body.topicTags.length).toBeGreaterThanOrEqual(6);
    expect(body.latestPosts.length).toBeGreaterThan(0);
    expect(body.latestPosts.some((post: { slug: string }) => post.slug === "mau-sac-va-bien-css")).toBe(false);
  });

  it("filters category pages by slug and returns published post cards", async () => {
    const response = await ctx.app.inject({
      method: "GET",
      url: "/api/categories/cong-nghe?page=1&perPage=5"
    });

    expect(response.statusCode).toBe(200);
    const body = response.json();
    expect(body.category.slug).toBe("cong-nghe");
    expect(body.posts).toHaveLength(5);
    expect(body.pagination.total).toBeGreaterThan(5);
    expect(body.posts[0]).toEqual(
      expect.objectContaining({
        href: expect.stringMatching(/^\/posts\//),
        category: expect.objectContaining({ slug: "cong-nghe" })
      })
    );
  });

  it("returns post detail with author, tags, cover and configured related posts", async () => {
    const response = await ctx.app.inject({
      method: "GET",
      url: "/api/posts/gioi-thieu-ve-du-an-blog"
    });

    expect(response.statusCode).toBe(200);
    const body = response.json();
    expect(body.post.title).toBe("Giới thiệu về dự án blog");
    expect(body.post.author.displayName).toBe("Nguyễn Văn A");
    expect(body.post.cover.altText).toContain("Giới thiệu");
    expect(body.post.tags.length).toBeGreaterThan(0);
    expect(body.relatedPosts.map((post: { slug: string }) => post.slug)).toEqual([
      "cau-truc-thu-muc-goi-y",
      "tips-viet-ma-sach",
      "deploy-blog-tinh-len-trang-thu-nghiem"
    ]);
  });

  it("does not expose draft posts through public detail routes", async () => {
    const response = await ctx.app.inject({
      method: "GET",
      url: "/api/posts/mau-sac-va-bien-css"
    });

    expect(response.statusCode).toBe(404);
    expect(response.json().error.code).toBe("NOT_FOUND");
  });
});
