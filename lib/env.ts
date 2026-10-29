import "server-only";

// Server-side configuration. Every value has a safe default so `next build` works without a backend.

function read(name: string, fallback = ""): string {
  const value = process.env[name];
  return value === undefined || value === "" ? fallback : value;
}

export const env = {
  /** Backend Api host, for example `http://api:8080` inside the cluster. Paths add `/api/v1/public/...`. */
  apiUrl: read("PISHKHAN_API_URL", "http://localhost:5080").replace(/\/+$/, ""),
  /** Public origin of this site, used for canonical URLs, sitemap and Open Graph. */
  siteUrl: read("SITE_URL", "https://pishkhan.ir").replace(/\/+$/, ""),
  /** User panel origin; «شروع رایگان» and «ورود» link here. */
  panelUrl: read("PANEL_URL", "https://app.pishkhan.ir").replace(/\/+$/, ""),
  /** `waitlist` during closed beta, `signup` once sign-up opens (plan 4.9). */
  signupMode: read("SIGNUP_MODE", "waitlist") === "signup" ? ("signup" as const) : ("waitlist" as const),
  /** Shared HMAC secret for `POST /api/revalidate` (backend Content module). Empty disables the endpoint. */
  revalidateSecret: read("REVALIDATE_SECRET"),
  /** Self-hosted Umami. Empty disables analytics. The script is served first-party under `/stats/`. */
  umamiWebsiteId: read("UMAMI_WEBSITE_ID"),
  /**
   * `fixtures` renders sample plans when `GET /public/plans` is unavailable (development and CI only).
   * In production leave it empty: the pricing page then says prices are announced soon instead of inventing them.
   */
  plansFallback: read("PLANS_FALLBACK") === "fixtures",
};
