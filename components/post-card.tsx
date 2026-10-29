import Link from "next/link";
import { getTranslations } from "next-intl/server";
import type { Post } from "@/content/types";
import { blogCategories } from "@/content/blog";
import { readingMinutes } from "@/lib/blocks";
import { formatJalaliDate } from "@/lib/dates";
import { toPersianDigits } from "@/lib/persian";

export async function PostCard({ post }: { post: Post }) {
  const t = await getTranslations("common");
  const category = blogCategories.find((c) => c.slug === post.category);
  return (
    <article className="group relative flex flex-col rounded-[var(--radius-card)] border border-border bg-surface p-6 shadow-[var(--shadow-card)] transition-colors hover:border-brand-200 dark:hover:border-brand-800">
      {category ? <p className="text-xs font-bold text-brand-600">{category.title}</p> : null}
      <h2 className="mt-2 text-lg font-black leading-8">
        <Link href={`/blog/${post.slug}`} className="after:absolute after:inset-0 after:rounded-[var(--radius-card)] group-hover:text-brand-700 dark:group-hover:text-brand-300">
          {post.title}
        </Link>
      </h2>
      <p className="mt-2 flex-1 leading-8 text-muted">{post.description}</p>
      <p className="mt-4 text-xs text-muted">
        <time dateTime={post.publishedAt}>{formatJalaliDate(post.publishedAt)}</time> · {t("readingTime", { minutes: toPersianDigits(readingMinutes(post.body)) })}
      </p>
    </article>
  );
}
