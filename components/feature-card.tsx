import Link from "next/link";
import { getTranslations } from "next-intl/server";
import type { Feature } from "@/content/types";
import { Badge, IconBubble } from "./ui";
import { Icon } from "./icons";

export async function FeatureCard({ feature }: { feature: Feature }) {
  const t = await getTranslations("common");
  return (
    <Link
      href={`/features/${feature.slug}`}
      className="group flex flex-col rounded-[var(--radius-card)] border border-border bg-surface p-6 shadow-[var(--shadow-card)] transition-all hover:-translate-y-0.5 hover:border-brand-200 dark:hover:border-brand-800"
    >
      <div className="flex items-start justify-between gap-3">
        <IconBubble name={feature.icon} />
        {feature.status === "soon" ? <Badge tone="soon">{t("soon")}</Badge> : null}
      </div>
      <h3 className="mt-4 text-lg font-black">{feature.short}</h3>
      <p className="mt-2 flex-1 leading-8 text-muted">{feature.summary}</p>
      <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-bold text-brand-600">
        {t("learnMore")}
        <Icon name="arrow" className="size-4 transition-transform group-hover:-translate-x-1" />
      </span>
    </Link>
  );
}
