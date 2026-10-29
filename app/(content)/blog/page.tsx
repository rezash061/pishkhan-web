import { getTranslations } from "next-intl/server";
import { sortedPosts } from "@/lib/content";
import { CategoryNav } from "@/components/category-nav";
import { pageMetadata } from "@/lib/seo";
import { PostCard } from "@/components/post-card";
import { PageHeader } from "@/components/ui";

export const revalidate = 3600;

export async function generateMetadata() {
  const t = await getTranslations("blog");
  return pageMetadata({ title: t("title"), description: t("subtitle"), path: "/blog" });
}

export default async function BlogPage() {
  const t = await getTranslations("blog");
  return (
    <>
      <PageHeader title={t("title")} subtitle={t("subtitle")} />
      <div className="container-page py-12 sm:py-16">
        <CategoryNav active={null} allLabel={t("allPosts")} label={t("categories")} />
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {sortedPosts().map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>
      </div>
    </>
  );
}
