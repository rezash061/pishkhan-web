import { getTranslations } from "next-intl/server";
import { SiteFooter } from "./site-footer";
import { SiteHeader } from "./site-header";

export async function SiteChrome({ children }: { children: React.ReactNode }) {
  const t = await getTranslations("nav");
  return (
    <>
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:start-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-brand-600 focus:px-4 focus:py-2 focus:text-white">
        {t("skipToContent")}
      </a>
      <SiteHeader />
      <main id="main">{children}</main>
      <SiteFooter />
    </>
  );
}
