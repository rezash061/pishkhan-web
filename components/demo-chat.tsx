"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { useMessages, useTranslations } from "next-intl";
import { getAltchaPayload } from "@/lib/altcha";
import { formatNumber } from "@/lib/persian";
import { Icon } from "./icons";

interface ChatMessage {
  from: "user" | "bot" | "system";
  text: string;
  sources?: string[];
  confidence?: number;
}

const MAX_MESSAGES = 10;

/**
 * Live demo against the backend's fixed demo workspace (`POST /api/v1/public/demo-chat` through `/api/demo-chat`).
 * ALTCHA is solved once per session; the backend rate-limits and caps messages per session.
 */
export function DemoChat({ registerHref }: { registerHref: string }) {
  const t = useTranslations("demo");
  const messages = useMessages() as { demo: { samples: string[] } };
  const [chat, setChat] = useState<ChatMessage[]>([{ from: "bot", text: t("greeting") }]);
  const [input, setInput] = useState("");
  const [state, setState] = useState<"idle" | "verifying" | "thinking" | "ended">("idle");
  const [remaining, setRemaining] = useState(MAX_MESSAGES);
  const sessionId = useRef<string>("");
  const proof = useRef<string | null>(null);
  const list = useRef<HTMLOListElement>(null);

  useEffect(() => {
    sessionId.current = crypto.randomUUID();
  }, []);

  // Scroll only the message list, never the page (scrollIntoView would jump the landing page to the demo).
  useEffect(() => {
    const el = list.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [chat, state]);

  async function send(text: string) {
    const message = text.trim().slice(0, 500);
    if (!message || state !== "idle") return;
    setInput("");
    setChat((c) => [...c, { from: "user", text: message }]);

    if (!proof.current) {
      setState("verifying");
      proof.current = await getAltchaPayload().catch(() => null);
    }
    setState("thinking");
    (window as { umami?: { track: (e: string) => void } }).umami?.track("demo_message");

    try {
      const response = await fetch("/api/demo-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId: sessionId.current, message, altcha: proof.current ?? undefined }),
      });
      const body = (await response.json().catch(() => ({}))) as { reply?: string; sources?: string[]; confidence?: number; remaining?: number; error?: string };
      if (response.ok && body.reply) {
        setChat((c) => [...c, { from: "bot", text: body.reply!, sources: body.sources, confidence: body.confidence }]);
        const left = body.remaining ?? remaining - 1;
        setRemaining(left);
        setState(left <= 0 ? "ended" : "idle");
        if (left <= 0) setChat((c) => [...c, { from: "system", text: t("limitReached") }]);
        return;
      }
      const errorKey = body.error === "limit" ? "limitReached" : response.status === 429 || response.status === 503 ? "busy" : response.status === 404 || response.status === 501 ? "unavailable" : "error";
      if (body.error === "botCheckFailed") proof.current = null;
      setChat((c) => [...c, { from: "system", text: t(errorKey) }]);
      setState(errorKey === "limitReached" ? "ended" : "idle");
    } catch {
      setChat((c) => [...c, { from: "system", text: t("error") }]);
      setState("idle");
    }
  }

  function onSubmit(event: FormEvent) {
    event.preventDefault();
    void send(input);
  }

  return (
    <div className="overflow-hidden rounded-[1.75rem] border border-border bg-surface shadow-[var(--shadow-float)]">
      <div className="flex items-center gap-3 border-b border-border px-5 py-4">
        <span className="flex size-10 items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-accent-500 text-white">
          <Icon name="shirt" className="size-5" />
        </span>
        <div>
          <p className="font-bold">{t("shopName")}</p>
          <p className="text-xs text-muted">{t("bot")}</p>
        </div>
        <span className="ms-auto text-xs text-muted" aria-live="polite">
          {t("remaining", { count: remaining })}
        </span>
      </div>

      <ol ref={list} className="flex h-80 flex-col gap-3 overflow-y-auto bg-surface-2/60 p-4 sm:h-96" aria-live="polite" aria-label={t("title")}>
        {chat.map((m, i) => (
          <li key={i} className={m.from === "user" ? "self-start" : m.from === "bot" ? "self-end" : "self-center"}>
            {m.from === "system" ? (
              <p className="max-w-sm rounded-xl bg-amber-50 px-3 py-2 text-center text-sm leading-7 text-amber-950 dark:bg-amber-950/50 dark:text-amber-100">{m.text}</p>
            ) : (
              <div className={`max-w-[18rem] sm:max-w-sm ${m.from === "user" ? "rounded-2xl rounded-ss-md bg-brand-600 text-white" : "rounded-2xl rounded-se-md border border-border bg-surface"} px-4 py-2.5`}>
                <span className="sr-only">{m.from === "user" ? t("you") : t("bot")}: </span>
                <p className="whitespace-pre-line leading-7" dir="auto">
                  {m.text}
                </p>
                {m.from === "bot" && (m.sources?.length || m.confidence !== undefined) ? (
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {m.sources?.map((s) => (
                      <span key={s} className="rounded-full bg-brand-50 px-2 py-0.5 text-[0.7rem] font-bold text-brand-700 dark:bg-brand-950 dark:text-brand-200">
                        {t("answeredFrom", { source: s })}
                      </span>
                    ))}
                    {m.confidence !== undefined ? (
                      <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[0.7rem] font-bold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200">
                        {t("confidence", { value: formatNumber(Math.round(m.confidence * 100)) })}
                      </span>
                    ) : null}
                  </div>
                ) : null}
              </div>
            )}
          </li>
        ))}
        {state === "verifying" || state === "thinking" ? (
          <li className="self-end rounded-2xl border border-border bg-surface px-4 py-2.5 text-sm text-muted">{state === "verifying" ? t("verifying") : t("thinking")}</li>
        ) : null}
      </ol>

      <div className="border-t border-border p-4">
        {state === "ended" ? (
          <a href={registerHref} className="flex h-12 items-center justify-center rounded-full bg-brand-600 font-bold text-white hover:bg-brand-700">
            {t("registerCta")}
          </a>
        ) : (
          <>
            <div className="mb-3 flex flex-wrap gap-2" role="group" aria-label={t("samplesLabel")}>
              {messages.demo.samples.map((sample) => (
                <button key={sample} type="button" onClick={() => void send(sample)} disabled={state !== "idle"} dir="auto" className="rounded-full border border-border bg-surface px-3 py-1.5 text-sm hover:border-brand-300 hover:bg-brand-50 disabled:opacity-60 dark:hover:bg-brand-950">
                  {sample}
                </button>
              ))}
            </div>
            <form onSubmit={onSubmit} className="flex gap-2">
              <label htmlFor="demo-input" className="sr-only">
                {t("placeholder")}
              </label>
              <input
                id="demo-input"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                maxLength={500}
                dir="auto"
                autoComplete="off"
                placeholder={t("placeholder")}
                className="h-12 min-w-0 flex-1 rounded-full border border-border bg-surface px-5 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-200 dark:focus:ring-brand-900"
              />
              <button type="submit" disabled={state !== "idle" || !input.trim()} className="flex size-12 shrink-0 items-center justify-center rounded-full bg-brand-600 text-white hover:bg-brand-700 disabled:opacity-50" aria-label={t("send")}>
                <Icon name="send" className="size-5 -scale-x-100" />
              </button>
            </form>
          </>
        )}
        <p className="mt-3 text-center text-xs leading-6 text-muted">{t("disclaimer")}</p>
      </div>
    </div>
  );
}
