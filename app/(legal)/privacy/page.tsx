import Link from "next/link";
import { LegalPage, legalMetadata } from "@/components/legal-page";

export const metadata = legalMetadata("privacy");

export default function PrivacyPage() {
  return (
    <LegalPage slug="privacy">
      <p className="mt-10 text-sm text-muted" lang="en" dir="ltr">
        <Link href="/en/privacy" hrefLang="en">
          Read this policy in English
        </Link>
      </p>
    </LegalPage>
  );
}
