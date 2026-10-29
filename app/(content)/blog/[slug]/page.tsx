import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { blogCategories, getPost, posts, sortedPosts } from "@/lib/content";
import { absoluteUrl, blogPostingLd, breadcrumbLd, pageMetadata } from "@/lib/seo";
import { readingMinutes, tableOfContents } from "@/lib/blocks";
import { formatJalaliDate } from "@/lib/dates";
import { toPersianDigits } from "@/lib/persian";
import { StartCta } from "@/components/cta";
import { BlockRenderer, Breadcrumbs, JsonLd } from "@/components/content";
import { PostCard } from "@/components/post-card";
import { ShareLinks } from "@/components/share-links";

export const revalidate = 3600;
export const dynamicParams = false;

export function generateStaticParams() {
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/blog/[slug]">) {
  const post = getPost((await params).slug);
  return post ? pageMetadata({ title: post.title, description: post.description, path: `/blog/${post.slug}`, type: "article" }) : {};
}

export default async function PostPage({ params }: PageProps<"/blog/[slug]">) {
  const post = getPost((await params).slug);
  if (!post) notFound();
  const t = await getTranslations();
  const category = blogCategories.find((c) => c.slug === post.category);
  const toc = tableOfContents(post.body);
  const related = sortedPosts().filter((p) => p.slug !== post.slug).slice(0, 2);
  const path = `/blog/${post.slug}`;

  return (
    <>
      <JsonLd data={blogPostingLd({ ...post, path })} />
      <JsonLd
        data={breadcrumbLd([
          { name: t("blog.title"), path: "/blog" },
          ...(category ? [{ name: category.title, path: `/blog/category/${category.slug}` }] : []),
          { name: post.title, path },
        ])}
      />
      <article className="container-page py-12 sm:py-16">
        <header className="mx-auto max-w-3xl">
          <Breadcrumbs items={[{ name: t("blog.title"), href: "/blog" }, ...(category ? [{ name: category.title, href: `/blog/category/${category.slug}` }] : [])]} />
          <h1 className="text-3xl font-black leading-[1.5] sm:text-4xl">{post.title}</h1>
          <p className="mt-4 text-lg leading-9 text-muted">{post.description}</p>
          <p className="mt-4 text-sm text-muted">
            {t("blog.by", { author: post.author })} · <time dateTime={post.publishedAt}>{formatJalaliDate(post.publishedAt)}</time> · {t("common.readingTime", { minutes: toPersianDigits(readingMinutes(post.body)) })}
          </p>
        </header>

        <div className="mx-auto mt-10 grid max-w-5xl gap-10 lg:grid-cols-[1fr_15rem]">
          <div className="min-w-0 max-w-3xl">
            <BlockRenderer blocks={post.body} />
            <div className="mt-10 border-t border-border pt-6">
              <ShareLinks url={absoluteUrl(path)} title={post.title} />
            </div>
            <aside className="mt-10 rounded-[var(--radius-card)] bg-gradient-to-l from-brand-700 to-brand-500 p-6 text-white sm:p-8">
              <p className="text-xl font-black">{t("home.finalTitle")}</p>
              <p className="mt-2 leading-8 text-white/85">{t("home.finalSubtitle")}</p>
              <div className="mt-5">
                <StartCta variant="secondary" />
              </div>
            </aside>
          </div>
          {toc.length > 1 ? (
            <nav aria-label={t("common.tableOfContents")} className="order-first lg:order-last">
              <div className="rounded-2xl border border-border bg-surface p-5 lg:sticky lg:top-24">
                <p className="text-sm font-bold">{t("common.tableOfContents")}</p>
                <ol className="mt-3 space-y-2 text-sm">
                  {toc.map((item) => (
                    <li key={item.id}>
                      <a href={`#${item.id}`} className="text-muted hover:text-fg">
                        {item.text}
                      </a>
                    </li>
                  ))}
                </ol>
              </div>
            </nav>
          ) : null}
        </div>
      </article>

      {related.length > 0 ? (
        <section aria-labelledby="related" className="border-t border-border bg-surface-2/50 py-12">
          <div className="container-page">
            <h2 id="related" className="mb-6 text-2xl font-black">
              {t("common.related")}
            </h2>
            <div className="grid gap-5 sm:grid-cols-2">
              {related.map((p) => (
                <PostCard key={p.slug} post={p} />
              ))}
            </div>
          </div>
        </section>
      ) : null}
    </>
  );
}
