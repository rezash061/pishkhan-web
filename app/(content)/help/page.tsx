import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { helpArticles, helpCategories } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";
import { HelpSearchBox } from "@/components/help-search";
import { Icon } from "@/components/icons";
import { PageHeader } from "@/components/ui";

export const revalidate = 3600;

export async function generateMetadata() {
  const t = await getTranslations("help");
  return pageMetadata({ title: t("title"), description: t("subtitle"), path: "/help" });
}

export default async function HelpPage() {
  const t = await getTranslations("help");
  return (
    <>
      <PageHeader title={t("title")} subtitle={t("subtitle")}>
        <div className="mb-8">
          <HelpSearchBox />
        </div>
      </PageHeader>
      <div className="container-page grid gap-6 py-12 sm:py-16 md:grid-cols-3">
        {helpCategories.map((c) => {
          const articles = helpArticles.filter((a) => a.category === c.slug);
          return (
            <section key={c.slug} aria-labelledby={`cat-${c.slug}`} className="rounded-[var(--radius-card)] border border-border bg-surface p-6">
              <h2 id={`cat-${c.slug}`} className="text-lg font-black">
                <Link href={`/help/${c.slug}`} className="hover:text-brand-700">
                  {c.title}
                </Link>
              </h2>
              <p className="mt-1 text-sm leading-7 text-muted">{c.description}</p>
              <ul className="mt-4 space-y-2">
                {articles.map((a) => (
                  <li key={a.slug}>
                    <Link href={`/help/${c.slug}/${a.slug}`} className="flex items-start gap-2 rounded-lg py-1 leading-7 hover:text-brand-700">
                      <Icon name="chevron" className="mt-1.5 size-4 shrink-0 text-muted" />
                      {a.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          );
        })}
      </div>
    </>
  );
}
