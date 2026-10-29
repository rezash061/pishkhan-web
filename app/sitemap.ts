import type { MetadataRoute } from "next";
import { blogCategories, features, helpArticles, helpCategories, legalDocs, posts, solutions } from "@/lib/content";
import { absoluteUrl } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  const page = (path: string, priority: number, lastModified?: string): MetadataRoute.Sitemap[number] => ({
    url: absoluteUrl(path),
    priority,
    ...(lastModified ? { lastModified } : {}),
  });
  return [
    page("/", 1),
    page("/pricing", 0.9),
    page("/features", 0.8),
    ...features.map((f) => page(`/features/${f.slug}`, 0.8)),
    ...solutions.map((s) => page(`/solutions/${s.slug}`, 0.8)),
    page("/compare", 0.6),
    page("/about", 0.5),
    page("/contact", 0.5),
    page("/waitlist", 0.6),
    page("/blog", 0.7),
    ...blogCategories.map((c) => page(`/blog/category/${c.slug}`, 0.4)),
    ...posts.map((p) => page(`/blog/${p.slug}`, 0.6, p.updatedAt ?? p.publishedAt)),
    page("/help", 0.6),
    ...helpCategories.map((c) => page(`/help/${c.slug}`, 0.4)),
    ...helpArticles.map((a) => page(`/help/${a.category}/${a.slug}`, 0.5, a.updatedAt)),
    ...legalDocs.map((d) => page(`/${d.slug}`, 0.3, d.updatedAt)),
  ];
}
