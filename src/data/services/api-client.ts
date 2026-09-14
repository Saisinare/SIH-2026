import Constants from 'expo-constants';
import { Result, Success, Failure } from '../../core/error/result';

/**
 * Talks to the same FastAPI backend the web app uses — the one that holds the
 * real village register (8,872 villages across 5 Maharashtra districts), the
 * PostGIS catchments, the committed scheme rules and the NABARD PLP.
 *
 * The app must never invent a village, a scheme rate or a verdict locally and
 * present it as fact, so this client is the primary source of truth; the local
 * engines survive only as an explicitly-labelled offline estimate.
 */

/**
 * How the backend base URL is chosen, in priority order.
 *
 * Deriving the host from Metro rather than hard-coding it matters: a dev
 * machine's LAN address changes whenever the network does (office wifi ->
 * phone hotspot moves you from 10.x to 172.20.10.x), and a pinned IP in .env
 * silently becomes wrong — every screen then reports "cannot reach the server"
 * while the backend is running perfectly.
 */
function resolveBaseUrl(): string {
  // 1. Explicit override. Required for a deployed backend or a device on a
  //    different network; it wins, but it is also the thing that goes stale,
  //    so prefer leaving it unset during local development.
  const fromEnv = process.env.EXPO_PUBLIC_API_URL;
  if (fromEnv) return fromEnv.replace(/\/+$/, '');

  // 2. In Expo dev, Metro serves from the dev machine's own address. Reusing
  //    that host means a phone on the same network reaches the backend with no
  //    configuration, and keeps working when the address changes.
  //    (Constants.expoConfig.hostUri, SDK 57 — verified against the installed
  //    expo-constants typings.)
  const hostUri = Constants.expoConfig?.hostUri;
  if (hostUri) {
    const host = hostUri.split(':')[0];
    // A tunnel host (`*.exp.direct`) proxies ONLY Metro's port. Port 8000 is
    // not tunnelled, so building a URL from it would point at a host that can
    // never answer. Fall through instead of producing a broken address.
    const isTunnel = /\.exp\.direct$/i.test(host) || /\.ngrok(-free)?\.(io|app|dev)$/i.test(host);
    if (host && !isTunnel) return `http://${host}:8000`;
  }

  // 3. Web / simulator running on the dev machine itself. On a physical device
  //    this resolves to the device, not the dev machine — which is why a
  //    tunnel session needs EXPO_PUBLIC_API_URL set to a reachable address.
  return 'http://127.0.0.1:8000';
}

/** True when the app is talking to its own loopback, which on a physical
 *  device means "nothing is there". Surfaced in error copy so the fix is
 *  obvious rather than looking like a backend outage. */
export const API_IS_LOOPBACK = /^https?:\/\/(127\.0\.0\.1|localhost)\b/.test(resolveBaseUrl());

export const API_BASE_URL = resolveBaseUrl();

const DEFAULT_TIMEOUT_MS = 30000;
/** /advise runs a 1,000-run Monte Carlo server-side; it needs real headroom. */
const ADVISE_TIMEOUT_MS = 90000;

export class ApiUnreachableError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ApiUnreachableError';
  }
}

/**
 * Why the backend might be unreachable, in the words of whoever has to fix it.
 * A bare "Network request failed" sends people looking for a server outage
 * when the real cause is almost always a tunnel session or a stale override.
 */
export function unreachableHint(): string {
  if (API_IS_LOOPBACK) {
    return `The app is pointed at ${API_BASE_URL}, which on a phone means the phone itself. ` +
      'Start Expo in LAN mode (npx expo start) instead of --tunnel, or set ' +
      'EXPO_PUBLIC_API_URL to an address the phone can reach.';
  }
  return `Could not reach ${API_BASE_URL}. Check the backend is running and that this ` +
    'device is on the same network as it.';
}

async function request<T>(
  path: string,
  init?: RequestInit,
  timeoutMs: number = DEFAULT_TIMEOUT_MS
): Promise<Result<T>> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(`${API_BASE_URL}${path}`, {
      ...init,
      signal: controller.signal,
      headers: { 'Content-Type': 'application/json', ...(init?.headers || {}) },
    });
    if (!res.ok) {
      let detail = `${res.status} ${res.statusText}`;
      try {
        const body = await res.json();
        if (body?.detail) detail = String(body.detail);
      } catch {
        /* a non-JSON error body is still an error; keep the status line */
      }
      return Failure(new Error(detail));
    }
    return Success((await res.json()) as T);
  } catch (e: any) {
    // An abort or a transport failure both mean "the backend is not reachable
    // right now" — the caller decides whether to fall back to a local estimate.
    const offline = e?.name === 'AbortError' || e?.name === 'TypeError';
    const msg = e?.name === 'AbortError' ? `Request timed out after ${timeoutMs}ms` : String(e?.message || e);
    return Failure(offline ? new ApiUnreachableError(msg) : new Error(msg));
  } finally {
    clearTimeout(timer);
  }
}

/* ── response shapes, mirroring api/main.py ────────────────────────────── */

export interface ApiCandidate {
  shrid2: string;
  place_name: string;
  village_name: string | null;
  town_name: string | null;
  subdistrict_name: string;
  district_name: string;
  population: number;
  score: number;
}

export interface ApiFact<T = any> {
  value: T;
  unit: string | null;
  source: string;
  year: number | null;
  geo_level: string;
  confidence: 'high' | 'medium' | 'low' | 'none';
  note: string | null;
}

export interface ApiSector {
  sector_id: string;
  display_name: { en: string; mr: string };
  shric_bucket: number;
  shric_desc: string;
  role: string;
  capex_inr: number;
  capex_verified: boolean;
}

export interface ApiScheme {
  scheme_id: string;
  scheme_name: string;
  corporation: string;
  target_group: string;
  per_beneficiary_cap_inr: number;
  repayment_years: number;
  moratorium_months?: number;
  interest_slabs: { annual_rate: number; upto_inr: number }[];
  verified: boolean;
  notes?: string | null;
}

/** The full /advise envelope. Left deliberately loose — the app reads a
 *  handful of paths off it and must not silently drop anything else. */
export interface AdviseEnvelope {
  schema_version: string;
  run_id: string;
  query: Record<string, any>;
  resolution: { candidates: ApiCandidate[]; chosen: ApiCandidate; needs_confirmation: boolean };
  geo: Record<string, any>;
  plp: Record<string, any>;
  market: Record<string, ApiFact>;
  finance: Record<string, ApiFact>;
  affordability: Record<string, ApiFact>;
  risk: {
    flags: { code: string; severity: string; message: string; evidence?: ApiFact }[];
    survival_at_recommended: ApiFact<number>;
    survival_at_eligible: ApiFact<number>;
    seasonality_index?: ApiFact;
    seasonality_note?: string | null;
  };
  decision: {
    verdict: 'PROCEED' | 'PROCEED_WITH_CHANGES' | 'RECONSIDER';
    score: Record<string, ApiFact<number>>;
    confidence: string;
    reasons: string[];
    next_steps: string[];
    hard_gates_triggered: string[];
    alternatives: {
      sector: string;
      display_name: string;
      score: ApiFact<number>;
      recommended_loan: ApiFact<number>;
      survival_probability: ApiFact<number>;
    }[];
    override_applied: boolean;
  };
  strategy: Record<string, any>;
  provenance: (ApiFact & { path: string })[];
  narration?: { text: string; path: string };
}

export interface PlpSectionsResponse {
  available: boolean;
  document?: string;
  total_chunks?: number;
  note?: string | null;
  sections?: { heading: string; page_start: number; page_end: number; excerpt: string }[];
  by_sector?: {
    sector_id: string;
    sector_name: { en: string; mr: string };
    sections: { heading: string; page: number; excerpt: string }[];
  }[];
}

/* ── endpoints ─────────────────────────────────────────────────────────── */

export const apiClient = {
  baseUrl: API_BASE_URL,

  health: () => request<{ ok: boolean }>('/health', undefined, 5000),

  sectors: () => request<{ sectors: ApiSector[] }>('/sectors'),

  schemes: () => request<{ schemes: ApiScheme[] }>('/schemes'),

  plpSections: (sector?: string) =>
    request<PlpSectionsResponse>(`/plp/sections${sector ? `?sector=${encodeURIComponent(sector)}` : ''}`),

  resolve: (village: string, districtHint?: string) =>
    request<{ candidates: ApiCandidate[]; ambiguous: boolean; message: string | null }>('/resolve', {
      method: 'POST',
      body: JSON.stringify({ village, district_hint: districtHint ?? null }),
    }),

  advise: (body: {
    village: string;
    capital_inr: number;
    sector: string;
    shrid?: string | null;
    target_group?: string | null;
    annual_income_inr?: number | null;
    override?: boolean;
    lang?: string;
  }) =>
    request<AdviseEnvelope>(
      '/advise',
      { method: 'POST', body: JSON.stringify(body) },
      ADVISE_TIMEOUT_MS
    ),

  runs: (limit = 20) => request<{ runs: ApiRun[] }>(`/runs?limit=${limit}`),
};

/** One row of the backend's run log (MongoDB), as returned by /runs. */
export interface ApiRun {
  run_id: string;
  village: string;
  sector: string;
  capital_inr: number;
  verdict: 'PROCEED' | 'PROCEED_WITH_CHANGES' | 'RECONSIDER';
  confidence: string;
  created_at: string;
}
