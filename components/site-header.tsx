import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { StartCta, panelLoginUrl } from "./cta";
import { Icon } from "./icons";
import { Logo } from "./logo";

const links = [
  { href: "/features", key: "features" },
  { href: "/solutions/clothing", key: "solutions" },
  { href: "/pricing", key: "pricing" },
  { href: "/blog", key: "blog" },
  { href: "/help", key: "help" },
] as const;

export async function SiteHeader() {
  const t = await getTranslations("nav");
  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-bg/85 backdrop-blur-md supports-[backdrop-filter]:bg-bg/70">
      <div className="container-page flex h-16 items-center gap-6">
        <Link href="/" className="shrink-0" aria-label={t("home")}>
          <Logo />
        </Link>

        <nav aria-label={t("mainNav")} className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {links.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="rounded-full px-3 py-2 text-sm font-medium text-muted transition-colors hover:bg-surface-2 hover:text-fg">
                  {t(link.key)}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="ms-auto flex items-center gap-2">
          <a href={panelLoginUrl()} className="hidden rounded-full px-4 py-2 text-sm font-bold text-fg hover:bg-surface-2 sm:inline-flex">
            {t("login")}
          </a>
          <StartCta />

          {/* Mobile menu: a native disclosure, so it works before (and without) JavaScript. */}
          <details className="group relative lg:hidden">
            <summary aria-label={t("menu")} className="flex size-11 items-center justify-center rounded-full border border-border bg-surface">
              <Icon name="menu" className="size-5 group-open:hidden" />
              <Icon name="close" className="hidden size-5 group-open:block" />
            </summary>
            <div className="absolute end-0 top-13 w-[min(20rem,calc(100vw-2rem))] rounded-2xl border border-border bg-surface p-3 shadow-[var(--shadow-float)]">
              <ul className="flex flex-col">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="block rounded-xl px-4 py-3 font-medium hover:bg-surface-2">
                      {t(link.key)}
                    </Link>
                  </li>
                ))}
                <li>
                  <Link href="/contact" className="block rounded-xl px-4 py-3 font-medium hover:bg-surface-2">
                    {t("contact")}
                  </Link>
                </li>
              </ul>
              <div className="mt-2 grid gap-2 border-t border-border pt-3">
                <StartCta className="w-full" />
                <a href={panelLoginUrl()} className="flex h-11 items-center justify-center rounded-full border border-border text-sm font-bold">
                  {t("login")}
                </a>
              </div>
            </div>
          </details>
        </div>
      </div>
    </header>
  );
}
