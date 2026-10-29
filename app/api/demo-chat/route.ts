import { publicApi, type DemoChatRequest, type DemoChatResponse } from "@/lib/api";
import { clientIp, isSameOrigin, json, readJson } from "@/lib/http";

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * Demo chat → `POST /api/v1/public/demo-chat` (backend demo workspace). The backend enforces the ALTCHA
 * check, per-IP rate limit and the 10-message cap per session; this handler only validates shape and origin.
 */
export async function POST(request: Request) {
  if (!isSameOrigin(request)) {
    return json({ error: "forbidden" }, 403);
  }
  const body = await readJson<Partial<DemoChatRequest>>(request, 4096);
  const message = typeof body?.message === "string" ? body.message.trim().slice(0, 500) : "";
  if (!body || typeof body.sessionId !== "string" || !UUID.test(body.sessionId) || !message) {
    return json({ error: "invalid" }, 400);
  }

  const result = await publicApi<DemoChatResponse>("/demo-chat", {
    method: "POST",
    body: { sessionId: body.sessionId, message, altcha: typeof body.altcha === "string" ? body.altcha.slice(0, 2000) : undefined },
    clientIp: clientIp(request),
    timeoutMs: 20_000,
  });
  if (result.ok) {
    const { reply, confidence, sources, remaining } = result.data;
    return json({ reply, confidence, sources: Array.isArray(sources) ? sources.slice(0, 3) : [], remaining });
  }
  const type = result.problem?.type ?? "";
  if (type.endsWith("/plan-limit") || result.problem?.title === "demo.limit") return json({ error: "limit" }, 429);
  if (result.problem?.title === "altcha.invalid") return json({ error: "botCheckFailed" }, 400);
  return json({ error: "unavailable" }, [404, 429, 501].includes(result.status) ? result.status : 503);
}
