"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState, type FormEvent } from "react";
import { useMessages, useTranslations } from "next-intl";
import { getAltchaPayload } from "@/lib/altcha";
import { useSearchParam } from "@/lib/use-client";
import { validateLead, type LeadErrors, type LeadInput } from "@/lib/validation";
import { Icon } from "./icons";

type Status = "idle" | "verifying" | "submitting" | "success" | "error";

const VERTICALS = [
  ["clothing", "پوشاک"],
  ["cosmetics", "آرایشی و بهداشتی"],
  ["gold-jewelry", "طلا و جواهر"],
  ["clinics-beauty", "کلینیک و زیبایی"],
  ["courses", "دوره و آموزش"],
  ["food", "خوراکی و کافه"],
  ["home", "خانه و دکور"],
  ["agency", "آژانس و ادمین پیج"],
  ["other", "سایر"],
] as const;

function storedAttribution(): Record<string, string> | undefined {
  try {
    const raw = sessionStorage.getItem("pk_attribution");
    return raw ? (JSON.parse(raw) as Record<string, string>) : undefined;
  } catch {
    return undefined;
  }
}

/** Waitlist and contact form. Submits to this site's `/api/leads`, which forwards to `POST /api/v1/public/leads`. */
export function LeadForm({ type }: { type: "waitlist" | "contact" }) {
  const t = useTranslations("forms");
  const tw = useTranslations(type === "waitlist" ? "waitlist" : "contact");
  const messages = useMessages() as { forms: { dmRanges: string[] } };
  const id = useId();
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<LeadErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const altcha = useRef<Promise<string | null> | null>(null);
  const statusRef = useRef<HTMLDivElement>(null);

  // Prefill from `?vertical=` and `?plan=` (solution and pricing pages link here).
  const verticalParam = useSearchParam("vertical") ?? "";
  const defaults = {
    vertical: VERTICALS.some(([v]) => v === verticalParam) ? verticalParam : "",
    plan: (useSearchParam("plan") ?? "").slice(0, 40),
  };

  // Start the proof-of-work as soon as the visitor interacts, so it is usually done by the time they submit.
  function warmUp() {
    altcha.current ??= getAltchaPayload().catch(() => null);
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === "verifying" || status === "submitting") return;
    const data = new FormData(event.currentTarget);
    const input: LeadInput = {
      type,
      name: String(data.get("name") ?? ""),
      phone: String(data.get("phone") ?? ""),
      instagramHandle: String(data.get("instagramHandle") ?? ""),
      vertical: String(data.get("vertical") ?? ""),
      monthlyDms: String(data.get("monthlyDms") ?? ""),
      message: String(data.get("message") ?? ""),
    };
    const { errors: found } = validateLead(input);
    setErrors(found);
    setFormError(null);
    if (Object.keys(found).length > 0) {
      const first = Object.keys(found)[0];
      event.currentTarget.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
      return;
    }

    setStatus("verifying");
    warmUp();
    const payload = await altcha.current;
    altcha.current = null; // each solution is accepted once
    if (!payload) {
      setStatus("error");
      setFormError(t("botCheckFailed"));
      return;
    }

    setStatus("submitting");
    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...input, plan: defaults.plan || undefined, utm: storedAttribution(), altcha: payload }),
      });
      if (response.ok) {
        setStatus("success");
        (window as { umami?: { track: (e: string, d?: object) => void } }).umami?.track(type === "waitlist" ? "waitlist_submit" : "contact_submit");
        return;
      }
      const body = (await response.json().catch(() => ({}))) as { errors?: LeadErrors; error?: string };
      if (body.errors) setErrors(body.errors);
      setStatus("error");
      setFormError(response.status === 429 ? t("rateLimited") : body.error === "botCheckFailed" ? t("botCheckFailed") : body.errors ? null : t("serverError"));
    } catch {
      setStatus("error");
      setFormError(t("serverError"));
    }
  }

  useEffect(() => {
    if (status === "success" || formError) statusRef.current?.focus();
  }, [status, formError]);

  if (status === "success") {
    return (
      <div ref={statusRef} tabIndex={-1} role="status" className="rounded-[var(--radius-card)] border border-emerald-300 bg-emerald-50 p-6 text-emerald-950 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-100">
        <p className="flex items-center gap-2 text-lg font-black">
          <Icon name="check" className="size-6" />
          {type === "waitlist" ? tw("successTitle") : tw("success")}
        </p>
        {type === "waitlist" ? <p className="mt-2 leading-8">{tw("success")}</p> : null}
      </div>
    );
  }

  const field = "mt-1.5 block w-full rounded-xl border border-border bg-surface px-4 py-3 text-base outline-none transition-colors focus:border-brand-500 focus:ring-2 focus:ring-brand-200 aria-[invalid=true]:border-danger dark:focus:ring-brand-900";
  const label = "block text-sm font-bold";
  const errorText = (key: keyof LeadInput) =>
    errors[key] ? (
      <p id={`${id}-${key}-error`} className="mt-1.5 text-sm text-danger">
        {t(errors[key])}
      </p>
    ) : null;
  const describedBy = (key: keyof LeadInput, hint = false) => [errors[key] ? `${id}-${key}-error` : "", hint ? `${id}-${key}-hint` : ""].filter(Boolean).join(" ") || undefined;
  const busy = status === "verifying" || status === "submitting";

  return (
    <form noValidate onSubmit={onSubmit} onFocus={warmUp} className="grid gap-5" aria-busy={busy}>
      {type === "contact" ? (
        <div>
          <label htmlFor={`${id}-name`} className={label}>
            {t("name")}
          </label>
          <input id={`${id}-name`} name="name" autoComplete="name" maxLength={100} className={field} aria-invalid={!!errors.name} aria-describedby={describedBy("name")} />
          {errorText("name")}
        </div>
      ) : null}

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor={`${id}-phone`} className={label}>
            {t("phone")}
          </label>
          <input
            id={`${id}-phone`}
            name="phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            dir="ltr"
            maxLength={20}
            placeholder="09xx xxx xxxx"
            className={`${field} text-start placeholder:text-end`}
            aria-invalid={!!errors.phone}
            aria-describedby={describedBy("phone", true)}
          />
          <p id={`${id}-phone-hint`} className="mt-1.5 text-xs text-muted">
            {t("phoneHint")}
          </p>
          {errorText("phone")}
        </div>
        <div>
          <label htmlFor={`${id}-ig`} className={label}>
            {t("instagram")} {type === "contact" ? <span className="font-normal text-muted">{t("optional")}</span> : null}
          </label>
          <div className="relative">
            <input
              id={`${id}-ig`}
              name="instagramHandle"
              dir="ltr"
              autoCapitalize="none"
              autoCorrect="off"
              spellCheck={false}
              maxLength={31}
              className={`${field} pl-9`}
              aria-invalid={!!errors.instagramHandle}
              aria-describedby={describedBy("instagramHandle")}
            />
            {/* The input is LTR, so the @ sits on the physical left. */}
            <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted" aria-hidden="true">
              @
            </span>
          </div>
          {errorText("instagramHandle")}
        </div>
      </div>

      {type === "waitlist" ? (
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor={`${id}-vertical`} className={label}>
              {t("vertical")}
            </label>
            <select id={`${id}-vertical`} name="vertical" key={defaults.vertical} defaultValue={defaults.vertical} className={field}>
              <option value="">{t("verticalPlaceholder")}</option>
              {VERTICALS.map(([value, text]) => (
                <option key={value} value={value}>
                  {text}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor={`${id}-dms`} className={label}>
              {t("monthlyDms")}
            </label>
            <select id={`${id}-dms`} name="monthlyDms" defaultValue="" className={field}>
              <option value="">{t("verticalPlaceholder")}</option>
              {messages.forms.dmRanges.map((range) => (
                <option key={range} value={range}>
                  {range}
                </option>
              ))}
            </select>
          </div>
        </div>
      ) : null}

      {type === "contact" ? (
        <div>
          <label htmlFor={`${id}-message`} className={label}>
            {t("message")}
          </label>
          <textarea id={`${id}-message`} name="message" rows={5} maxLength={2000} className={field} aria-invalid={!!errors.message} aria-describedby={describedBy("message")} />
          {errorText("message")}
        </div>
      ) : null}

      {formError ? (
        <div ref={statusRef} tabIndex={-1} role="alert" className="rounded-xl border border-red-300 bg-red-50 p-3 text-sm leading-7 text-red-900 dark:border-red-900 dark:bg-red-950/40 dark:text-red-100">
          {formError}
        </div>
      ) : null}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <button type="submit" disabled={busy} className="inline-flex h-13 items-center justify-center gap-2 rounded-full bg-brand-600 px-8 text-base font-bold text-white transition-colors hover:bg-brand-700 disabled:opacity-70">
          {status === "verifying" ? t("verifying") : status === "submitting" ? t("submitting") : type === "waitlist" ? tw("submit") : t("submit")}
        </button>
        <p className="text-xs leading-6 text-muted">
          {t.rich("privacyNote", {
            privacy: (chunks) => (
              <Link href="/privacy" className="underline underline-offset-4">
                {chunks}
              </Link>
            ),
          })}
        </p>
      </div>
    </form>
  );
}
