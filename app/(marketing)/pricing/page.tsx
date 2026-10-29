import { getTranslations } from "next-intl/server";
import { getPlans } from "@/lib/content";
import { env } from "@/lib/env";
import { faqLd, pageMetadata, softwareApplicationLd } from "@/lib/seo";
import { pricingFaq } from "@/content/site";
import { StartCta } from "@/components/cta";
import { FaqList, JsonLd } from "@/components/content";
import { Icon } from "@/components/icons";
import { PricingPlans } from "@/components/pricing-plans";
import { PageHeader } from "@/components/ui";

// Refreshed hourly and immediately when the backend revalidates the `plans` tag after a plan is published.
export const revalidate = 3600;

export async function generateMetadata() {
  const t = await getTranslations("pricing");
  return pageMetadata({ title: t("title"), description: "قیمت پلن‌های پیشخوان به تومان: پلن رایگان، اتوماسیون نامحدود و پرداخت بر اساس گفت‌وگوی هوشمند، بدون وابستگی به تعداد فالوئر.", path: "/pricing" });
}

export default async function PricingPage() {
  const t = await getTranslations("pricing");
  const { source, plans } = await getPlans();
  const featureRows = plans[0]?.features.map((f) => ({ key: f.key, label: f.label })) ?? [];

  return (
    <>
      <JsonLd data={faqLd(pricingFaq)} />
      {source === "backend" ? <JsonLd data={softwareApplicationLd(plans.flatMap((p) => (p.monthly ? [{ name: p.name, price: p.monthly.amount }] : [])))} /> : null}

      <PageHeader title={t("title")} subtitle={t("subtitle")} />

      <div className="container-page py-14 sm:py-20">
        {source === "unavailable" ? (
          <section className="mx-auto max-w-2xl rounded-[var(--radius-card)] border border-border bg-surface p-8 text-center shadow-[var(--shadow-card)]">
            <h2 className="text-2xl font-black">{t("unavailableTitle")}</h2>
            <p className="mt-3 leading-8 text-muted">{t("unavailable")}</p>
            <div className="mt-6 flex justify-center">
              <StartCta size="lg" />
            </div>
          </section>
        ) : (
          <>
            {source === "fixtures" ? (
              <p role="note" className="mx-auto mb-8 w-fit rounded-full bg-amber-100 px-4 py-1.5 text-sm font-bold text-amber-900 dark:bg-amber-950 dark:text-amber-200">
                {t("sampleNotice")}
              </p>
            ) : null}
            <PricingPlans plans={plans} mode={env.signupMode} panelUrl={env.panelUrl} />
            <p className="mt-6 text-center text-sm text-muted">{t("vatNote")}</p>
          </>
        )}

        {/* What is metered, in plain words (report 8.5: competitors' pricing is contradictory). */}
        <section aria-labelledby="metered" className="mt-16 grid gap-5 md:grid-cols-3">
          <h2 id="metered" className="sr-only">
            {t("meteredTitle")}
          </h2>
          <div className="rounded-[var(--radius-card)] bg-surface-2 p-6">
            <Icon name="sparkles" className="size-6 text-brand-600" />
            <p className="mt-3 leading-8">{t("meteredAi")}</p>
          </div>
          <div className="rounded-[var(--radius-card)] bg-surface-2 p-6">
            <Icon name="bolt" className="size-6 text-brand-600" />
            <p className="mt-3 leading-8">{t("unlimitedRules")}</p>
            <p className="mt-2 text-sm font-bold text-muted">{t("noFollowerTiers")}</p>
          </div>
          <div className="rounded-[var(--radius-card)] border-2 border-brand-200 bg-brand-50 p-6 dark:border-brand-800 dark:bg-brand-950/50">
            <Icon name="shield" className="size-6 text-brand-600" />
            <h3 className="mt-3 font-black">{t("softOverageTitle")}</h3>
            <p className="mt-2 leading-8">{t("softOverage")}</p>
          </div>
        </section>

        {featureRows.length > 0 ? (
          <section aria-labelledby="compare" className="mt-16">
            <h2 id="compare" className="mb-6 text-center text-2xl font-black sm:text-3xl">
              {t("compareTitle")}
            </h2>
            <div tabIndex={0} role="region" aria-labelledby="compare" className="relative overflow-x-auto rounded-[var(--radius-card)] border border-border bg-surface">
              <table className="w-full min-w-[40rem] text-sm">
                <thead>
                  <tr className="border-b border-border bg-surface-2">
                    <th scope="col" className="p-4 text-start font-bold">
                      {t("feature")}
                    </th>
                    {plans.map((p) => (
                      <th key={p.code} scope="col" className="p-4 text-center font-black">
                        {p.name}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {featureRows.map((row) => (
                    <tr key={row.key} className="border-b border-border last:border-0">
                      <th scope="row" className="p-4 text-start font-medium">
                        {row.label}
                      </th>
                      {plans.map((p) => {
                        const f = p.features.find((x) => x.key === row.key);
                        return (
                          <td key={p.code} className="p-4 text-center">
                            {f?.included ? (
                              <span className="inline-flex items-center gap-1 text-success">
                                <Icon name="check" className="size-5" />
                                <span className="sr-only">{t("included")}</span>
                                {f.limit ? <span className="text-xs text-muted">{f.limit}</span> : null}
                              </span>
                            ) : (
                              <span className="text-muted">
                                <Icon name="minus" className="mx-auto size-5" />
                                <span className="sr-only">{t("notIncluded")}</span>
                              </span>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        ) : null}

        <div className="mt-16">
          <FaqList items={pricingFaq} />
        </div>
      </div>
    </>
  );
}
