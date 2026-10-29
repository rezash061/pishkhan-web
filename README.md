# Pishkhan public website (پیشخوان)

Public marketing site for Pishkhan, the AI sales assistant for Persian-speaking Instagram sellers: landing page,
features, solutions, pricing, blog, help center, legal pages (including the Meta data-deletion page) and the
waitlist. Plan: `plans/03-public-website.md` (shared decisions in `plans/00-overview.md`).

**Stack:** Next.js 16 (App Router, static generation + ISR), React 19, TypeScript strict, Tailwind CSS 4,
next-intl (`fa`, RTL), self-hosted Vazirmatn. No foreign CDNs, fonts or scripts at runtime.

## Run it

```bash
pnpm install
cp .env.example .env.local          # PLANS_FALLBACK=fixtures shows sample prices without a backend
pnpm dev                            # http://localhost:3000
```

Against the real backend set `PISHKHAN_API_URL` to the Api host (for example `http://localhost:5080` from the
backend's docker compose). To try the forms and demo chat without the backend:

```bash
node tests/e2e/mock-backend.mjs     # http://localhost:5099
PISHKHAN_API_URL=http://localhost:5099 pnpm dev
```

## Scripts

| Command | What it does |
|---|---|
| `pnpm build` / `pnpm start` | Production build (`output: "standalone"`) and server |
| `pnpm lint` / `pnpm typecheck` | ESLint (Next core web vitals) and `tsc` |
| `pnpm test` | Vitest unit tests (`tests/unit`) |
| `pnpm test:e2e` | Playwright on mobile and desktop against `tests/e2e/mock-backend.mjs`, with axe checks |

## Layout

```
app/(marketing)   landing, features/[slug], solutions/[vertical], pricing, compare, about, contact, waitlist
app/(content)     blog, blog/[slug], blog/category/[slug], help, help/[category]/[slug], help/search
app/(legal)       terms, privacy, data-deletion, refund-policy, acceptable-use
app/api           altcha, leads, demo-chat, data-deletion/[code], revalidate  (all proxy the backend public API)
content/          Persian content as typed data (moves to the backend CMS in WS-1.1)
lib/              api client, env, Persian digits/money/normalization, Jalali dates, ALTCHA solver, SEO, validation
messages/fa.json  UI strings
docs/             backend contract the site needs, ADRs, changelog
```

## Configuration

See `.env.example`. `SIGNUP_MODE=waitlist` during the closed beta (CTAs open `/waitlist`); `signup` sends visitors
to `PANEL_URL/signup?plan=…&utm_…`. Company details (legal name, address, phone, Telegram/Bale handles, eNamad)
are placeholders in `content/site.ts` and are hidden until filled in.

## Backend dependencies

`docs/backend-contract.md` lists what the backend already provides (ALTCHA, data-deletion status) and what the
site calls but the backend has not shipped yet (`GET /public/plans`, `POST /public/leads`, `POST /public/demo-chat`,
revalidation webhook). Until then: pricing shows "announced soon", the forms show a friendly error, and the demo
says it is not live yet.
