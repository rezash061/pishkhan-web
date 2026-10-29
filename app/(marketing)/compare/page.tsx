import { getTranslations } from "next-intl/server";
import { pageMetadata } from "@/lib/seo";
import { company, compareRows } from "@/content/site";
import { StartCta } from "@/components/cta";
import { Icon } from "@/components/icons";
import { PageHeader } from "@/components/ui";

export async function generateMetadata() {
  const t = await getTranslations("compare");
  return pageMetadata({ title: t("title"), description: t("subtitle"), path: "/compare" });
}

// Phase 1: an honest, generic comparison with no competitor names (legal review pending).
export default async function ComparePage() {
  const t = await getTranslations("compare");
  return (
    <>
      <PageHeader title={t("title")} subtitle={t("subtitle")} />
      <div className="container-page py-14 sm:py-20">
        <div tabIndex={0} role="region" aria-label={t("title")} className="relative overflow-x-auto rounded-[var(--radius-card)] border border-border bg-surface">
          <table className="w-full min-w-[36rem]">
            <thead>
              <tr className="border-b border-border bg-surface-2 text-sm">
                <th scope="col" className="p-4 text-start" />
                <th scope="col" className="p-4 text-start font-bold text-muted">
                  {t("typical")}
                </th>
                <th scope="col" className="p-4 text-start font-black text-brand-700 dark:text-brand-300">
                  {t("ours", { brand: company.brand })}
                </th>
              </tr>
            </thead>
            <tbody>
              {compareRows.map((row) => (
                <tr key={row.topic} className="border-b border-border last:border-0">
                  <th scope="row" className="p-4 text-start font-bold">
                    {row.topic}
                  </th>
                  <td className="p-4 text-muted">{row.typical}</td>
                  <td className="p-4">
                    <span className="flex items-start gap-2">
                      <Icon name="check" className="mt-1 size-5 shrink-0 text-success" />
                      {row.ours}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-4 text-sm leading-7 text-muted">{t("note")}</p>
        <div className="mt-10 flex justify-center">
          <StartCta size="lg" />
        </div>
      </div>
    </>
  );
}
