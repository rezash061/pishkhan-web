import { SiteChrome } from "@/components/site-chrome";

// Plain reading layout for legal pages (Meta app review links here: /privacy, /terms, /data-deletion).
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SiteChrome>
      <div className="container-page max-w-3xl py-12 sm:py-16">{children}</div>
    </SiteChrome>
  );
}
