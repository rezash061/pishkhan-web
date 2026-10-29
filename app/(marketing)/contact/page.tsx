import { getTranslations } from "next-intl/server";
import { pageMetadata } from "@/lib/seo";
import { toPersianDigits } from "@/lib/persian";
import { company } from "@/content/site";
import { Icon } from "@/components/icons";
import { LeadForm } from "@/components/lead-form";
import { Card, PageHeader } from "@/components/ui";

export async function generateMetadata() {
  const t = await getTranslations("contact");
  return pageMetadata({ title: t("title"), description: t("subtitle"), path: "/contact" });
}

export default async function ContactPage() {
  const t = await getTranslations();
  const channels = [
    company.telegram ? { icon: "telegram" as const, label: t("footer.telegram"), href: `https://t.me/${company.telegram}`, value: `@${company.telegram}` } : null,
    company.bale ? { icon: "message" as const, label: t("footer.bale"), href: `https://ble.ir/${company.bale}`, value: `@${company.bale}` } : null,
    company.phone ? { icon: "phone" as const, label: t("footer.phone"), href: `tel:${company.phone}`, value: toPersianDigits(company.phone) } : null,
    { icon: "message" as const, label: "ایمیل", href: `mailto:${company.email}`, value: company.email },
  ].filter((c) => c !== null);

  return (
    <>
      <PageHeader title={t("contact.title")} subtitle={t("contact.subtitle")} />
      <div className="container-page grid gap-8 py-14 sm:py-20 lg:grid-cols-[1.4fr_1fr]">
        <Card className="sm:p-8">
          <h2 className="mb-6 text-xl font-black">{t("contact.formTitle")}</h2>
          <LeadForm type="contact" />
        </Card>
        <div className="space-y-6">
          <Card>
            <h2 className="text-lg font-black">{t("contact.channelsTitle")}</h2>
            <ul className="mt-4 space-y-3">
              {channels.map((c) => (
                <li key={c.href}>
                  <a href={c.href} rel="noopener noreferrer" className="flex items-center gap-3 rounded-xl p-2 hover:bg-surface-2">
                    <Icon name={c.icon} className="size-5 text-brand-600" />
                    <span className="font-bold">{c.label}</span>
                    <span className="ms-auto text-sm text-muted" dir="ltr">
                      {c.value}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
            <p className="mt-4 text-sm text-muted">{t("contact.hours")}</p>
          </Card>
          <Card>
            <h2 className="text-lg font-black">{t("contact.address")}</h2>
            <p className="mt-2 leading-8 text-muted">{company.address || t("contact.addressPending")}</p>
          </Card>
        </div>
      </div>
    </>
  );
}
