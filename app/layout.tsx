import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations } from "next-intl/server";
import { env } from "@/lib/env";
import { AttributionCapture } from "@/components/signup-link";
import { company } from "@/content/site";
import "./globals.css";

// Self-hosted variable Vazirmatn (no Google Fonts or foreign CDN, overview section 10).
const vazirmatn = localFont({
  src: "./fonts/Vazirmatn-wght.woff2",
  weight: "100 900",
  display: "swap",
  variable: "--font-vazirmatn",
  preload: true,
});

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("brand");
  const title = `${t("name")} | ${t("tagline")}`;
  return {
    metadataBase: new URL(env.siteUrl),
    title: { default: title, template: `%s | ${company.brand}` },
    description: "دستیار فروش هوشمند اینستاگرام برای فروشندگان فارسی‌زبان: پاسخ خودکار دایرکت با فارسی محاوره، بررسی رسید کارت‌به‌کارت و ادامه فروش در قطعی.",
    applicationName: company.brand,
    openGraph: { locale: "fa_IR", siteName: company.brand, type: "website" },
    formatDetection: { telephone: false },
  };
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fcfbff" },
    { media: "(prefers-color-scheme: dark)", color: "#0e0c1a" },
  ],
  width: "device-width",
  initialScale: 1,
};

// Only the namespaces client components use are sent to the browser.
const CLIENT_NAMESPACES = ["common", "forms", "waitlist", "contact", "demo", "pricing", "help", "dataDeletion", "errors"] as const;

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const messages = await getMessages();
  const clientMessages = Object.fromEntries(CLIENT_NAMESPACES.map((ns) => [ns, messages[ns]]));
  return (
    <html lang="fa" dir="rtl" className={vazirmatn.variable}>
      <body className="min-h-dvh font-sans antialiased">
        <NextIntlClientProvider messages={clientMessages}>{children}</NextIntlClientProvider>
        <AttributionCapture />
        {env.umamiWebsiteId ? <script defer src="/stats/script.js" data-website-id={env.umamiWebsiteId} data-host-url="/stats" data-do-not-track="true" /> : null}
      </body>
    </html>
  );
}
