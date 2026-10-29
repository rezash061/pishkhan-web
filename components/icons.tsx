import type { SVGProps } from "react";
import type { IconName } from "@/content/types";

// Inline stroke icons (no icon font or package: keeps the landing page light). 24×24, currentColor.
const paths: Record<IconName | "arrow" | "menu" | "close" | "chevron" | "telegram" | "send" | "x" | "minus" | "search", string> = {
  sparkles: "M12 3l1.8 4.6L18.5 9.5 13.8 11.3 12 16l-1.8-4.7L5.5 9.5l4.7-1.9zM19 15l.9 2.1L22 18l-2.1.9L19 21l-.9-2.1L16 18l2.1-.9zM5 15l.6 1.4L7 17l-1.4.6L5 19l-.6-1.4L3 17l1.4-.6z",
  message: "M4 5h16v11H8l-4 4zM8 9.5h8M8 12.5h5",
  comment: "M20 12a8 8 0 0 1-11.8 7L4 20l1-4.2A8 8 0 1 1 20 12zM9 12h.01M12 12h.01M15 12h.01",
  inbox: "M3 13l2.5-8h13L21 13v6H3zM3 13h5l1.5 2.5h5L16 13h5",
  store: "M4 10v10h16V10M3 6l1.5-3h15L21 6v1.5a2.5 2.5 0 0 1-4.5 1.5 2.5 2.5 0 0 1-4.5 0 2.5 2.5 0 0 1-4.5 0A2.5 2.5 0 0 1 3 7.5zM9.5 20v-5h5v5",
  form: "M6 3h9l4 4v14H6zM14 3v5h5M9 12h7M9 16h5",
  chart: "M4 20V10M10 20V4M16 20v-7M22 20H2",
  receipt: "M6 3h12v18l-2-1.5L14 21l-2-1.5L10 21l-2-1.5L6 21zM9 8h6M9 12h6M9 16h3",
  link: "M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1",
  mic: "M12 3a3 3 0 0 1 3 3v6a3 3 0 0 1-6 0V6a3 3 0 0 1 3-3zM5 11a7 7 0 0 0 14 0M12 18v3M8 21h8",
  shield: "M12 3l8 3v6c0 4.5-3.4 8.2-8 9-4.6-.8-8-4.5-8-9V6zM8.5 12l2.5 2.5 4.5-5",
  signal: "M2 8.5a15 15 0 0 1 20 0M5 12a10 10 0 0 1 14 0M8.5 15.5a5 5 0 0 1 7 0M12 19h.01",
  shirt: "M8 3l-5 3 2 4 2-1v12h10V9l2 1 2-4-5-3a4 4 0 0 1-8 0z",
  lipstick: "M9 21h6V12H9zM10 12V7l4-3v8M9 16h6",
  gem: "M6 3h12l3 6-9 12L3 9zM3 9h18M9 3l3 18M15 3l-3 18",
  stethoscope: "M6 3v6a4 4 0 0 0 8 0V3M10 13v2a5 5 0 0 0 10 0v-2M20 13a2 2 0 1 0 0-4 2 2 0 0 0 0 4z",
  book: "M4 4.5A1.5 1.5 0 0 1 5.5 3H20v15H5.5A1.5 1.5 0 0 0 4 19.5zM4 19.5A1.5 1.5 0 0 0 5.5 21H20M8 7h8",
  lock: "M6 11h12v10H6zM8.5 11V7.5a3.5 3.5 0 0 1 7 0V11M12 15v2",
  check: "M4 12.5l5 5L20 6.5",
  phone: "M5 3h4l2 5-2.5 1.5a11 11 0 0 0 6 6L16 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 5a2 2 0 0 1 2-2z",
  users: "M16 20v-1.5a3.5 3.5 0 0 0-3.5-3.5h-5A3.5 3.5 0 0 0 4 18.5V20M10 11a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7zM20 20v-1.5a3.5 3.5 0 0 0-2.5-3.4M15.5 4.2a3.5 3.5 0 0 1 0 6.6",
  bolt: "M13 2L4 14h7l-1 8 9-12h-7z",
  arrow: "M19 12H5M11 6l-6 6 6 6",
  menu: "M4 7h16M4 12h16M4 17h16",
  close: "M6 6l12 12M18 6L6 18",
  chevron: "M15 6l-6 6 6 6",
  telegram: "M21 4L3 11l6 2 2 6 3-4 5 4zM9 13l9-6",
  send: "M20 4L3 11l7 2.5L12.5 21zM10 13.5L20 4",
  x: "M6 6l12 12M18 6L6 18",
  minus: "M6 12h12",
  search: "M11 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14zM20 20l-4-4",
};

export type AnyIconName = keyof typeof paths;

export function Icon({ name, className = "size-5", ...props }: { name: AnyIconName } & SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className={className} {...props}>
      <path d={paths[name]} />
    </svg>
  );
}
