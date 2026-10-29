// ALTCHA proof-of-work solver (self-hosted, no foreign CAPTCHA). The backend issues
// `{ algorithm, challenge, maxNumber, salt, signature }`; the browser finds the number n with
// SHA-256(salt + n) == challenge and sends back base64(JSON) of the challenge plus that number.
// The backend checks the signature and work and accepts each solution once.

export interface Challenge {
  algorithm: string;
  challenge: string;
  maxNumber: number;
  salt: string;
  signature: string;
}

const encoder = new TextEncoder();

async function sha256Hex(text: string): Promise<string> {
  const digest = await crypto.subtle.digest("SHA-256", encoder.encode(text));
  let hex = "";
  for (const byte of new Uint8Array(digest)) {
    hex += byte.toString(16).padStart(2, "0");
  }
  return hex;
}

/** Returns the solving number, or `null` when none up to `maxNumber` matches or `signal` aborts. */
export async function solveChallenge(c: Challenge, signal?: AbortSignal): Promise<number | null> {
  if (c.algorithm !== "SHA-256") {
    return null;
  }
  // Hash in batches: WebCrypto calls are async, so awaiting one at a time is several times slower.
  const batch = 500;
  for (let start = 0; start <= c.maxNumber; start += batch) {
    if (signal?.aborted) {
      return null;
    }
    const end = Math.min(start + batch - 1, c.maxNumber);
    const hashes = await Promise.all(Array.from({ length: end - start + 1 }, (_, i) => sha256Hex(c.salt + (start + i))));
    const index = hashes.indexOf(c.challenge);
    if (index >= 0) {
      return start + index;
    }
  }
  return null;
}

/** The payload the backend expects in the `altcha` field. */
export function encodePayload(c: Challenge, number: number): string {
  const json = JSON.stringify({
    algorithm: c.algorithm,
    challenge: c.challenge,
    number,
    salt: c.salt,
    signature: c.signature,
  });
  return btoa(json);
}

/** Fetches a challenge from this site's `/api/altcha` route and solves it. */
export async function getAltchaPayload(signal?: AbortSignal): Promise<string | null> {
  const response = await fetch("/api/altcha", { cache: "no-store", signal });
  if (!response.ok) {
    return null;
  }
  const challenge = (await response.json()) as Challenge;
  const number = await solveChallenge(challenge, signal);
  return number === null ? null : encodePayload(challenge, number);
}
