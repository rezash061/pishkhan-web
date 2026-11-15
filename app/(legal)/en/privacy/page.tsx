import { LegalPageEn, legalMetadataEn } from "@/components/legal-page-en";

export const metadata = legalMetadataEn("privacy");

// Meta app review: the English "Privacy Policy URL".
export default function PrivacyEnPage() {
  return <LegalPageEn slug="privacy" />;
}
