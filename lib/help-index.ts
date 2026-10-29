import "server-only";
import { helpArticles, helpCategories } from "@/content/help";
import { plainText } from "./blocks";
import { buildDoc, type SearchDoc } from "./search";

export function helpSearchIndex(): SearchDoc[] {
  return helpArticles.map((a) =>
    buildDoc(
      {
        href: `/help/${a.category}/${a.slug}`,
        title: a.title,
        description: a.description,
        category: helpCategories.find((c) => c.slug === a.category)?.title ?? "",
      },
      plainText(a.body),
    ),
  );
}
