import Link from "next/link";
import { Fragment } from "react";
import { getTranslations } from "next-intl/server";
import type { Block, Faq } from "@/content/types";
import { parseInline } from "@/lib/blocks";
import { Icon } from "./icons";

// Renders structured content blocks through an allowlist (no HTML from content is ever injected).

export function Inline({ text }: { text: string }) {
  return (
    <>
      {parseInline(text).map((token, i) => {
        if (token.kind === "strong") {
          return <strong key={i}>{token.text}</strong>;
        }
        if (token.kind === "link") {
          return token.href.startsWith("/") ? (
            <Link key={i} href={token.href}>
              {token.text}
            </Link>
          ) : (
            <a key={i} href={token.href} rel="noopener noreferrer">
              {token.text}
            </a>
          );
        }
        return <Fragment key={i}>{token.text}</Fragment>;
      })}
    </>
  );
}

export function BlockRenderer({ blocks }: { blocks: Block[] }) {
  return (
    <div className="prose-fa">
      {blocks.map((block, i) => {
        switch (block.type) {
          case "p":
            return (
              <p key={i}>
                <Inline text={block.text} />
              </p>
            );
          case "h2":
            return (
              <h2 key={i} id={block.id}>
                {block.text}
              </h2>
            );
          case "h3":
            return <h3 key={i}>{block.text}</h3>;
          case "ul":
          case "ol": {
            const List = block.type;
            return (
              <List key={i}>
                {block.items.map((item, j) => (
                  <li key={j}>
                    <Inline text={item} />
                  </li>
                ))}
              </List>
            );
          }
          case "callout":
            return (
              <div
                key={i}
                role="note"
                className={`my-6 rounded-2xl border p-4 text-base leading-8 ${
                  block.tone === "warning" ? "border-amber-300 bg-amber-50 text-amber-950 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-100" : "border-brand-200 bg-brand-50 text-brand-950 dark:border-brand-800 dark:bg-brand-950/40 dark:text-brand-100"
                }`}
              >
                <Inline text={block.text} />
              </div>
            );
          case "quote":
            return (
              <blockquote key={i} className="my-6 border-s-4 border-brand-400 ps-4 text-muted">
                <Inline text={block.text} />
              </blockquote>
            );
        }
      })}
    </div>
  );
}

/** FAQ as native disclosure widgets: accessible and zero JavaScript. */
export async function FaqList({ items, title }: { items: Faq[]; title?: string }) {
  const t = await getTranslations("common");
  if (items.length === 0) {
    return null;
  }
  return (
    <section aria-labelledby="faq-title" className="mx-auto max-w-3xl">
      <h2 id="faq-title" className="mb-6 text-center text-2xl font-black sm:text-3xl">
        {title ?? t("faq")}
      </h2>
      <div className="divide-y divide-border rounded-[var(--radius-card)] border border-border bg-surface">
        {items.map((item) => (
          <details key={item.q} className="group px-5 py-4">
            <summary className="flex items-center justify-between gap-4 text-base font-bold leading-8">
              {item.q}
              <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-surface-2 text-muted transition-transform group-open:rotate-45">
                <Icon name="close" className="size-3.5 rotate-45" />
              </span>
            </summary>
            <p className="mt-2 leading-8 text-muted">{item.a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}

export function JsonLd({ data }: { data: unknown }) {
  // JSON-LD is built from our own content; `<` is escaped so a value can never close the script element.
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }} />;
}

export async function Breadcrumbs({ items }: { items: { name: string; href?: string }[] }) {
  const t = await getTranslations("common");
  return (
    <nav aria-label={t("breadcrumb")} className="mb-4 text-sm text-muted">
      <ol className="flex flex-wrap items-center gap-1.5">
        {items.map((item, i) => (
          <li key={i} className="flex items-center gap-1.5">
            {i > 0 ? <Icon name="chevron" className="size-3.5 opacity-60" /> : null}
            {item.href ? (
              <Link href={item.href} className="hover:text-fg">
                {item.name}
              </Link>
            ) : (
              <span aria-current="page" className="text-fg">
                {item.name}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
