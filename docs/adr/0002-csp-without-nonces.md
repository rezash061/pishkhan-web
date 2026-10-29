# ADR 0002: Static pages with a CSP that allows inline scripts from Next.js

**Status:** accepted (2026-10-29)

**Context.** The plan asks for a strict CSP with nonces. In Next.js a nonce is generated per request, which forces
every page to render dynamically. The site's performance target (LCP < 2.0 s on mid-range Android) and its caching
model (static generation + ISR + on-demand revalidation) depend on static HTML.

**Decision.** Keep pages static and send a CSP from `next.config.ts` that allows scripts only from this origin plus
`'unsafe-inline'` for Next.js' inline RSC bootstrap. Everything else is locked down: `default-src 'self'`,
`connect-src 'self'`, `img-src 'self' data: blob:`, `font-src 'self'`, `frame-ancestors 'none'`, `form-action 'self'`,
`object-src 'none'`, `base-uri 'self'`.

**Why this is acceptable here.** The site has no logged-in pages, no cookies of value and no user-generated HTML:
content is structured JSON rendered through an allowlist (`lib/blocks.ts`), JSON-LD escapes `<`. The inline-script
allowance therefore protects little that an attacker could reach.

**Revisit** if the site gains authenticated pages, or when Next.js supports hash-based CSP for static pages.
