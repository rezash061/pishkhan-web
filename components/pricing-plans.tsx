"use client";

import Link from "next/link";
import { useState } from "react";
import { useTranslations } from "next-intl";
import type { PublicPlan } from "@/lib/api";
import { formatNumber, formatToman } from "@/lib/persian";
import { Icon } from "./icons";
import { SignupLink } from "./signup-link";

type Period = "monthly" | "annual";

/** Plan cards with the monthly/annual toggle. Every number shown comes from the plan data. */
export function PricingPlans({ plans, mode, panelUrl }: { plans: PublicPlan[]; mode: "waitlist" | "signup"; panelUrl: string }) {
  const t = useTranslations("pricing");
  const [period, setPeriod] = useState<Period>("monthly");
  const hasAnnual = plans.some((p) => p.annual && p.annual.amount > 0);

  return (
    <div>
      {hasAnnual ? (
        <div className="mb-10 flex justify-center">
          <div role="radiogroup" aria-label={t("billingPeriod")} className="inline-flex rounded-full border border-border bg-surface p-1">
            {(["monthly", "annual"] as const).map((p) => (
              <button
                key={p}
                type="button"
                role="radio"
                aria-checked={period === p}
                onClick={() => setPeriod(p)}
                className={`rounded-full px-5 py-2 text-sm font-bold transition-colors ${period === p ? "bg-brand-600 text-white" : "text-muted hover:text-fg"}`}
              >
                {p === "monthly" ? t("monthly") : t("annual")}
              </button>
            ))}
          </div>
        </div>
      ) : null}

      <div className={`grid gap-5 sm:grid-cols-2 ${plans.length >= 4 ? "xl:grid-cols-4" : "lg:grid-cols-3"}`}>
        {plans.map((plan) => {
          const price = period === "annual" && plan.annual ? plan.annual : plan.monthly;
          const isFree = plan.isFree || (price !== null && price.amount === 0);
          const className = `mt-6 flex h-12 items-center justify-center gap-2 rounded-full font-bold transition-colors ${
            plan.highlighted ? "bg-brand-600 text-white hover:bg-brand-700" : "border border-border bg-surface hover:bg-surface-2"
          }`;
          const label = t("choose", { plan: plan.name });
          return (
            <article
              key={plan.code}
              aria-labelledby={`plan-${plan.code}`}
              className={`relative flex flex-col rounded-[var(--radius-card)] border bg-surface p-6 ${plan.highlighted ? "border-brand-500 shadow-[var(--shadow-float)] ring-1 ring-brand-500" : "border-border shadow-[var(--shadow-card)]"}`}
            >
              {plan.highlighted ? (
                <span className="absolute -top-3 start-6 rounded-full bg-brand-600 px-3 py-1 text-xs font-bold text-white">{t("popular")}</span>
              ) : null}
              <h3 id={`plan-${plan.code}`} className="text-xl font-black">
                {plan.name}
              </h3>
              {plan.tagline ? <p className="mt-1 text-sm text-muted">{plan.tagline}</p> : null}
              {plan.description ? <p className="mt-3 text-sm leading-7 text-muted">{plan.description}</p> : null}

              <p className="mt-6 flex items-baseline gap-1.5">
                {price === null ? (
                  <span className="text-2xl font-black">{t("custom")}</span>
                ) : isFree ? (
                  <span className="text-3xl font-black">{t("free")}</span>
                ) : (
                  <>
                    <span className="text-3xl font-black">{formatToman(price, false)}</span>
                    <span className="text-sm text-muted">
                      {t("toman")} {period === "annual" && plan.annual ? t("perYear") : t("perMonth")}
                    </span>
                  </>
                )}
              </p>

              <ul className="mt-6 space-y-3 border-t border-border pt-6 text-sm">
                <li className="flex items-start gap-2.5 font-bold">
                  <Icon name="sparkles" className="mt-0.5 size-4.5 shrink-0 text-brand-600" />
                  {plan.aiConversations === null ? t("unlimitedAi") : t("aiConversations", { count: formatNumber(plan.aiConversations) })}
                </li>
                <li className="flex items-start gap-2.5 text-muted">
                  <Icon name="bolt" className="mt-0.5 size-4.5 shrink-0" />
                  {plan.overagePerConversation ? t("overage", { price: formatToman(plan.overagePerConversation) }) : t("noOverage")}
                </li>
                <li className="flex items-start gap-2.5">
                  <Icon name="link" className="mt-0.5 size-4.5 shrink-0 text-muted" />
                  {plan.channelAccounts === null ? t("unlimited") : t("channels", { count: plan.channelAccounts })}
                </li>
                <li className="flex items-start gap-2.5">
                  <Icon name="users" className="mt-0.5 size-4.5 shrink-0 text-muted" />
                  {plan.seats === null ? t("unlimited") : t("seats", { count: plan.seats })}
                </li>
                {plan.features
                  .filter((f) => f.included)
                  .slice(0, 5)
                  .map((f) => (
                    <li key={f.key} className="flex items-start gap-2.5">
                      <Icon name="check" className="mt-0.5 size-4.5 shrink-0 text-success" />
                      <span>
                        {f.label}
                        {f.limit ? <span className="text-muted"> ({f.limit})</span> : null}
                      </span>
                    </li>
                  ))}
              </ul>

              <div className="mt-auto">
                {mode === "signup" ? (
                  <SignupLink panelUrl={panelUrl} plan={plan.code} className={className}>
                    {label}
                  </SignupLink>
                ) : (
                  <Link href={`/waitlist?plan=${encodeURIComponent(plan.code)}`} className={className} data-umami-event="cta_click" data-umami-event-plan={plan.code}>
                    {label}
                  </Link>
                )}
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
