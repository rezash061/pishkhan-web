import { getTranslations } from "next-intl/server";
import { DeletionStatus } from "@/components/deletion-status";
import { LegalPage, legalMetadata } from "@/components/legal-page";

export const metadata = legalMetadata("data-deletion");

// Meta app review: this is the "data deletion instructions URL". The backend's Meta data-deletion callback
// returns `https://<site>/data-deletion?code=<confirmation code>` as the status URL, which the lookup below reads.
export default async function DataDeletionPage() {
  const t = await getTranslations("dataDeletion");
  return (
    <LegalPage slug="data-deletion">
      <section id="status" aria-labelledby="status-title" className="mt-12 scroll-mt-24 rounded-[var(--radius-card)] border border-border bg-surface p-6 sm:p-8">
        <h2 id="status-title" className="text-xl font-black">
          {t("statusTitle")}
        </h2>
        <p className="mt-2 leading-8 text-muted">{t("statusSubtitle")}</p>
        <DeletionStatus />
      </section>
    </LegalPage>
  );
}
