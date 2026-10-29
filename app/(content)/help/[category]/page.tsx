import Link from "next/link";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { helpArticles, helpCategories } from "@/lib/content";
import { breadcrumbLd, pageMetadata } from "@/lib/seo";
import { Breadcrumbs, JsonLd } from "@/components/content";
import { PageHeader } from "@/components/ui";

export const dynamicParams = false;

export function generateStaticParams() {
  return helpCategories.map((c) => ({ category: c.slug }));
}

export async function generateMetadata({ params }: PageProps<"/help/[category]">) {
  const { category: slug } = await params;
  const found = helpCategories.find((c) => c.slug === slug);
  return found ? pageMetadata({ title: found.title, description: found.description, path: `/help/${found.slug}` }) : {};
}

export default async function HelpCategoryPage({ params }: PageProps<"/help/[category]">) {
  const { category: slug } = await params;
  const category = helpCategories.find((c) => c.slug === slug);
  if (!category) notFound();
  const t = await getTranslations();
  const articles = helpArticles.filter((a) => a.category === slug);
  return (
    <>
      <JsonLd data={breadcrumbLd([{ name: t("help.title"), path: "/help" }, { name: category.title, path: `/help/${slug}` }])} />
      <PageHeader title={category.title} subtitle={category.description}>
        <Breadcrumbs items={[{ name: t("help.title"), href: "/help" }, { name: category.title }]} />
      </PageHeader>
      <div className="container-page max-w-3xl py-12 sm:py-16">
        <ul className="space-y-3">
          {articles.map((a) => (
            <li key={a.slug}>
              <Link href={`/help/${slug}/${a.slug}`} className="block rounded-2xl border border-border bg-surface p-5 hover:border-brand-300">
                <p className="font-black">{a.title}</p>
                <p className="mt-1 text-sm leading-7 text-muted">{a.description}</p>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
