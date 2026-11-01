# Backend contract the website needs

The site calls only the backend's public API (`/api/v1/public/*`, `backend/openapi/public.v1.json` in
`rezash061/pishkhan-backend`). This file lists what exists today and what the site already calls but the backend
has not shipped yet (backend work package **BE-1.13 Content and public APIs**).
The site degrades gracefully until each one exists.

## Already in `public.v1.json` (used as is)

| Endpoint | Used by | Notes |
|---|---|---|
| `GET /altcha/challenge` | `/api/altcha` → lead form, demo chat | Solved in the browser (`lib/altcha.ts`), solution sent as `altcha` (base64 JSON), verified once by the backend. |
| `GET /plans` | `/pricing`, landing pricing teaser, `SoftwareApplication` JSON-LD | Backend Billing (BE-1.11, backend PR #22). Plain array of `PublicPlan` in display order, only published plans, cached 10 minutes by the backend; the site revalidates every 10 minutes too, or at once via the `plans` tag. If it fails or returns no plans: production says prices are announced soon, dev/CI shows sample plans (`PLANS_FALLBACK=fixtures`). |
| `GET /meta/instagram/data-deletion/{code}` | `/data-deletion?code=` status lookup | Statuses `received`, `processing`, `completed`. The backend's `Instagram:DataDeletionStatusUrl` default `https://pishkhan.ir/data-deletion` matches this page. |

## Proposed, not in the backend yet

Shapes are defined in `lib/api.ts` (`LeadRequest`, `DemoChatRequest/Response`). Field names follow
the shared conventions (camelCase, Money as `{ amount, currency }` in Rial, Problem Details with message keys).

### `POST /leads` (Content, plan section 9.16)
Body `LeadRequest`: `type` (`waitlist` | `contact`), `phone` (normalized `09xxxxxxxxx`), optional `name`,
`instagramHandle`, `vertical`, `monthlyDms`, `message`, `utm` (map of `utm_*` and `ref`), and `altcha`.
Responses: `201`; `400` with title `altcha.invalid` (or `errors.altcha`); `422` with `errors` keyed by field
(for example `"phone": ["validation.phone.invalid"]`); `429` when rate-limited. The site forwards the visitor IP
in `X-Forwarded-For`. Until it exists the form shows a Persian "try again or contact us on Telegram/Bale" error.

### `POST /demo-chat` (Content + Agent, plan section 9.16)
Body `{ sessionId: uuid, message: string (≤ 500), altcha?: string }` (ALTCHA is sent on the first message of a
session). Response `{ reply, confidence (0..1), sources: string[], remaining }`. When the 10-message cap is hit,
`429` with title `demo.limit`. Until it exists the chat shows «نسخه نمایشی هنوز راه‌اندازی نشده است».

### Revalidation webhook (Content and Billing → site)
After a publish the backend calls `POST {SITE_URL}/api/revalidate` with body `{ "tags": ["plans"], "paths": ["/blog/x"] }`
and headers `X-Pishkhan-Timestamp: <unix seconds>`, `X-Pishkhan-Signature: sha256=<hex HMAC-SHA256(secret, "<timestamp>.<raw body>")>`.
Requests more than 5 minutes off are rejected. Tag in use today: `plans`.

### Later (WS-1.1, CMS)
`GET /pages/{slug}`, `GET /posts?cursor=`, `GET /posts/{slug}`, `GET /help/search?q=`, `GET /case-studies`. The content
now lives in `content/*.ts` with the same block shapes (`content/types.ts`); switching means changing `lib/content.ts`.
