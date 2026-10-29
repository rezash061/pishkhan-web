import "server-only";
import { NextResponse } from "next/server";

/** The visitor's IP as set by Nginx in front of the site (first X-Forwarded-For entry, or X-Real-IP). */
export function clientIp(request: Request): string | null {
  const forwarded = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  return forwarded || request.headers.get("x-real-ip") || null;
}

/**
 * Mutating requests must come from this site's own pages: `Origin` (or `Referer` when a browser omits Origin)
 * must match the request host. Blocks cross-site form posts against the lead and demo endpoints.
 */
export function isSameOrigin(request: Request): boolean {
  const host = request.headers.get("x-forwarded-host") ?? request.headers.get("host");
  const origin = request.headers.get("origin") ?? request.headers.get("referer");
  if (!host || !origin) return false;
  try {
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}

export function json(body: unknown, status = 200): NextResponse {
  return NextResponse.json(body, { status, headers: { "Cache-Control": "no-store" } });
}

/** Reads a JSON body of at most `maxBytes`; returns null when it is missing, too large or not JSON. */
export async function readJson<T>(request: Request, maxBytes = 16_384): Promise<T | null> {
  const text = await request.text().catch(() => "");
  if (!text || text.length > maxBytes) return null;
  try {
    return JSON.parse(text) as T;
  } catch {
    return null;
  }
}
