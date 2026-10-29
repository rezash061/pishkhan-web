import { revalidatePath, revalidateTag } from "next/cache";
import { env } from "@/lib/env";
import { verifySignature } from "@/lib/hmac";
import { json } from "@/lib/http";

interface Body {
  tags?: unknown;
  paths?: unknown;
}

/**
 * On-demand revalidation called by the backend Content and Billing modules after a publish (plan 3.2).
 * Body: `{ "tags": ["plans"], "paths": ["/blog/some-post"] }`, signed as described in lib/hmac.ts.
 */
export async function POST(request: Request) {
  if (!env.revalidateSecret) {
    return json({ error: "disabled" }, 404);
  }
  const raw = await request.text();
  if (raw.length > 8192 || !verifySignature(env.revalidateSecret, request.headers.get("x-pishkhan-timestamp"), request.headers.get("x-pishkhan-signature"), raw)) {
    return json({ error: "unauthorized" }, 401);
  }

  let body: Body;
  try {
    body = JSON.parse(raw) as Body;
  } catch {
    return json({ error: "invalid" }, 400);
  }
  const tags = Array.isArray(body.tags) ? body.tags.filter((t): t is string => typeof t === "string" && /^[a-z0-9:_-]{1,100}$/.test(t)).slice(0, 50) : [];
  const paths = Array.isArray(body.paths) ? body.paths.filter((p): p is string => typeof p === "string" && /^\/[^\s?#]{0,300}$/.test(p) && !p.startsWith("//")).slice(0, 100) : [];

  // Prices and legal text must not be served stale, so expire immediately rather than stale-while-revalidate.
  for (const tag of tags) revalidateTag(tag, { expire: 0 });
  for (const path of paths) revalidatePath(path);

  return json({ revalidated: { tags, paths } });
}
