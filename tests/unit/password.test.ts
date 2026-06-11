import { describe, expect, it } from "vitest";
import { hashPassword, verifyPassword } from "../../src/lib/password.js";

describe("password helpers", () => {
  it("hashes passwords with argon2id and verifies without exposing the password", async () => {
    const hash = await hashPassword("secret-password");

    expect(hash).toContain("$argon2id$");
    expect(hash).not.toContain("secret-password");
    expect(await verifyPassword(hash, "secret-password")).toBe(true);
    expect(await verifyPassword(hash, "wrong-password")).toBe(false);
  });
});
