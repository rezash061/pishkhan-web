import { SiteChrome } from "@/components/site-chrome";

export default function Layout({ children }: { children: React.ReactNode }) {
  return <SiteChrome>{children}</SiteChrome>;
}
