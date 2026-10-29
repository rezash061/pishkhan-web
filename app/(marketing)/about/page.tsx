import { getTranslations } from "next-intl/server";
import { organizationLd, pageMetadata } from "@/lib/seo";
import { BlockRenderer, JsonLd } from "@/components/content";
import { StartCta } from "@/components/cta";
import { PageHeader } from "@/components/ui";
import { about } from "@/content/about";

export async function generateMetadata() {
  const t = await getTranslations("about");
  return pageMetadata({ title: t("title"), description: about.description, path: "/about" });
}

export default async function AboutPage() {
  const t = await getTranslations("about");
  return (
    <>
      <JsonLd data={organizationLd()} />
      <PageHeader title={t("title")} subtitle={about.description} />
      <div className="container-page max-w-3xl py-14 sm:py-20">
        <BlockRenderer blocks={about.body} />
        <div className="mt-10">
          <StartCta size="lg" />
        </div>
      </div>
    </>
  );
}
