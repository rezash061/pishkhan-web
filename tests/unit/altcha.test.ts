import { createHash } from "node:crypto";
import { describe, expect, it } from "vitest";
import { encodePayload, solveChallenge, type Challenge } from "@/lib/altcha";

// Mirrors the backend AltchaVerifier: challenge = SHA-256 hex of salt + number.
function challengeFor(number: number, maxNumber = 50_000): Challenge {
  const salt = "a1b2c3d4e5f6a1b2c3d4e5f6?expires=9999999999";
  return { algorithm: "SHA-256", challenge: createHash("sha256").update(salt + number).digest("hex"), maxNumber, salt, signature: "sig" };
}

describe("ALTCHA solver", () => {
  it("finds the secret number", async () => {
    expect(await solveChallenge(challengeFor(12_345))).toBe(12_345);
  });
  it("returns null when no number matches", async () => {
    expect(await solveChallenge({ ...challengeFor(10, 100), challenge: "0".repeat(64) })).toBeNull();
  });
  it("encodes the payload the backend parses", () => {
    const c = challengeFor(7);
    const decoded = JSON.parse(Buffer.from(encodePayload(c, 7), "base64").toString("utf8"));
    expect(decoded).toEqual({ algorithm: "SHA-256", challenge: c.challenge, number: 7, salt: c.salt, signature: "sig" });
  });
});
