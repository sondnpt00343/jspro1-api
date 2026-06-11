import { describe, expect, it } from "vitest";
import { createSessionToken, hashSessionToken } from "../../src/lib/session.js";

describe("session helpers", () => {
  it("creates opaque tokens and stores only deterministic hashes", () => {
    const token = createSessionToken();
    const hash = hashSessionToken(token);

    expect(token).not.toEqual(hash);
    expect(token.length).toBeGreaterThan(20);
    expect(hash).toMatch(/^[a-f0-9]{64}$/);
    expect(hashSessionToken(token)).toBe(hash);
  });
});
