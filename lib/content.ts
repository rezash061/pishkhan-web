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

export type PlansResult = { source: "backend" | "fixtures"; plans: PublicPlan[] } | { source: "unavailable"; plans: [] };

/**
 * Plans come only from `GET /api/v1/public/plans` (plan WS-1.4: prices are never hard-coded). The response is
 * cached for an hour and refreshed immediately when the backend calls `/api/revalidate` with tag `plans`.
 */
export async function getPlans(): Promise<PlansResult> {
  const result = await publicApi<PublicPlan[] | { items: PublicPlan[] }>("/plans", { revalidate: 3600, tags: [PLANS_TAG], timeoutMs: 5000 });
  if (result.ok) {
    const plans = Array.isArray(result.data) ? result.data : result.data.items;
    if (plans.length > 0) {
      return { source: "backend", plans };
    }
  }
  return env.plansFallback ? { source: "fixtures", plans: fixturePlans } : { source: "unavailable", plans: [] };
}
