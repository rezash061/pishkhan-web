import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { features, solutions, getPlans } from "@/lib/content";
import { env } from "@/lib/env";
import { faqLd, organizationLd, pageMetadata, softwareApplicationLd } from "@/lib/seo";
import { formatToman } from "@/lib/persian";
import { howItWorks, landingFaq, outcomes, trustPoints } from "@/content/site";
import { StartCta } from "@/components/cta";
import { FaqList, JsonLd } from "@/components/content";
import { DemoChat } from "@/components/demo-chat";
import { FeatureCard } from "@/components/feature-card";
import { Icon } from "@/components/icons";
import { LeadForm } from "@/components/lead-form";
import { PhoneMockup } from "@/components/phone-mockup";
import { buildSignupUrl } from "@/components/signup-link";
import { Badge, ButtonLink, Card, IconBubble, SectionHeading } from "@/components/ui";

export const revalidate = 3600;

export async function generateMetadata() {
  const t = await getTranslations("brand");
  return {
    ...pageMetadata({
      title: `${t("name")} | ربات فروش و دایرکت هوشمند اینستاگرام`,
      description: "پاسخ‌گوی هوش مصنوعی دایرکت اینستاگرام برای فروشندگان ایرانی: فارسی محاوره و فینگلیش، بررسی رسید کارت‌به‌کارت، لینک پرداخت و ادامه فروش در قطعی اینستاگرام.",
      path: "/",
    }),
    title: { absolute: `${t("name")} | ربات فروش و دایرکت هوشمند اینستاگرام` },
  };
}

export default async function HomePage() {
  const t = await getTranslations();
  const plans = await getPlans();
  const core = features.filter((f) => f.group === "core");
  const diff = features.filter((f) => f.group === "differentiator");
  const paid = plans.plans.filter((p) => p.monthly && p.monthly.amount > 0);
  const cheapest = paid.length > 0 ? Math.min(...paid.map((p) => p.monthly!.amount)) : null;
  const registerHref = env.signupMode === "waitlist" ? "/waitlist" : buildSignupUrl(env.panelUrl, {});
  const heroPoints = t.raw("home.heroPoints") as string[];

  return (
    <>
      <JsonLd data={organizationLd()} />
      <JsonLd data={softwareApplicationLd(plans.source === "backend" ? plans.plans.flatMap((p) => (p.monthly ? [{ name: p.name, price: p.monthly.amount }] : [])) : [])} />
      <JsonLd data={faqLd(landingFaq)} />

      {/* 1. Hero */}
      <section className="bg-hero overflow-hidden">
        <div className="container-page grid items-center gap-12 py-14 sm:py-20 lg:grid-cols-[1.15fr_1fr]">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full border border-brand-200 bg-brand-50 px-3 py-1 text-xs font-bold text-brand-700 dark:border-brand-800 dark:bg-brand-950 dark:text-brand-200">
              <Icon name="lock" className="size-3.5" />
              {t("home.eyebrow")}
            </p>
            <h1 className="mt-5 text-4xl font-black leading-[1.35] sm:text-5xl sm:leading-[1.3]">
              <span className="text-gradient">{t("home.heroTitle")}</span>
            </h1>
            <p className="mt-5 text-xl font-medium leading-9 text-fg/85">{t("home.heroSubtitle")}</p>
            <ul className="mt-6 space-y-3">
              {heroPoints.map((point) => (
                <li key={point} className="flex items-start gap-3 leading-8 text-muted">
                  <span className="mt-1.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-brand-600 text-white">
                    <Icon name="check" className="size-3" strokeWidth={3} />
                  </span>
                  {point}
                </li>
              ))}
            </ul>
            <div className="mt-8 flex flex-wrap gap-3">
              <StartCta size="lg" />
              <ButtonLink href="#demo" variant="secondary" size="lg">
                {t("home.heroSecondary")}
              </ButtonLink>
            </div>
          </div>
          <PhoneMockup label={t("home.mockupLabel")} />
        </div>
      </section>

      {/* 2. Live demo */}
      <section id="demo" className="scroll-mt-20 py-16 sm:py-24">
        <div className="container-page grid items-center gap-10 lg:grid-cols-[1fr_1.1fr]">
          <div>
            <SectionHeading center={false} title={t("demo.title")} subtitle={t("demo.subtitle")} />
            <ul className="space-y-4">
              {(t.raw("home.demoPoints") as string[]).map((item) => (
                <li key={item} className="flex items-center gap-3 font-medium">
                  <Icon name="check" className="size-5 text-success" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <DemoChat registerHref={registerHref} />
        </div>
      </section>

      {/* 3. Outcomes */}
      <section className="border-y border-border bg-surface py-16 sm:py-20">
        <div className="container-page">
          <SectionHeading title={t("home.outcomesTitle")} />
          <div className="grid gap-6 md:grid-cols-3">
            {outcomes.map((o) => (
              <div key={o.title} className="rounded-[var(--radius-card)] bg-surface-2 p-6">
                <IconBubble name={o.icon} />
                <h3 className="mt-4 text-lg font-black">{o.title}</h3>
                <p className="mt-2 leading-8 text-muted">{o.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. How it works */}
      <section className="py-16 sm:py-24">
        <div className="container-page">
          <SectionHeading title={t("home.howTitle")} subtitle={t("home.howSubtitle")} />
          <ol className="grid gap-6 md:grid-cols-3">
            {howItWorks.map((step, i) => (
              <li key={step.title} className="relative rounded-[var(--radius-card)] border border-border bg-surface p-6">
                <span className="text-gradient text-4xl font-black">{["۱", "۲", "۳"][i]}</span>
                <h3 className="mt-3 text-lg font-black">{step.title}</h3>
                <p className="mt-2 leading-8 text-muted">{step.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* 5. Feature grid */}
      <section className="bg-surface-2/60 py-16 sm:py-24">
        <div className="container-page">
          <SectionHeading title={t("home.featuresTitle")} subtitle={t("home.featuresSubtitle")} />
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {core.slice(0, 6).map((f) => (
              <FeatureCard key={f.slug} feature={f} />
            ))}
          </div>
        </div>
      </section>

      {/* 6. Differentiators */}
      <section className="py-16 sm:py-24">
        <div className="container-page">
          <SectionHeading title={t("home.diffTitle")} subtitle={t("home.diffSubtitle")} />
          <div className="grid gap-5 md:grid-cols-2">
            {diff.map((f) => (
              <Link key={f.slug} href={`/features/${f.slug}`} className="group flex gap-5 rounded-[var(--radius-card)] border border-border bg-surface p-6 transition-colors hover:border-brand-300 dark:hover:border-brand-700">
                <IconBubble name={f.icon} className="size-13 bg-gradient-to-br from-brand-500 to-accent-500 text-white dark:text-white" />
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-lg font-black">{f.title}</h3>
                    {f.status === "soon" ? <Badge tone="soon">{t("common.soon")}</Badge> : null}
                  </div>
                  <p className="mt-2 leading-8 text-muted">{f.summary}</p>
                </div>
              </Link>
            ))}
            <Link href="/pricing" className="group flex gap-5 rounded-[var(--radius-card)] border border-border bg-surface p-6 transition-colors hover:border-brand-300 md:col-span-2 dark:hover:border-brand-700">
              <IconBubble name="check" className="size-13 bg-gradient-to-br from-brand-500 to-accent-500 text-white dark:text-white" />
              <div>
                <h3 className="text-lg font-black">{t("home.honestPricing")}</h3>
                <p className="mt-2 leading-8 text-muted">{t("home.pricingSubtitle")}</p>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* 7. Verticals */}
      <section className="border-y border-border bg-surface py-16 sm:py-20">
        <div className="container-page">
          <SectionHeading title={t("home.verticalsTitle")} />
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {solutions.map((s) => (
              <Link key={s.slug} href={`/solutions/${s.slug}`} className="flex flex-col items-center gap-3 rounded-[var(--radius-card)] border border-border bg-bg p-5 text-center transition-colors hover:border-brand-300 dark:hover:border-brand-700">
                <IconBubble name={s.icon} />
                <span className="font-bold">{s.short}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 8. Trust */}
      <section className="py-16 sm:py-24">
        <div className="container-page">
          <SectionHeading title={t("home.trustTitle")} />
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {trustPoints.map((p) => (
              <Card key={p.title}>
                <IconBubble name={p.icon} />
                <h3 className="mt-4 font-black">{p.title}</h3>
                <p className="mt-2 text-sm leading-7 text-muted">{p.text}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* 9. Pricing teaser */}
      <section className="pb-16 sm:pb-24">
        <div className="container-page">
          <div className="flex flex-col items-start gap-6 rounded-[2rem] bg-gradient-to-l from-brand-700 via-brand-600 to-accent-500 p-8 text-white sm:p-12 md:flex-row md:items-center md:justify-between">
            <div className="max-w-xl">
              <h2 className="text-2xl font-black sm:text-3xl">{t("home.pricingTitle")}</h2>
              <p className="mt-3 leading-8 text-white/85">
                {t("home.pricingSubtitle")}
                {cheapest !== null ? ` ${t("home.pricingFrom", { price: formatToman(cheapest) })}` : ""}
              </p>
            </div>
            <ButtonLink href="/pricing" variant="secondary" size="lg" arrow className="border-transparent">
              {t("home.pricingCta")}
            </ButtonLink>
          </div>
        </div>
      </section>

      {/* 10. FAQ */}
      <section className="pb-16 sm:pb-24">
        <div className="container-page">
          <FaqList items={landingFaq} />
        </div>
      </section>

      {/* 11. Final CTA (waitlist form during closed beta) */}
      <section id="waitlist" className="scroll-mt-20 border-t border-border bg-surface py-16 sm:py-24">
        <div className="container-page grid gap-10 lg:grid-cols-[1fr_1.2fr]">
          <div>
            <h2 className="text-3xl font-black leading-snug">{t("home.finalTitle")}</h2>
            <p className="mt-4 text-lg leading-9 text-muted">{env.signupMode === "waitlist" ? t("waitlist.subtitle") : t("home.finalSubtitle")}</p>
          </div>
          {env.signupMode === "waitlist" ? (
            <LeadForm type="waitlist" />
          ) : (
            <div className="flex items-center">
              <StartCta size="lg" />
            </div>
          )}
        </div>
      </section>
    </>
  );
}
