import { publicApi, type AltchaChallenge } from "@/lib/api";
import { clientIp, json } from "@/lib/http";

// Proxies `GET /api/v1/public/altcha/challenge`. Challenges are single-use, so never cached.
export async function GET(request: Request) {
  const result = await publicApi<AltchaChallenge>("/altcha/challenge", { clientIp: clientIp(request) });
  return result.ok ? json(result.data) : json({ error: "unavailable" }, result.status === 429 ? 429 : 503);
}
