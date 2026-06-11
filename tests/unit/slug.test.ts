import { describe, expect, it } from "vitest";
import { isValidSlug, makeUniqueSlug, slugify } from "../../src/lib/slug.js";

describe("slug helpers", () => {
  it("normalizes Vietnamese titles to route-safe slugs", () => {
    expect(slugify("Viết API sạch, dễ maintain")).toBe("viet-api-sach-de-maintain");
    expect(isValidSlug("viet-api-sach-de-maintain")).toBe(true);
    expect(isValidSlug("Viết API")).toBe(false);
  });

  it("adds suffixes when slug already exists", async () => {
    const existing = new Set(["bai-viet", "bai-viet-2"]);
    const slug = await makeUniqueSlug("Bài viết", async (candidate) => existing.has(candidate));

    expect(slug).toBe("bai-viet-3");
  });
});
