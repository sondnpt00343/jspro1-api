import { describeDb, extractCookie, useIntegrationApp } from "./helpers.js";

describeDb("auth and current-user post APIs", () => {
  const ctx = useIntegrationApp();

  it("registers, authenticates, writes drafts, publishes and logs out", async () => {
    const unique = Date.now();
    const registerResponse = await ctx.app.inject({
      method: "POST",
      url: "/api/auth/register",
      payload: {
        name: "Tác giả Test",
        email: `author-${unique}@example.com`,
        password: "strong-password"
      }
    });

    expect(registerResponse.statusCode).toBe(201);
    expect(registerResponse.headers["set-cookie"]).toContain("HttpOnly");
    const cookie = extractCookie(registerResponse.headers);

    const meResponse = await ctx.app.inject({
      method: "GET",
      url: "/api/auth/me",
      headers: {
        cookie
      }
    });
    expect(meResponse.statusCode).toBe(200);
    expect(meResponse.json().user.displayName).toBe("Tác giả Test");

    const createResponse = await ctx.app.inject({
      method: "POST",
      url: "/api/me/posts",
      headers: {
        cookie
      },
      payload: {
        title: `Bài viết test ${unique}`,
        excerpt: "Đoạn tóm tắt dùng trong integration test.",
        categorySlug: "cong-nghe",
        tagSlugs: ["front-end-mobile-apps"]
      }
    });

    expect(createResponse.statusCode).toBe(201);
    const createdPost = createResponse.json().post;
    expect(createdPost.status).toBe("draft");

    const publishEmptyResponse = await ctx.app.inject({
      method: "POST",
      url: `/api/me/posts/${createdPost.id}/publish`,
      headers: {
        cookie
      }
    });
    expect(publishEmptyResponse.statusCode).toBe(400);

    const patchResponse = await ctx.app.inject({
      method: "PATCH",
      url: `/api/me/posts/${createdPost.id}`,
      headers: {
        cookie
      },
      payload: {
        bodyHtml: "<p>Nội dung đủ để xuất bản.</p>"
      }
    });
    expect(patchResponse.statusCode).toBe(200);

    const publishResponse = await ctx.app.inject({
      method: "POST",
      url: `/api/me/posts/${createdPost.id}/publish`,
      headers: {
        cookie
      }
    });
    expect(publishResponse.statusCode).toBe(200);
    expect(publishResponse.json().post.status).toBe("published");
    expect(publishResponse.json().post.publishedAt).toEqual(expect.any(String));

    const archiveResponse = await ctx.app.inject({
      method: "POST",
      url: `/api/me/posts/${createdPost.id}/archive`,
      headers: {
        cookie
      }
    });
    expect(archiveResponse.statusCode).toBe(200);
    expect(archiveResponse.json().post.status).toBe("archived");

    const postsResponse = await ctx.app.inject({
      method: "GET",
      url: "/api/me/posts",
      headers: {
        cookie
      }
    });
    expect(postsResponse.statusCode).toBe(200);
    expect(postsResponse.json().posts.map((post: { id: string }) => post.id)).toContain(createdPost.id);
    expect(postsResponse.json().posts.map((post: { title: string }) => post.title)).not.toContain(
      "Giới thiệu về dự án blog"
    );

    const preferenceResponse = await ctx.app.inject({
      method: "PATCH",
      url: "/api/me/preferences",
      headers: {
        cookie
      },
      payload: {
        themePreference: "dark"
      }
    });
    expect(preferenceResponse.statusCode).toBe(200);
    expect(preferenceResponse.json().user.displayName).toBe("Tác giả Test");

    const logoutResponse = await ctx.app.inject({
      method: "POST",
      url: "/api/auth/logout",
      headers: {
        cookie
      }
    });
    expect(logoutResponse.statusCode).toBe(200);

    const unauthorizedResponse = await ctx.app.inject({
      method: "GET",
      url: "/api/auth/me",
      headers: {
        cookie
      }
    });
    expect(unauthorizedResponse.statusCode).toBe(401);
  });
});
