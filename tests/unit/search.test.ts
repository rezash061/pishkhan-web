import { describe, expect, it } from "vitest";
import { helpArticles } from "@/content/help";
import { plainText } from "@/lib/blocks";
import { buildDoc, searchDocs } from "@/lib/search";

const index = helpArticles.map((a) => buildDoc({ href: `/help/${a.category}/${a.slug}`, title: a.title, description: a.description, category: a.category }, plainText(a.body)));

describe("help search", () => {
  it("finds articles when the query is typed with Arabic ي and ك (WS-1.5 acceptance)", () => {
    const results = searchDocs(index, "اتصال اينستاگرام");
    expect(results[0]?.href).toBe("/help/getting-started/connect-instagram");
  });
  it("matches across ZWNJ and space variants", () => {
    expect(searchDocs(index, "گفت وگوی هوشمند").length).toBeGreaterThan(0);
  });
  it("requires every token", () => expect(searchDocs(index, "اینستاگرام زرافه")).toEqual([]));
});
