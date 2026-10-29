import Link from "next/link";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { getHelpArticle, helpArticles, helpCategories } from "@/lib/content";
import { breadcrumbLd, pageMetadata } from "@/lib/seo";
import { formatJalaliDate } from "@/lib/dates";
import { BlockRenderer, Breadcrumbs, JsonLd } from "@/components/content";
import { buttonClass } from "@/components/ui";

export const revalidate = 3600;
export const dynamicParams = false;

export function generateStaticParams() {
  return helpArticles.map((a) => ({ category: a.category, slug: a.slug }));
}

export async function generateMetadata({ params }: PageProps<"/help/[category]/[slug]">) {
  const { category, slug } = await params;
  const article = getHelpArticle(category, slug);
  return article ? pageMetadata({ title: article.title, description: article.description, path: `/help/${category}/${slug}`, type: "article" }) : {};
}

export default async function HelpArticlePage({ params }: PageProps<"/help/[category]/[slug]">) {
  const { category: categorySlug, slug } = await params;
  const article = getHelpArticle(categorySlug, slug);
  const category = helpCategories.find((c) => c.slug === categorySlug);
  if (!article || !category) notFound();
  const t = await getTranslations();
  const path = `/help/${categorySlug}/${slug}`;
  const siblings = helpArticles.filter((a) => a.category === categorySlug && a.slug !== slug);

  return (
    <>
      <JsonLd
        data={breadcrumbLd([
          { name: t("help.title"), path: "/help" },
          { name: category.title, path: `/help/${categorySlug}` },
          { name: article.title, path },
        ])}
      />
      <div className="container-page grid gap-10 py-12 sm:py-16 lg:grid-cols-[1fr_16rem]">
        <article className="min-w-0 max-w-3xl">
          <Breadcrumbs items={[{ name: t("help.title"), href: "/help" }, { name: category.title, href: `/help/${categorySlug}` }]} />
          <h1 className="text-3xl font-black leading-[1.5]">{article.title}</h1>
          <p className="mt-3 text-lg leading-9 text-muted">{article.description}</p>
          <p className="mt-2 text-sm text-muted">{t("common.lastUpdated", { date: formatJalaliDate(article.updatedAt) })}</p>
          <div className="mt-6">
            <BlockRenderer blocks={article.body} />
          </div>
          <div className="mt-12 flex flex-col items-start gap-3 rounded-[var(--radius-card)] bg-surface-2 p-6 sm:flex-row sm:items-center sm:justify-between">
            <p className="font-bold">{t("help.stillNeedHelp")}</p>
            <Link href="/contact" className={buttonClass("secondary")}>
              {t("help.contactSupport")}
            </Link>
          </div>
        </article>
        {siblings.length > 0 ? (
          <nav aria-label={category.title}>
            <div className="rounded-2xl border border-border bg-surface p-5 lg:sticky lg:top-24">
              <p className="text-sm font-bold">{category.title}</p>
              <ul className="mt-3 space-y-2 text-sm">
                {siblings.map((a) => (
                  <li key={a.slug}>
                    <Link href={`/help/${a.category}/${a.slug}`} className="text-muted hover:text-fg">
                      {a.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </nav>
        ) : null}
      </div>
    </>
  );
}
