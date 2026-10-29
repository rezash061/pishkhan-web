"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";

export default function ErrorPage({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  const t = useTranslations("errors");
  return (
    <main className="container-page flex min-h-[70vh] flex-col items-center justify-center py-20 text-center">
      <p className="text-gradient text-7xl font-black">۵۰۰</p>
      <h1 className="mt-4 text-2xl font-black">{t("serverTitle")}</h1>
      <p className="mt-3 text-muted">{t("server")}</p>
      <div className="mt-8 flex gap-3">
        <button type="button" onClick={reset} className="h-11 rounded-full bg-brand-600 px-6 font-bold text-white">
          {t("retry")}
        </button>
        <Link href="/" className="flex h-11 items-center rounded-full border border-border px-6 font-bold">
          {t("home")}
        </Link>
      </div>
    </main>
  );
}
