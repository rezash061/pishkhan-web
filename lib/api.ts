import "server-only";
import { env } from "./env";

// Typed client for the backend's public API (`backend/openapi/public.v1.json`). Only server code calls the
// backend; the browser talks to this site's own route handlers.

export interface ProblemDetails {
  type?: string | null;
  title?: string | null;
  status?: number | null;
  detail?: string | null;
  errors?: Record<string, string[]>;
  traceId?: string;
}

export type ApiResult<T> =
  | { ok: true; status: number; data: T }
  | { ok: false; status: number; problem: ProblemDetails | null };

export interface PublicFetchOptions {
  method?: "GET" | "POST";
  body?: unknown;
  /** Seconds for the Next.js data cache; `false` disables caching. */
  revalidate?: number | false;
  tags?: string[];
  /** The visitor's IP, forwarded so the backend rate limiter counts visitors, not this server. */
  clientIp?: string | null;
  timeoutMs?: number;
}

export async function publicApi<T>(path: string, options: PublicFetchOptions = {}): Promise<ApiResult<T>> {
  const { method = "GET", body, revalidate = false, tags, clientIp, timeoutMs = 8000 } = options;
  const headers: Record<string, string> = { Accept: "application/json" };
  if (body !== undefined) {
    headers["Content-Type"] = "application/json";
  }
  if (clientIp) {
    headers["X-Forwarded-For"] = clientIp;
  }

  try {
    const response = await fetch(`${env.apiUrl}/api/v1/public${path}`, {
      method,
      headers,
      body: body === undefined ? undefined : JSON.stringify(body),
      signal: AbortSignal.timeout(timeoutMs),
      ...(revalidate === false ? { cache: "no-store" as const } : { next: { revalidate, tags } }),
    });

    if (response.ok) {
      const data = response.status === 204 ? (undefined as T) : ((await response.json()) as T);
      return { ok: true, status: response.status, data };
    }

    const isProblem = response.headers.get("content-type")?.includes("json") ?? false;
    const problem = isProblem ? ((await response.json().catch(() => null)) as ProblemDetails | null) : null;
    return { ok: false, status: response.status, problem };
  } catch {
    // Network error or timeout: the backend is unreachable.
    return { ok: false, status: 503, problem: null };
  }
}

// ---- Contract types (keep in sync with public.v1.json) ----

/** `GET /altcha/challenge` */
export interface AltchaChallenge {
  algorithm: string;
  challenge: string;
  maxNumber: number;
  salt: string;
  signature: string;
}

/** `GET /meta/instagram/data-deletion/{code}`; status is `received`, `processing` or `completed`. */
export interface DataDeletionStatus {
  confirmationCode: string;
  status: "received" | "processing" | "completed" | (string & {});
  createdAt: string;
}

/** One line of a plan's price list. */
export interface PlanFeature {
  key: string;
  label: string;
  included: boolean;
  /** Optional limit shown next to the label, for example «۳ حساب». */
  limit: string | null;
}

/** `GET /plans`: published plans in display order (backend Billing, `PublicPlan` in public.v1.json). */
export interface PublicPlan {
  code: string;
  name: string;
  tagline: string | null;
  description: string | null;
  monthly: { amount: number; currency: string };
  annual: { amount: number; currency: string } | null;
  /** Included AI conversations per month; `null` means unlimited. */
  aiConversations: number | null;
  /** Price of one AI conversation above the included amount (soft overage); `null` means none. */
  overagePerConversation: { amount: number; currency: string } | null;
  channelAccounts: number | null;
  seats: number | null;
  highlighted: boolean;
  isFree: boolean;
  /** Per-meter limits (`ai_conversations`, `seats`, ...); `null` means unlimited. */
  limits: Record<string, number | null>;
  features: PlanFeature[];
}

// ---- Proposed contract (BE-1.13, not in public.v1.json yet; see docs/backend-contract.md) ----

export interface LeadRequest {
  type: "waitlist" | "contact";
  name?: string;
  phone: string;
  instagramHandle?: string;
  vertical?: string;
  monthlyDms?: string;
  message?: string;
  utm?: Record<string, string>;
  altcha: string;
}

export interface DemoChatRequest {
  sessionId: string;
  message: string;
  altcha?: string;
}

export interface DemoChatResponse {
  reply: string;
  confidence: number;
  sources: string[];
  remaining: number;
}
