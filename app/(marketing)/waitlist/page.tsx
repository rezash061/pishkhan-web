import { getTranslations } from "next-intl/server";
import { pageMetadata } from "@/lib/seo";
import { Icon } from "@/components/icons";
import { LeadForm } from "@/components/lead-form";
import { Card, PageHeader } from "@/components/ui";
import { trustPoints } from "@/content/site";

export async function generateMetadata() {
  const t = await getTranslations("waitlist");
  return pageMetadata({ title: t("title"), description: t("subtitle"), path: "/waitlist" });
}

export default async function WaitlistPage() {
  const t = await getTranslations("waitlist");
  return (
    <>
      <PageHeader title={t("title")} subtitle={t("subtitle")} />
      <div className="container-page grid gap-8 py-14 sm:py-20 lg:grid-cols-[1.4fr_1fr]">
        <Card className="sm:p-8">
          <LeadForm type="waitlist" />
        </Card>
        <ul className="space-y-4">
          {trustPoints.slice(0, 3).map((p) => (
            <li key={p.title} className="flex items-start gap-3">
              <Icon name={p.icon} className="mt-1 size-5 shrink-0 text-brand-600" />
              <div>
                <p className="font-bold">{p.title}</p>
                <p className="mt-1 text-sm leading-7 text-muted">{p.text}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
