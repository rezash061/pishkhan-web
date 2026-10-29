import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { blogCategories, sortedPosts } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";
import { PostCard } from "@/components/post-card";
import { PageHeader } from "@/components/ui";
import { CategoryNav } from "@/components/category-nav";

export const dynamicParams = false;

export function generateStaticParams() {
  return blogCategories.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: PageProps<"/blog/category/[slug]">) {
  const { slug } = await params;
  const found = blogCategories.find((c) => c.slug === slug);
  return found ? pageMetadata({ title: found.title, description: found.description, path: `/blog/category/${found.slug}` }) : {};
}

export default async function BlogCategoryPage({ params }: PageProps<"/blog/category/[slug]">) {
  const { slug } = await params;
  const category = blogCategories.find((c) => c.slug === slug);
  if (!category) notFound();
  const t = await getTranslations("blog");
  const items = sortedPosts().filter((p) => p.category === slug);
  return (
    <>
      <PageHeader title={category.title} subtitle={category.description} />
      <div className="container-page py-12 sm:py-16">
        <CategoryNav active={slug} allLabel={t("allPosts")} label={t("categories")} />
        {items.length === 0 ? (
          <p className="mt-8 text-muted">{t("empty")}</p>
        ) : (
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((post) => (
              <PostCard key={post.slug} post={post} />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
