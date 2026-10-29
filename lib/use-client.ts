"use client";

import { useSyncExternalStore } from "react";

const noopSubscribe = () => () => {};

/**
 * Reads a value that exists only in the browser (URL query, sessionStorage) without a setState-in-effect.
 * Pages are statically generated, so the server snapshot is `null` and the real value appears after hydration.
 * `read` must return a primitive (snapshots are compared with Object.is).
 */
export function useClientValue<T extends string | number | boolean | null>(read: () => T): T | null {
  return useSyncExternalStore(noopSubscribe, read, () => null);
}

export function useSearchParam(name: string): string | null {
  return useClientValue(() => new URLSearchParams(window.location.search).get(name));
}
