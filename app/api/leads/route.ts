import { publicApi, type LeadRequest, type ProblemDetails } from "@/lib/api";
import { clientIp, isSameOrigin, json, readJson } from "@/lib/http";
import { validateLead, type LeadErrors, type LeadInput } from "@/lib/validation";

type Body = Partial<Record<keyof LeadInput | "altcha" | "plan", unknown>> & { utm?: unknown };

const str = (v: unknown, max = 2000) => (typeof v === "string" ? v.slice(0, max) : "");

/**
 * Waitlist and contact submissions → `POST /api/v1/public/leads`. The site validates and checks the origin;
 * the backend verifies the ALTCHA solution (single use) and rate-limits again.
 */
export async function POST(request: Request) {
  if (!isSameOrigin(request)) {
    return json({ error: "forbidden" }, 403);
  }
  const body = await readJson<Body>(request);
  if (!body) {
    return json({ error: "invalid" }, 400);
  }
  const altcha = str(body.altcha, 2000);
  if (!altcha) {
    return json({ error: "botCheckFailed" }, 400);
  }

  const { errors, value } = validateLead({
    type: body.type === "contact" ? "contact" : "waitlist",
    name: str(body.name, 100),
    phone: str(body.phone, 30),
    instagramHandle: str(body.instagramHandle, 40),
    vertical: str(body.vertical, 40),
    monthlyDms: str(body.monthlyDms, 40),
    message: str(body.message, 2001),
  });
  if (Object.keys(errors).length > 0) {
    return json({ errors }, 422);
  }

  const utm = typeof body.utm === "object" && body.utm !== null ? Object.fromEntries(Object.entries(body.utm as Record<string, unknown>).filter(([k, v]) => /^(utm_[a-z]+|ref)$/.test(k) && typeof v === "string").map(([k, v]) => [k, String(v).slice(0, 100)])) : undefined;
  const plan = str(body.plan, 40);

  const lead: LeadRequest = {
    type: value.type,
    name: value.name || undefined,
    phone: value.phone,
    instagramHandle: value.instagramHandle || undefined,
    vertical: value.vertical || undefined,
    monthlyDms: value.monthlyDms || undefined,
    message: [value.message, plan ? `plan: ${plan}` : ""].filter(Boolean).join("\n") || undefined,
    utm,
    altcha,
  };

  const result = await publicApi<unknown>("/leads", { method: "POST", body: lead, clientIp: clientIp(request) });
  if (result.ok) {
    return json({ ok: true }, 201);
  }
  return json(mapProblem(result.problem), result.status === 422 || result.status === 400 ? 422 : result.status === 429 ? 429 : 502);
}

/** Maps backend Problem Details to the form's message keys. */
function mapProblem(problem: ProblemDetails | null): { error?: string; errors?: LeadErrors } {
  if (!problem) return { error: "server" };
  if (problem.title === "altcha.invalid" || problem.errors?.altcha) return { error: "botCheckFailed" };
  const errors: LeadErrors = {};
  for (const [field, keys] of Object.entries(problem.errors ?? {})) {
    const name = (field.charAt(0).toLowerCase() + field.slice(1)) as keyof LeadInput;
    if (keys.some((k) => k.includes("phone"))) errors.phone = "phoneInvalid";
    else if (name === "instagramHandle") errors.instagramHandle = "instagramInvalid";
    else if (["name", "message", "phone"].includes(name)) errors[name] = "required";
  }
  return Object.keys(errors).length > 0 ? { errors } : { error: "server" };
}
