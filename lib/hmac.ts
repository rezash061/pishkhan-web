import { createHmac, timingSafeEqual } from "node:crypto";

// On-demand revalidation webhook signature (backend Content module → site):
//   X-Pishkhan-Timestamp: <unix seconds>
//   X-Pishkhan-Signature: sha256=<hex HMAC-SHA256(secret, "<timestamp>.<raw body>")>
// Requests older or newer than 5 minutes are rejected to stop replays.

export const MAX_SKEW_SECONDS = 300;

export function signPayload(secret: string, timestamp: string, body: string): string {
  return `sha256=${createHmac("sha256", secret).update(`${timestamp}.${body}`).digest("hex")}`;
}

export function verifySignature(secret: string, timestamp: string | null, signature: string | null, body: string, nowSeconds = Math.floor(Date.now() / 1000)): boolean {
  if (!secret || !timestamp || !signature || !/^\d{1,12}$/.test(timestamp)) return false;
  if (Math.abs(nowSeconds - Number(timestamp)) > MAX_SKEW_SECONDS) return false;
  const expected = Buffer.from(signPayload(secret, timestamp, body));
  const actual = Buffer.from(signature);
  return expected.length === actual.length && timingSafeEqual(expected, actual);
}
