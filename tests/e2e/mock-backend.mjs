// Minimal stand-in for the backend public API, used by the Playwright suite (and handy for local dev:
// `node tests/e2e/mock-backend.mjs` then `PISHKHAN_API_URL=http://localhost:5099 pnpm dev`).
import { createHash } from "node:crypto";
import { createServer } from "node:http";

const port = Number(process.env.MOCK_PORT ?? 5099);
const challenges = new Map();
const demoCounts = new Map();

const irr = (amount) => ({ amount, currency: "IRR" });
const plans = [
  { code: "free", name: "رایگان", tagline: "برای شروع", description: null, isFree: true, limits: { ai_conversations: 50 }, monthly: irr(0), annual: irr(0), aiConversations: 50, overagePerConversation: null, channelAccounts: 1, seats: 1, highlighted: false, features: [{ key: "rules", label: "اتوماسیون نامحدود", included: true, limit: null }, { key: "receipts", label: "بررسی رسید", included: false, limit: null }] },
  { code: "growth", name: "رشد", tagline: null, description: "برای فروشگاه‌های پرمشتری", isFree: false, limits: { ai_conversations: 2000 }, monthly: irr(9_990_000), annual: irr(99_900_000), aiConversations: 2000, overagePerConversation: irr(9_000), channelAccounts: 3, seats: 5, highlighted: true, features: [{ key: "rules", label: "اتوماسیون نامحدود", included: true, limit: null }, { key: "receipts", label: "بررسی رسید", included: true, limit: "۵۰۰ رسید" }] },
];

function send(res, status, body, type = "application/json") {
  res.writeHead(status, { "Content-Type": type });
  res.end(body === undefined ? "" : JSON.stringify(body));
}
const problem = (res, status, title, errors) => send(res, status, { type: "https://pishkhan.ir/problems/validation", title, status, errors }, "application/problem+json");

function verifyAltcha(payload) {
  try {
    const p = JSON.parse(Buffer.from(payload, "base64").toString("utf8"));
    const ok = challenges.get(p.challenge) === p.salt && createHash("sha256").update(p.salt + p.number).digest("hex") === p.challenge;
    challenges.delete(p.challenge);
    return ok;
  } catch {
    return false;
  }
}

async function body(req) {
  let raw = "";
  for await (const chunk of req) raw += chunk;
  return raw ? JSON.parse(raw) : {};
}

createServer(async (req, res) => {
  const url = new URL(req.url, "http://localhost");
  const path = url.pathname.replace(/^\/api\/v1\/public/, "");

  if (req.method === "GET" && path === "/altcha/challenge") {
    const salt = `${Math.random().toString(16).slice(2)}?expires=${Math.floor(Date.now() / 1000) + 300}`;
    const number = Math.floor(Math.random() * 2000);
    const challenge = createHash("sha256").update(salt + number).digest("hex");
    challenges.set(challenge, salt);
    return send(res, 200, { algorithm: "SHA-256", challenge, maxNumber: 2000, salt, signature: "mock" });
  }
  if (req.method === "GET" && path === "/plans") return send(res, 200, plans);
  if (req.method === "POST" && path === "/leads") {
    const lead = await body(req);
    if (!verifyAltcha(lead.altcha)) return problem(res, 400, "altcha.invalid", { altcha: ["altcha.invalid"] });
    if (lead.phone === "09120009999") return problem(res, 422, "validation", { Phone: ["validation.phone.invalid"] });
    return send(res, 201, { id: "0193f000-0000-7000-8000-000000000001" });
  }
  if (req.method === "POST" && path === "/demo-chat") {
    const chat = await body(req);
    if (chat.message === "busy") return send(res, 503, { title: "busy" });
    const count = (demoCounts.get(chat.sessionId) ?? 0) + 1;
    demoCounts.set(chat.sessionId, count);
    if (count > 10) return problem(res, 429, "demo.limit");
    return send(res, 200, { reply: "سلام! بله موجوده. قیمت ۱٬۲۸۰٬۰۰۰ تومان.", confidence: 0.92, sources: ["کاتالوگ"], remaining: 10 - count });
  }
  const deletion = path.match(/^\/meta\/instagram\/data-deletion\/([a-z0-9]+)$/);
  if (req.method === "GET" && deletion) {
    if (deletion[1] === "abcdef1234567890") return send(res, 200, { confirmationCode: deletion[1], status: "completed", createdAt: "2026-10-29T08:00:00Z" });
    return problem(res, 404, "not_found");
  }
  return problem(res, 404, "not_found");
}).listen(port, () => console.log(`mock backend on http://localhost:${port}`));
