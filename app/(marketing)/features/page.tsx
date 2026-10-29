import { getTranslations } from "next-intl/server";
import { features } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";
import { StartCta } from "@/components/cta";
import { FeatureCard } from "@/components/feature-card";
import { PageHeader, SectionHeading } from "@/components/ui";

export async function generateMetadata() {
  const t = await getTranslations("features");
  return pageMetadata({ title: t("title"), description: t("subtitle"), path: "/features" });
}

export default async function FeaturesPage() {
  const t = await getTranslations("features");
  const groups = [
    { title: t("tableStakes"), items: features.filter((f) => f.group === "core") },
    { title: t("differentiators"), items: features.filter((f) => f.group === "differentiator") },
  ];
  return (
    <>
      <PageHeader title={t("title")} subtitle={t("subtitle")} />
      <div className="container-page space-y-16 py-14 sm:py-20">
        {groups.map((group) => (
          <section key={group.title}>
            <SectionHeading center={false} title={group.title} />
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {group.items.map((f) => (
                <FeatureCard key={f.slug} feature={f} />
              ))}
            </div>
          </section>
        ))}
        <div className="flex justify-center">
          <StartCta size="lg" />
        </div>
      </div>
    </>
  );
}
