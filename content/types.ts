// Structured content. The shapes match what the backend Content module (BE-1.13) will serve, so swapping the
// static modules in this folder for CMS fetches changes the loaders in lib/content.ts, not the pages.

export type Block =
  | { type: "p"; text: string }
  | { type: "h2"; text: string; id?: string }
  | { type: "h3"; text: string }
  | { type: "ul"; items: string[] }
  | { type: "ol"; items: string[] }
  | { type: "callout"; tone: "info" | "warning"; text: string }
  | { type: "quote"; text: string };

export interface Faq {
  q: string;
  a: string;
}

export type FeatureStatus = "live" | "soon";

export interface Feature {
  slug: string;
  title: string;
  /** Short name used on cards and in the nav. */
  short: string;
  /** Target Persian search keyword (SEO). */
  keyword: string;
  summary: string;
  status: FeatureStatus;
  /** `differentiator` features get a deep-dive section on the landing page. */
  group: "core" | "differentiator";
  icon: IconName;
  problem: string;
  steps: { title: string; text: string }[];
  different: string[];
  faq: Faq[];
}

export interface Solution {
  slug: string;
  title: string;
  short: string;
  keyword: string;
  summary: string;
  icon: IconName;
  typicalDms: string[];
  features: string[];
  rules: string[];
  faq: Faq[];
}

export interface Post {
  slug: string;
  title: string;
  description: string;
  category: string;
  author: string;
  publishedAt: string;
  updatedAt?: string;
  body: Block[];
}

export interface Category {
  slug: string;
  title: string;
  description: string;
}

export interface HelpArticle {
  slug: string;
  category: string;
  title: string;
  description: string;
  updatedAt: string;
  body: Block[];
}

export interface LegalDoc {
  slug: string;
  title: string;
  description: string;
  version: string;
  updatedAt: string;
  body: Block[];
}

export type IconName =
  | "sparkles"
  | "message"
  | "comment"
  | "inbox"
  | "store"
  | "form"
  | "chart"
  | "receipt"
  | "link"
  | "mic"
  | "shield"
  | "signal"
  | "shirt"
  | "lipstick"
  | "gem"
  | "stethoscope"
  | "book"
  | "lock"
  | "check"
  | "phone"
  | "users"
  | "bolt";
