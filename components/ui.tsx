import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { Icon } from "./icons";

// Small RTL-safe primitives (logical properties only: ms/me/ps/pe, start/end).

type Variant = "primary" | "secondary" | "ghost";
type Size = "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 rounded-full font-bold transition-colors focus-visible:outline-2 disabled:opacity-60 disabled:cursor-not-allowed whitespace-nowrap";
const variants: Record<Variant, string> = {
  primary: "bg-brand-600 text-white hover:bg-brand-700 shadow-[0_8px_20px_-8px_rgb(95_44_235/0.6)]",
  secondary: "bg-surface text-fg border border-border hover:bg-surface-2",
  ghost: "text-fg hover:bg-surface-2",
};
const sizes: Record<Size, string> = { md: "h-11 px-5 text-sm", lg: "h-13 px-7 text-base" };

export function buttonClass(variant: Variant = "primary", size: Size = "md", extra = "") {
  return `${base} ${variants[variant]} ${sizes[size]} ${extra}`;
}

export function ButtonLink({ variant, size, className = "", arrow, children, ...props }: ComponentProps<typeof Link> & { variant?: Variant; size?: Size; arrow?: boolean }) {
  return (
    <Link className={buttonClass(variant, size, className)} {...props}>
      {children}
      {arrow ? <Icon name="arrow" className="size-4" /> : null}
    </Link>
  );
}

export function Badge({ tone = "brand", children }: { tone?: "brand" | "soon" | "success"; children: ReactNode }) {
  const tones = {
    brand: "bg-brand-100 text-brand-800 dark:bg-brand-950 dark:text-brand-200",
    soon: "bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-200",
    success: "bg-emerald-100 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-200",
  };
  return <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold ${tones[tone]}`}>{children}</span>;
}

export function SectionHeading({ eyebrow, title, subtitle, center = true, id }: { eyebrow?: string; title: string; subtitle?: string; center?: boolean; id?: string }) {
  return (
    <div className={`mb-10 max-w-2xl ${center ? "mx-auto text-center" : ""}`}>
      {eyebrow ? <p className="mb-2 text-sm font-bold text-brand-600">{eyebrow}</p> : null}
      <h2 id={id} className="text-2xl font-black leading-snug sm:text-3xl">
        {title}
      </h2>
      {subtitle ? <p className="mt-3 text-base leading-8 text-muted">{subtitle}</p> : null}
    </div>
  );
}

export function Card({ className = "", children }: { className?: string; children: ReactNode }) {
  return <div className={`rounded-[var(--radius-card)] border border-border bg-surface p-6 shadow-[var(--shadow-card)] ${className}`}>{children}</div>;
}

export function IconBubble({ name, className = "" }: { name: ComponentProps<typeof Icon>["name"]; className?: string }) {
  return (
    <span className={`inline-flex size-11 shrink-0 items-center justify-center rounded-2xl bg-brand-50 text-brand-600 dark:bg-brand-950 dark:text-brand-300 ${className}`}>
      <Icon name={name} className="size-5.5" />
    </span>
  );
}

export function PageHeader({ title, subtitle, children }: { title: string; subtitle?: string; children?: ReactNode }) {
  return (
    <header className="bg-hero border-b border-border">
      <div className="container-page py-12 sm:py-16">
        {children}
        <h1 className="text-3xl font-black leading-tight sm:text-4xl">{title}</h1>
        {subtitle ? <p className="mt-4 max-w-2xl text-lg leading-9 text-muted">{subtitle}</p> : null}
      </div>
    </header>
  );
}
