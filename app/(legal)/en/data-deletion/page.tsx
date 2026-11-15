import { LegalPageEn, legalMetadataEn } from "@/components/legal-page-en";

export const metadata = legalMetadataEn("data-deletion");

// Meta app review: the English "Data deletion instructions URL". Status lookups stay on /data-deletion?code=...
export default function DataDeletionEnPage() {
  return <LegalPageEn slug="data-deletion" />;
}
