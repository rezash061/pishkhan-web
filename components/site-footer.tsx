import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { company } from "@/content/site";
import { features } from "@/content/features";
import { toPersianDigits } from "@/lib/persian";
import { Icon } from "./icons";
import { Logo } from "./logo";

export async function SiteFooter() {
  const t = await getTranslations();
  const year = toPersianDigits(new Intl.DateTimeFormat("fa-IR-u-ca-persian-nu-latn", { year: "numeric" }).format(new Date()).replace(/\D/g, ""));

  const columns = [
    {
      title: t("footer.product"),
      links: [
        ...features.filter((f) => f.status === "live").slice(0, 4).map((f) => ({ href: `/features/${f.slug}`, label: f.short })),
        { href: "/pricing", label: t("nav.pricing") },
        { href: "/compare", label: t("footer.compare") },
      ],
    },
    {
      title: t("footer.resources"),
      links: [
        { href: "/blog", label: t("nav.blog") },
        { href: "/help", label: t("nav.help") },
        { href: "/help/getting-started/connect-instagram", label: "اتصال اینستاگرام" },
      ],
    },
    {
      title: t("footer.company"),
      links: [
        { href: "/about", label: t("nav.about") },
        { href: "/contact", label: t("nav.contact") },
      ],
    },
    {
      title: t("footer.legal"),
      links: [
        { href: "/terms", label: t("footer.terms") },
        { href: "/privacy", label: t("footer.privacy") },
        { href: "/data-deletion", label: t("footer.dataDeletion") },
        { href: "/refund-policy", label: t("footer.refund") },
        { href: "/acceptable-use", label: t("footer.acceptableUse") },
      ],
    },
  ];

  return (
    <footer className="border-t border-border bg-surface">
      <div className="container-page grid gap-10 py-14 lg:grid-cols-[1.3fr_2fr]">
        <div className="max-w-sm">
          <Logo />
          <p className="mt-4 leading-8 text-muted">{t("brand.tagline")}</p>
          <p className="mt-4 flex items-start gap-2 text-sm leading-7 text-muted">
            <Icon name="lock" className="mt-1 size-4 shrink-0 text-brand-600" />
            {t("footer.officialApi")}
          </p>

          <div className="mt-6">
            <p className="text-sm font-bold">{t("footer.support")}</p>
            <ul className="mt-3 flex flex-wrap gap-2 text-sm">
              {company.telegram ? (
                <li>
                  <a href={`https://t.me/${company.telegram}`} rel="noopener noreferrer" className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 hover:bg-surface-2">
                    <Icon name="telegram" className="size-4" /> {t("footer.telegram")}
                  </a>
                </li>
              ) : null}
              {company.bale ? (
                <li>
                  <a href={`https://ble.ir/${company.bale}`} rel="noopener noreferrer" className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 hover:bg-surface-2">
                    <Icon name="message" className="size-4" /> {t("footer.bale")}
                  </a>
                </li>
              ) : null}
              {company.phone ? (
                <li>
                  <a href={`tel:${company.phone}`} className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 hover:bg-surface-2">
                    <Icon name="phone" className="size-4" /> <span dir="ltr">{toPersianDigits(company.phone)}</span>
                  </a>
                </li>
              ) : null}
              <li>
                <a href={`mailto:${company.email}`} className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 hover:bg-surface-2" dir="ltr">
                  {company.email}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
          {columns.map((column) => (
            <nav key={column.title} aria-label={column.title}>
              <p className="text-sm font-bold">{column.title}</p>
              <ul className="mt-4 space-y-3 text-sm">
                {column.links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-muted hover:text-fg">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>
      </div>

      <div className="border-t border-border">
        <div className="container-page flex flex-col gap-4 py-6 text-sm text-muted sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {t("footer.rights", { brand: company.brand })}
          </p>
          <div className="flex items-center gap-3">
            {company.enamad.id ? (
              <a
                href={`https://trustseal.enamad.ir/?id=${company.enamad.id}&Code=${company.enamad.code}`}
                rel="noopener noreferrer"
                className="rounded-lg border border-border px-3 py-1.5"
              >
                {t("footer.enamad")}
              </a>
            ) : (
              <span className="text-xs">{t("footer.enamadPending")}</span>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
}
