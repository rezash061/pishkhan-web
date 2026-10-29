import { getTranslations } from "next-intl/server";
import { helpSearchIndex } from "@/lib/help-index";
import { pageMetadata } from "@/lib/seo";
import { Breadcrumbs } from "@/components/content";
import { HelpSearchResults } from "@/components/help-search";

export async function generateMetadata() {
  const t = await getTranslations("help");
  return pageMetadata({ title: t("searchLabel"), description: t("subtitle"), path: "/help/search", noIndex: true });
}

// Static page; the query is read in the browser and matched against an index built at build time.
export default async function HelpSearchPage() {
  const t = await getTranslations("help");
  return (
    <div className="container-page max-w-3xl py-12 sm:py-16">
      <Breadcrumbs items={[{ name: t("title"), href: "/help" }, { name: t("searchLabel") }]} />
      <h1 className="mb-6 text-3xl font-black">{t("searchLabel")}</h1>
      <HelpSearchResults index={helpSearchIndex()} />
    </div>
  );
}
