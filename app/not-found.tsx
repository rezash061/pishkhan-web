import { getTranslations } from "next-intl/server";
import { SiteChrome } from "@/components/site-chrome";
import { ButtonLink } from "@/components/ui";

export default async function NotFound() {
  const t = await getTranslations("errors");
  const nav = await getTranslations("nav");
  return (
    <SiteChrome>
      <div className="container-page flex min-h-[60vh] flex-col items-center justify-center py-20 text-center">
        <p className="text-gradient text-7xl font-black">۴۰۴</p>
        <h1 className="mt-4 text-2xl font-black">{t("notFoundTitle")}</h1>
        <p className="mt-3 text-muted">{t("notFound")}</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <ButtonLink href="/">{t("home")}</ButtonLink>
          <ButtonLink href="/help" variant="secondary">
            {nav("help")}
          </ButtonLink>
        </div>
      </div>
    </SiteChrome>
  );
}
