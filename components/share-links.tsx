"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

/** Share links for networks Iranian readers use. Plain links, no third-party scripts. */
export function ShareLinks({ url, title }: { url: string; title: string }) {
  const t = useTranslations("common");
  const [copied, setCopied] = useState(false);
  const u = encodeURIComponent(url);
  const text = encodeURIComponent(title);
  const links = [
    { label: "تلگرام", href: `https://t.me/share/url?url=${u}&text=${text}` },
    { label: "واتس‌اپ", href: `https://wa.me/?text=${text}%20${u}` },
    { label: "بله", href: `https://ble.ir/share/url?url=${u}&text=${text}` },
    { label: "X", href: `https://x.com/intent/post?url=${u}&text=${text}` },
  ];
  const pill = "rounded-full border border-border bg-surface px-3 py-1.5 text-sm hover:bg-surface-2";
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-sm font-bold">{t("share")}:</span>
      {links.map((l) => (
        <a key={l.label} href={l.href} target="_blank" rel="noopener noreferrer" className={pill}>
          {l.label}
        </a>
      ))}
      <button
        type="button"
        className={pill}
        onClick={() => {
          void navigator.clipboard?.writeText(url).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
          });
        }}
      >
        <span aria-live="polite">{copied ? t("copied") : t("copyLink")}</span>
      </button>
    </div>
  );
}
