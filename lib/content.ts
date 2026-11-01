import "server-only";
import { publicApi, type PublicPlan } from "./api";
import { env } from "./env";
import { fixturePlans } from "@/content/plans.fixture";

// Content loaders. Pages call these instead of importing content modules directly, so moving a type of content
// to the backend CMS (WS-1.1) changes only this file.

export { features, getFeature } from "@/content/features";
export { solutions, getSolution } from "@/content/solutions";
export { posts, getPost, sortedPosts, blogCategories } from "@/content/blog";
export { helpArticles, helpCategories, getHelpArticle } from "@/content/help";
export { legalDocs, getLegalDoc } from "@/content/legal";

/** Cache tag the backend's revalidation webhook targets when plans change. */
export const PLANS_TAG = "plans";

/** Matches the backend's 10-minute plan cache, so a publish shows here within about 10 minutes even without the webhook. */
export const PLANS_REVALIDATE_SECONDS = 600;

export type PlansResult = { source: "backend" | "fixtures"; plans: PublicPlan[] } | { source: "unavailable"; plans: [] };

/**
 * Plans come only from `GET /api/v1/public/plans` (plan WS-1.4: prices are never hard-coded). The response is
 * cached for 10 minutes and refreshed immediately when the backend calls `/api/revalidate` with tag `plans`.
 */
export async function getPlans(): Promise<PlansResult> {
  const result = await publicApi<PublicPlan[]>("/plans", { revalidate: PLANS_REVALIDATE_SECONDS, tags: [PLANS_TAG], timeoutMs: 5000 });
  if (result.ok && Array.isArray(result.data)) {
    const plans = result.data;
    if (plans.length > 0) {
      return { source: "backend", plans };
    }
  }
  return env.plansFallback ? { source: "fixtures", plans: fixturePlans } : { source: "unavailable", plans: [] };
}
