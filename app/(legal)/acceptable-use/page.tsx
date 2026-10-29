import { LegalPage, legalMetadata } from "@/components/legal-page";

export const metadata = legalMetadata("acceptable-use");

export default function AcceptableUsePage() {
  return <LegalPage slug="acceptable-use" />;
}
