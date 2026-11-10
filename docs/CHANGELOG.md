# Changelog

## Unreleased

### Changed (2026-11-10)
- The four Phase 2 features are live, no longer «به‌زودی». Their pages drop the waitlist notice and show the «live» badge, and the
  footer lists them. Copy now matches what the backend and panel ship:
  - **Card-to-card receipt verification** (BE-2.10). Duplicates are caught by reference number or image. Receipts sent during an
    order are taken automatically. Approval stays with the seller; auto-approve opens later as an option. Edited-image detection is
    no longer claimed.
  - **Zarinpal payment links** (BE-2.2), with the seller's own merchant id.
  - **Voice notes and Finglish** (BE-2.3, BE-2.4).
  - **Outage continuity** (BE-2.7). The outage notice in the panel, SMS only to customers who consented, a link to the shop's Bale
    bot, and Bale chats in the team inbox.
- Storefront: bulk price edit (BE-2.6) is no longer «به‌زودی». Importing products from the page's posts (BE-2.5) is mentioned.
- The receipts blog post describes the shipped feature instead of «به‌زودی».
- Build: npm replaces pnpm (`package-lock.json`, `npm ci` in CI and the Dockerfile).

### Changed (2026-10-31)
- Pricing uses the backend's real `GET /public/plans` shape (BE-1.11): nullable `tagline`, `description`, `isFree`, `limits`; plans revalidate every 10 minutes to match the backend cache.

### Added (2026-10-29, website Phase 0 and Phase 1 static scope)
- Next.js 16 App Router app with route groups `(marketing)`, `(content)`, `(legal)`; `fa` RTL, self-hosted variable
  Vazirmatn, light and dark tokens, Persian 404 and error pages (WS-0.1).
- Landing page with all 11 sections, live demo chat client, waitlist (WS-0.2, WS-1.2, WS-1.6 client side, plan 4.9).
- Legal pages: terms, privacy, data deletion with confirmation-code status lookup against the backend's Meta
  callback, refund policy, acceptable use (WS-0.3). Texts are drafts pending legal review.
- Umami first-party integration with `cta_click`, `waitlist_submit`, `contact_submit`, `demo_message` events (WS-0.4).
- Feature pages (11) and solution pages (5) with unique metadata, FAQ and breadcrumb JSON-LD (WS-1.3).
- Pricing page rendered only from `GET /public/plans`, monthly/annual toggle, metered vs unlimited explained, soft
  overage, comparison table (WS-1.4).
- Blog (posts, categories, table of contents, share links) and help center with Persian-normalizing client search (WS-1.5).
- Contact and about pages (WS-1.7); sign-up handoff with plan, template, UTM and ref, switchable by `SIGNUP_MODE` (WS-1.8).
- Route handlers: `/api/altcha`, `/api/leads`, `/api/demo-chat`, `/api/data-deletion/[code]`, HMAC-signed `/api/revalidate`.
- Sitemap, robots, web manifest; security headers; Dockerfile (standalone); CI (lint, typecheck, unit, e2e).
- Tests: 47 Vitest unit tests, 32 Playwright end-to-end tests (mobile and desktop) against a mock backend, with axe.
