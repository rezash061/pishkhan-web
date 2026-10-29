import "server-only";
import type { Metadata } from "next";
import { env } from "./env";
import { company } from "@/content/site";
import type { Faq } from "@/content/types";

export function absoluteUrl(path: string): string {
  return `${env.siteUrl}${path.startsWith("/") ? path : `/${path}`}`;
}

/** Page metadata with Persian defaults, canonical URL and Open Graph locale `fa_IR`. */
export function pageMetadata(input: { title: string; description: string; path: string; type?: "website" | "article"; noIndex?: boolean }): Metadata {
  const url = absoluteUrl(input.path);
  return {
    title: input.title,
    description: input.description,
    alternates: { canonical: url },
    openGraph: {
      title: input.title,
      description: input.description,
      url,
      siteName: company.brand,
      locale: "fa_IR",
      type: input.type ?? "website",
    },
    twitter: { card: "summary_large_image", title: input.title, description: input.description },
    robots: input.noIndex ? { index: false, follow: true } : undefined,
  };
}

// ---- JSON-LD builders (schema.org) ----

export function organizationLd() {
  const contactPoint = [
    company.phone ? { "@type": "ContactPoint", telephone: company.phone, contactType: "customer support", availableLanguage: "fa" } : null,
    { "@type": "ContactPoint", email: company.email, contactType: "customer support", availableLanguage: "fa" },
  ].filter(Boolean);
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: company.brand,
    alternateName: company.brandLatin,
    ...(company.legalName ? { legalName: company.legalName } : {}),
    url: env.siteUrl,
    logo: absoluteUrl("/icon.svg"),
    contactPoint,
    ...(company.address ? { address: { "@type": "PostalAddress", streetAddress: company.address, addressCountry: "IR" } } : {}),
  };
}

export function faqLd(faq: Faq[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  };
}

export function breadcrumbLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({ "@type": "ListItem", position: i + 1, name: item.name, item: absoluteUrl(item.path) })),
  };
}

export function softwareApplicationLd(offers: { name: string; price: number }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: company.brand,
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    inLanguage: "fa",
    url: env.siteUrl,
    ...(offers.length > 0
      ? { offers: offers.map((o) => ({ "@type": "Offer", name: o.name, price: o.price, priceCurrency: "IRR" })) }
      : {}),
  };
}

export function blogPostingLd(post: { title: string; description: string; path: string; publishedAt: string; updatedAt?: string; author: string }) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    inLanguage: "fa",
    datePublished: post.publishedAt,
    dateModified: post.updatedAt ?? post.publishedAt,
    author: { "@type": "Organization", name: post.author },
    publisher: { "@type": "Organization", name: company.brand, logo: { "@type": "ImageObject", url: absoluteUrl("/icon.svg") } },
    mainEntityOfPage: absoluteUrl(post.path),
  };
}
