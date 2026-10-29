"use client";

import { useCallback, useEffect, useRef, useState, type FormEvent } from "react";
import { useSearchParam } from "@/lib/use-client";
import { useTranslations } from "next-intl";
import { formatJalaliDateTime } from "@/lib/dates";
import { toLatinDigits } from "@/lib/persian";

type Result =
  | { kind: "idle" }
  | { kind: "loading" }
  | { kind: "found"; status: string; createdAt: string; code: string }
  | { kind: "error"; key: "notFound" | "invalid" | "error" };

const CODE = /^[a-z0-9]{8,64}$/;

/** Looks up a Meta data deletion request by confirmation code via `/api/data-deletion/{code}`. */
export function DeletionStatus() {
  const t = useTranslations("dataDeletion");
  const [code, setCode] = useState("");
  const [result, setResult] = useState<Result>({ kind: "idle" });

  const lookup = useCallback(async (raw: string) => {
    const value = toLatinDigits(raw).trim().toLowerCase();
    if (!CODE.test(value)) {
      setResult({ kind: "error", key: "invalid" });
      return;
    }
    setResult({ kind: "loading" });
    try {
      const response = await fetch(`/api/data-deletion/${encodeURIComponent(value)}`, { cache: "no-store" });
      if (response.status === 404) {
        setResult({ kind: "error", key: "notFound" });
        return;
      }
      if (!response.ok) {
        setResult({ kind: "error", key: "error" });
        return;
      }
      const body = (await response.json()) as { status: string; createdAt: string; confirmationCode: string };
      setResult({ kind: "found", status: body.status, createdAt: body.createdAt, code: body.confirmationCode });
    } catch {
      setResult({ kind: "error", key: "error" });
    }
  }, []);

  // Meta sends people here with `?code=`: fill the field and look it up once.
  const fromUrl = useSearchParam("code");
  const looked = useRef(false);
  useEffect(() => {
    if (fromUrl && !looked.current) {
      looked.current = true;
      queueMicrotask(() => {
        setCode(fromUrl);
        void lookup(fromUrl);
      });
    }
  }, [fromUrl, lookup]);

  function onSubmit(event: FormEvent) {
    event.preventDefault();
    void lookup(code);
  }

  const statusKey = result.kind === "found" && ["received", "processing", "completed"].includes(result.status) ? (result.status as "received" | "processing" | "completed") : "unknown";

  return (
    <div className="mt-6">
      <form onSubmit={onSubmit} className="flex flex-col gap-3 sm:flex-row">
        <label htmlFor="deletion-code" className="sr-only">
          {t("codeLabel")}
        </label>
        <input
          id="deletion-code"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          dir="ltr"
          autoComplete="off"
          spellCheck={false}
          maxLength={64}
          placeholder={t("codeLabel")}
          className="h-12 min-w-0 flex-1 rounded-xl border border-border bg-bg px-4 font-mono outline-none placeholder:font-sans focus:border-brand-500 focus:ring-2 focus:ring-brand-200 dark:focus:ring-brand-900"
        />
        <button type="submit" disabled={result.kind === "loading"} className="h-12 rounded-full bg-brand-600 px-6 font-bold text-white hover:bg-brand-700 disabled:opacity-70">
          {t("check")}
        </button>
      </form>
      <div aria-live="polite" className="mt-4">
        {result.kind === "found" ? (
          <div className={`rounded-xl border p-4 leading-8 ${statusKey === "completed" ? "border-emerald-300 bg-emerald-50 text-emerald-950 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-100" : "border-brand-200 bg-brand-50 text-brand-950 dark:border-brand-800 dark:bg-brand-950/40 dark:text-brand-100"}`}>
            <p className="font-black">{t(`status.${statusKey}`)}</p>
            <p className="text-sm">{t("requestedAt", { date: formatJalaliDateTime(result.createdAt) })}</p>
          </div>
        ) : result.kind === "error" ? (
          <p role="alert" className="rounded-xl border border-red-300 bg-red-50 p-4 text-sm text-red-900 dark:border-red-900 dark:bg-red-950/40 dark:text-red-100">
            {t(result.key)}
          </p>
        ) : null}
      </div>
    </div>
  );
}
