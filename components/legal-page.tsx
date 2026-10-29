import { getTranslations } from "next-intl/server";
import { getLegalDoc } from "@/lib/content";
import { formatJalaliDate } from "@/lib/dates";
import { pageMetadata } from "@/lib/seo";
import { BlockRenderer } from "./content";

export function legalMetadata(slug: string) {
  const doc = getLegalDoc(slug);
  return pageMetadata({ title: doc.title, description: doc.description, path: `/${doc.slug}` });
}

export async function LegalPage({ slug, children }: { slug: string; children?: React.ReactNode }) {
  const t = await getTranslations("common");
  const doc = getLegalDoc(slug);
  return (
    <article>
      <h1 className="text-3xl font-black leading-tight sm:text-4xl">{doc.title}</h1>
      <p className="mt-3 text-sm text-muted">
        {t("version", { version: doc.version })} · {t("lastUpdated", { date: formatJalaliDate(doc.updatedAt) })}
      </p>
      <div className="mt-8">
        <BlockRenderer blocks={doc.body} />
      </div>
      {children}
    </article>
  );
}
