# ADR 0001: The website is its own repository, without shared frontend packages

**Status:** accepted (2026-10-29)

**Context.** The plans (`00-overview.md` section 4 and 10) assume one pnpm/Turborepo monorepo where the site, panel
and admin share `@pishkhan/ui`, `@pishkhan/i18n`, `@pishkhan/api-client` and friends. Parsa created three separate
repositories (`pishkhan-web`, `Pishkhan-user-panel`, `Pishkhan-adminpanel`) and the three apps are being built in
parallel.

**Decision.** This repo is a single Next.js app. What the shared packages would hold lives locally:
`lib/persian.ts` and `lib/dates.ts` (i18n utils), `components/ui.tsx` and `components/icons.tsx` (UI kit),
`lib/api.ts` (typed public API client), `app/globals.css` (design tokens). The site needs only a small slice of
the kit and none of the auth/BFF package (it has no logged-in pages).

**Consequences.** Design tokens (brand colors, radius, Vazirmatn) are duplicated in the panel and admin repos;
keep `app/globals.css` `@theme` values in sync, or extract a published `@pishkhan/tokens` package once all three
apps exist. The public API client is hand-written rather than orval-generated because the public document has two
endpoints today; switch to orval when BE-1.13 lands.
