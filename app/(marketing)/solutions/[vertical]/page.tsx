import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { features, getSolution, solutions } from "@/lib/content";
import { breadcrumbLd, faqLd, pageMetadata } from "@/lib/seo";
import { StartCta } from "@/components/cta";
import { Breadcrumbs, FaqList, JsonLd } from "@/components/content";
import { FeatureCard } from "@/components/feature-card";
import { Icon } from "@/components/icons";
import { IconBubble } from "@/components/ui";

export const dynamicParams = false;

export function generateStaticParams() {
  return solutions.map((s) => ({ vertical: s.slug }));
}

export async function generateMetadata({ params }: PageProps<"/solutions/[vertical]">) {
  const solution = getSolution((await params).vertical);
  return solution ? pageMetadata({ title: solution.title, description: solution.summary, path: `/solutions/${solution.slug}` }) : {};
}

export default async function SolutionPage({ params }: PageProps<"/solutions/[vertical]">) {
  const solution = getSolution((await params).vertical);
  if (!solution) notFound();
  const t = await getTranslations();
  const items = solution.features.flatMap((slug) => features.filter((f) => f.slug === slug));

  return (
    <>
      <JsonLd
        data={breadcrumbLd([
          { name: t("nav.home"), path: "/" },
          { name: solution.short, path: `/solutions/${solution.slug}` },
        ])}
      />
      {solution.faq.length > 0 ? <JsonLd data={faqLd(solution.faq)} /> : null}

      <header className="bg-hero border-b border-border">
        <div className="container-page grid items-center gap-10 py-12 sm:py-16 lg:grid-cols-[1.2fr_1fr]">
          <div>
            <Breadcrumbs items={[{ name: t("nav.home"), href: "/" }, { name: t("solutions.title") }, { name: solution.short }]} />
            <IconBubble name={solution.icon} className="size-12" />
            <h1 className="mt-5 text-3xl font-black leading-tight sm:text-4xl">{solution.title}</h1>
            <p className="mt-4 max-w-2xl text-lg leading-9 text-muted">{solution.summary}</p>
            <div className="mt-8">
              <StartCta size="lg" template={solution.slug} label={t("solutions.cta", { vertical: solution.short })} />
            </div>
          </div>

          <div className="rounded-[var(--radius-card)] border border-border bg-surface p-5 shadow-[var(--shadow-card)]">
            <p className="mb-4 text-sm font-bold text-muted">{t("solutions.typicalDms")}</p>
            <ul className="flex flex-col gap-2.5">
              {solution.typicalDms.map((dm, i) => (
                <li key={dm} className={`max-w-[85%] rounded-2xl px-4 py-2.5 leading-7 ${i % 2 === 0 ? "self-start rounded-ss-md bg-surface-2" : "self-start rounded-ss-md bg-brand-50 dark:bg-brand-950"}`}>
                  {dm}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </header>

      <div className="container-page grid gap-14 py-14 sm:py-20">
        <section aria-labelledby="get">
          <h2 id="get" className="mb-8 text-2xl font-black sm:text-3xl">
            {t("solutions.whatYouGet")}
          </h2>
          <div className="grid gap-5 sm:grid-cols-2">
            {items.map((f) => (
              <FeatureCard key={f.slug} feature={f} />
            ))}
          </div>
        </section>

        <section aria-labelledby="rules" className="grid gap-8 rounded-[2rem] bg-surface-2 p-8 sm:p-10 md:grid-cols-2">
          <div>
            <h2 id="rules" className="text-2xl font-black">
              {t("solutions.rules")}
            </h2>
            <p className="mt-3 leading-8 text-muted">{t("solutions.templateNote")}</p>
          </div>
          <ul className="space-y-4">
            {solution.rules.map((r) => (
              <li key={r} className="flex items-start gap-3 leading-8">
                <Icon name="shield" className="mt-1 size-5 shrink-0 text-brand-600" />
                {r}
              </li>
            ))}
          </ul>
        </section>

        <FaqList items={solution.faq} />
      </div>
    </>
  );
}
