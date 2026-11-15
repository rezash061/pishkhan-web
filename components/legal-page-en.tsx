import type { Metadata } from "next";
import { getLegalDocEn } from "@/content/legal-en";
import { pageMetadata } from "@/lib/seo";
import { BlockRenderer } from "./content";

// English legal pages (/en/privacy, /en/data-deletion), for Meta app review. They sit in the Persian site's chrome but
// their own content is marked lang="en" dir="ltr", so it reads left to right and screen readers use English.

export function legalMetadataEn(slug: string): Metadata {
  const doc = getLegalDocEn(slug);
  const base = pageMetadata({ title: doc.title, description: doc.description, path: `/en/${doc.slug}` });
  return {
    ...base,
    alternates: { ...base.alternates, languages: { fa: `/${doc.slug}`, en: `/en/${doc.slug}` } },
    openGraph: { ...base.openGraph, locale: "en_US" },
  };
}

const date = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });

export function LegalPageEn({ slug, children }: { slug: string; children?: React.ReactNode }) {
  const doc = getLegalDocEn(slug);
  return (
    <article lang="en" dir="ltr">
      <h1 className="text-3xl font-black leading-tight sm:text-4xl">{doc.title}</h1>
      <p className="mt-3 text-sm text-muted">
        Version {doc.version} · Last updated {date.format(new Date(doc.updatedAt))}
      </p>
      <div className="mt-8">
        <BlockRenderer blocks={doc.body} />
      </div>
      {children}
    </article>
  );
}
