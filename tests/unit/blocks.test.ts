import { describe, expect, it } from "vitest";
import { parseInline, readingMinutes, tableOfContents } from "@/lib/blocks";

describe("parseInline", () => {
  it("parses bold and safe links", () => {
    expect(parseInline("see **this** and [privacy](/privacy)")).toEqual([
      { kind: "text", text: "see " },
      { kind: "strong", text: "this" },
      { kind: "text", text: " and " },
      { kind: "link", text: "privacy", href: "/privacy" },
    ]);
  });
  it.each(["javascript:alert(1)", "//evil.example", "http://plain.example", "data:text/html,x"])("never links %s", (href) => {
    expect(parseInline(`[x](${href})`).some((t) => t.kind === "link")).toBe(false);
  });
  it("leaves HTML as text", () => expect(parseInline("<img src=x onerror=alert(1)>")).toEqual([{ kind: "text", text: "<img src=x onerror=alert(1)>" }]));
});

describe("tableOfContents and readingMinutes", () => {
  const blocks = [
    { type: "h2" as const, text: "الف", id: "a" },
    { type: "h2" as const, text: "بدون شناسه" },
    { type: "p" as const, text: "کلمه ".repeat(450) },
  ];
  it("lists headings that have ids", () => expect(tableOfContents(blocks)).toEqual([{ id: "a", text: "الف" }]));
  it("estimates reading time", () => expect(readingMinutes(blocks)).toBe(2));
});
