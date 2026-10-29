import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { features, getFeature, solutions } from "@/lib/content";
import { breadcrumbLd, faqLd, pageMetadata } from "@/lib/seo";
import { StartCta } from "@/components/cta";
import { Breadcrumbs, FaqList, JsonLd } from "@/components/content";
import { FeatureCard } from "@/components/feature-card";
import { Icon } from "@/components/icons";
import { Badge, IconBubble } from "@/components/ui";
import { toPersianDigits } from "@/lib/persian";

export const dynamicParams = false;

export function generateStaticParams() {
  return features.map((f) => ({ slug: f.slug }));
}

export async function generateMetadata({ params }: PageProps<"/features/[slug]">) {
  const feature = getFeature((await params).slug);
  return feature ? pageMetadata({ title: feature.title, description: feature.summary, path: `/features/${feature.slug}` }) : {};
}

export default async function FeaturePage({ params }: PageProps<"/features/[slug]">) {
  const feature = getFeature((await params).slug);
  if (!feature) notFound();
  const t = await getTranslations();
  const related = features.filter((f) => f.slug !== feature.slug && f.group === feature.group).slice(0, 3);
  const verticals = solutions.filter((s) => s.features.includes(feature.slug));
  const crumbs = [
    { name: t("nav.home"), path: "/" },
    { name: t("features.title"), path: "/features" },
    { name: feature.short, path: `/features/${feature.slug}` },
  ];

  return (
    <>
      <JsonLd data={breadcrumbLd(crumbs)} />
      {feature.faq.length > 0 ? <JsonLd data={faqLd(feature.faq)} /> : null}

      <header className="bg-hero border-b border-border">
        <div className="container-page py-12 sm:py-16">
          <Breadcrumbs items={[{ name: crumbs[0]!.name, href: "/" }, { name: crumbs[1]!.name, href: "/features" }, { name: feature.short }]} />
          <div className="flex flex-wrap items-center gap-3">
            <IconBubble name={feature.icon} className="size-12" />
            {feature.status === "soon" ? <Badge tone="soon">{t("common.soon")}</Badge> : <Badge tone="success">{t("common.live")}</Badge>}
          </div>
          <h1 className="mt-5 max-w-3xl text-3xl font-black leading-tight sm:text-4xl">{feature.title}</h1>
          <p className="mt-4 max-w-2xl text-lg leading-9 text-muted">{feature.summary}</p>
          <div className="mt-8">
            <StartCta size="lg" label={feature.status === "soon" ? t("nav.joinWaitlist") : undefined} />
          </div>
        </div>
      </header>

      <div className="container-page grid gap-14 py-14 sm:py-20">
        {feature.status === "soon" ? (
          <p role="note" className="rounded-2xl border border-amber-300 bg-amber-50 p-4 leading-8 text-amber-950 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-100">
            {t("features.soonNotice")}
          </p>
        ) : null}

        <section aria-labelledby="problem" className="max-w-3xl">
          <h2 id="problem" className="text-sm font-bold text-accent-600">
            {t("features.problem")}
          </h2>
          <p className="mt-3 text-xl font-medium leading-10">{feature.problem}</p>
        </section>

        <section aria-labelledby="how">
          <h2 id="how" className="mb-8 text-2xl font-black sm:text-3xl">
            {t("features.how")}
          </h2>
          <ol className="grid gap-5 md:grid-cols-3">
            {feature.steps.map((step, i) => (
              <li key={step.title} className="rounded-[var(--radius-card)] border border-border bg-surface p-6">
                <span className="flex size-9 items-center justify-center rounded-full bg-brand-600 font-black text-white">{toPersianDigits(i + 1)}</span>
                <h3 className="mt-4 text-lg font-black">{step.title}</h3>
                <p className="mt-2 leading-8 text-muted">{step.text}</p>
              </li>
            ))}
          </ol>
        </section>

        {feature.different.length > 0 ? (
          <section aria-labelledby="different" className="rounded-[2rem] bg-surface-2 p-8 sm:p-10">
            <h2 id="different" className="text-2xl font-black sm:text-3xl">
              {t("features.different")}
            </h2>
            <ul className="mt-6 grid gap-4 md:grid-cols-2">
              {feature.different.map((d) => (
                <li key={d} className="flex items-start gap-3 leading-8">
                  <Icon name="check" className="mt-1.5 size-5 shrink-0 text-success" />
                  {d}
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        {verticals.length > 0 ? (
          <section aria-labelledby="verticals">
            <h2 id="verticals" className="mb-4 text-lg font-black">
              {t("home.verticalsTitle")}
            </h2>
            <ul className="flex flex-wrap gap-2">
              {verticals.map((v) => (
                <li key={v.slug}>
                  <a href={`/solutions/${v.slug}`} className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-4 py-2 font-medium hover:border-brand-300">
                    <Icon name={v.icon} className="size-4 text-brand-600" />
                    {v.short}
                  </a>
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        <FaqList items={feature.faq} />

        {related.length > 0 ? (
          <section aria-labelledby="related">
            <h2 id="related" className="mb-6 text-2xl font-black">
              {t("common.related")}
            </h2>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((f) => (
                <FeatureCard key={f.slug} feature={f} />
              ))}
            </div>
          </section>
        ) : null}
      </div>
    </>
  );
}
