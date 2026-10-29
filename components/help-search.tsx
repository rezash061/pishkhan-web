"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useClientValue } from "@/lib/use-client";
import { useTranslations } from "next-intl";
import { searchDocs, type SearchDoc } from "@/lib/search";
import { Icon } from "./icons";

/** Search box. On the help home it submits to /help/search; on the search page it filters live. */
export function HelpSearchBox({ defaultValue = "", autoFocus = false }: { defaultValue?: string; autoFocus?: boolean }) {
  const t = useTranslations("help");
  return (
    <form action="/help/search" role="search" className="relative max-w-xl">
      <label htmlFor="help-q" className="sr-only">
        {t("searchLabel")}
      </label>
      <Icon name="search" className="pointer-events-none absolute start-4 top-1/2 size-5 -translate-y-1/2 text-muted" />
      <input
        id="help-q"
        name="q"
        type="search"
        defaultValue={defaultValue}
        autoFocus={autoFocus}
        placeholder={t("searchPlaceholder")}
        className="h-14 w-full rounded-full border border-border bg-surface ps-12 pe-28 text-base outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-200 dark:focus:ring-brand-900"
      />
      <button type="submit" className="absolute end-2 top-2 h-10 rounded-full bg-brand-600 px-5 text-sm font-bold text-white hover:bg-brand-700">
        {t("search")}
      </button>
    </form>
  );
}

export function HelpSearchResults({ index }: { index: SearchDoc[] }) {
  const t = useTranslations("help");
  const query = useClientValue(() => new URLSearchParams(window.location.search).get("q") ?? "");

  const results = useMemo(() => (query ? searchDocs(index, query) : []), [index, query]);

  if (query === null) return null;

  return (
    <div>
      <HelpSearchBox defaultValue={query} autoFocus={!query} />
      {query ? (
        <p className="mt-8 font-bold" role="status">
          {t("results", { count: results.length, query })}
        </p>
      ) : null}
      <ul className="mt-6 space-y-3">
        {results.map((r) => (
          <li key={r.href}>
            <Link href={r.href} className="block rounded-2xl border border-border bg-surface p-5 hover:border-brand-300">
              <p className="text-xs font-bold text-brand-600">{r.category}</p>
              <p className="mt-1 font-black">{r.title}</p>
              <p className="mt-1 text-sm leading-7 text-muted">{r.description}</p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
