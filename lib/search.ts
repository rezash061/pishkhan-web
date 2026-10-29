import { normalizeForSearch } from "./persian";

// Client-side help search over a prebuilt index (plan 4.5). The index is small (tens of articles), so a
// scored token match is enough; the normalization matches the backend (ی/ک, digits, ZWNJ, diacritics).

export interface SearchDoc {
  href: string;
  title: string;
  description: string;
  category: string;
  /** Normalized title, description and body text. */
  haystack: string;
  normalizedTitle: string;
}

export function buildDoc(doc: Omit<SearchDoc, "haystack" | "normalizedTitle">, body: string): SearchDoc {
  return {
    ...doc,
    haystack: normalizeForSearch(`${doc.title} ${doc.description} ${body}`),
    normalizedTitle: normalizeForSearch(doc.title),
  };
}

/** Every query token must appear; title hits rank higher. */
export function searchDocs(docs: SearchDoc[], query: string, limit = 20): SearchDoc[] {
  const tokens = normalizeForSearch(query).split(" ").filter((t) => t.length > 0);
  if (tokens.length === 0) return [];
  return docs
    .map((doc) => {
      let score = 0;
      for (const token of tokens) {
        if (!doc.haystack.includes(token)) return null;
        score += doc.normalizedTitle.includes(token) ? 3 : 1;
      }
      return { doc, score };
    })
    .filter((x): x is { doc: SearchDoc; score: number } => x !== null)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((x) => x.doc);
}
