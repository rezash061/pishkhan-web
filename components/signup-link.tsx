"use client";

import { useEffect, type ReactNode } from "react";
import { useClientValue } from "@/lib/use-client";

// Hands the visitor over to the user panel's sign-up with plan, template, UTM and affiliate parameters (WS-1.8).
// Pages are static, so attribution is read in the browser: the first landing URL's parameters are kept for the
// session and added to every sign-up link.

const KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content", "ref"] as const;
const STORAGE_KEY = "pk_attribution";

export function readAttribution(search: string, stored: string | null): Record<string, string> {
  const fromUrl = new URLSearchParams(search);
  let saved: Record<string, string> = {};
  try {
    saved = stored ? (JSON.parse(stored) as Record<string, string>) : {};
  } catch {
    saved = {};
  }
  const result: Record<string, string> = {};
  for (const key of KEYS) {
    const value = fromUrl.get(key) ?? saved[key];
    if (value) {
      result[key] = value.slice(0, 100);
    }
  }
  return result;
}

export function buildSignupUrl(panelUrl: string, params: Record<string, string | undefined>): string {
  const url = new URL("/signup", panelUrl);
  for (const [key, value] of Object.entries(params)) {
    if (value) {
      url.searchParams.set(key, value);
    }
  }
  return url.toString();
}

export function SignupLink({ panelUrl, plan, template, className, event = "cta_click", children }: { panelUrl: string; plan?: string; template?: string; className?: string; event?: string; children: ReactNode }) {
  // Serialized so the snapshot is a primitive; parsed below.
  const serialized = useClientValue(() => {
    let stored: string | null = null;
    try {
      stored = sessionStorage.getItem(STORAGE_KEY);
    } catch {
      // Storage can be blocked; attribution is a convenience.
    }
    return JSON.stringify(readAttribution(window.location.search, stored));
  });
  const attribution = serialized ? (JSON.parse(serialized) as Record<string, string>) : {};

  // Keep the first landing page's parameters for the rest of the session.
  useEffect(() => {
    if (!serialized) return;
    try {
      sessionStorage.setItem(STORAGE_KEY, serialized);
    } catch {
      // ignore
    }
  }, [serialized]);

  return (
    <a href={buildSignupUrl(panelUrl, { plan, template, ...attribution })} className={className} data-umami-event={event} data-umami-event-plan={plan}>
      {children}
    </a>
  );
}

/** Mounted once in the root layout: remembers the landing URL's UTM and `ref` parameters for the session. */
export function AttributionCapture() {
  useEffect(() => {
    try {
      const value = readAttribution(window.location.search, sessionStorage.getItem(STORAGE_KEY));
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(value));
    } catch {
      // Storage can be blocked; attribution is a convenience.
    }
  }, []);
  return null;
}
