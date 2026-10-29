import { describe, expect, it } from "vitest";
import { signPayload, verifySignature } from "@/lib/hmac";

const secret = "test-secret";
const now = 1_800_000_000;
const body = '{"tags":["plans"]}';

describe("revalidation signature", () => {
  it("accepts a fresh, correctly signed request", () => {
    expect(verifySignature(secret, String(now), signPayload(secret, String(now), body), body, now + 10)).toBe(true);
  });
  it("rejects a tampered body", () => {
    expect(verifySignature(secret, String(now), signPayload(secret, String(now), body), '{"tags":["x"]}', now)).toBe(false);
  });
  it("rejects old timestamps (replay)", () => {
    expect(verifySignature(secret, String(now), signPayload(secret, String(now), body), body, now + 301)).toBe(false);
  });
  it("rejects a wrong secret and missing headers", () => {
    expect(verifySignature(secret, String(now), signPayload("other", String(now), body), body, now)).toBe(false);
    expect(verifySignature(secret, null, null, body, now)).toBe(false);
  });
});
