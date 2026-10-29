import type { Block } from "@/content/types";

export type InlineToken = { kind: "text"; text: string } | { kind: "strong"; text: string } | { kind: "link"; text: string; href: string };

/**
 * Parses the only inline markup content may use: `**bold**` and `[label](href)`. Links are allowlisted to
 * site-relative paths, `mailto:` and `https:`; anything else stays plain text. No HTML is ever interpreted.
 */
export function parseInline(text: string): InlineToken[] {
  const tokens: InlineToken[] = [];
  const pattern = /\*\*([^*]+)\*\*|\[([^\]]+)\]\(([^)\s]+)\)/g;
  let last = 0;
  for (const match of text.matchAll(pattern)) {
    const index = match.index ?? 0;
    if (index > last) {
      tokens.push({ kind: "text", text: text.slice(last, index) });
    }
    if (match[1] !== undefined) {
      tokens.push({ kind: "strong", text: match[1] });
    } else if (match[2] !== undefined && match[3] !== undefined) {
      tokens.push(isSafeHref(match[3]) ? { kind: "link", text: match[2], href: match[3] } : { kind: "text", text: match[2] });
    }
    last = index + match[0].length;
  }
  if (last < text.length) {
    tokens.push({ kind: "text", text: text.slice(last) });
  }
  return tokens;
}

export function isSafeHref(href: string): boolean {
  return (href.startsWith("/") && !href.startsWith("//")) || href.startsWith("#") || href.startsWith("mailto:") || href.startsWith("https://");
}

/** Headings with an id, for the table of contents. */
export function tableOfContents(blocks: Block[]): { id: string; text: string }[] {
  return blocks.flatMap((b) => (b.type === "h2" && b.id ? [{ id: b.id, text: b.text }] : []));
}

/** Reading time in minutes at about 200 Persian words per minute, at least one. */
export function readingMinutes(blocks: Block[]): number {
  const words = blocks
    .flatMap((b) => ("text" in b ? [b.text] : b.items))
    .join(" ")
    .split(/\s+/)
    .filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

/** Plain text of the blocks, used for the help search index. */
export function plainText(blocks: Block[]): string {
  return blocks.flatMap((b) => ("text" in b ? [b.text] : b.items)).join(" ").replace(/\*\*|\[|\]\([^)]*\)/g, "");
}
