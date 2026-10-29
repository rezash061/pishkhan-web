import { LegalPage, legalMetadata } from "@/components/legal-page";

export const metadata = legalMetadata("refund-policy");

export default function RefundPolicyPage() {
  return <LegalPage slug="refund-policy" />;
}
