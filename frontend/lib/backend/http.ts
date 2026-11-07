// Shared helpers for Worker route handlers: JSON responses, auth, rate limit.

import { NextRequest, NextResponse } from "next/server";
import { getBackendConfig } from "./config";
import { verifyToken, type Claims } from "./jwt";
import { ParseClient } from "./parse";

export function json(data: unknown, status = 200) {
  return NextResponse.json(data, { status, headers: { "Cache-Control": "no-store" } });
}

export function errorJson(message: string, status: number, key: "error" | "message" = "error") {
  return json({ [key]: message }, status);
}

export async function readJson<T = Record<string, unknown>>(request: NextRequest): Promise<T | null> {
  try {
    return (await request.json()) as T;
  } catch {
    return null;
  }
}

export function getParse(): ParseClient | null {
  const { parse } = getBackendConfig();
  return parse ? new ParseClient(parse) : null;
}

export function getBearerToken(request: NextRequest): string | null {
  const header = request.headers.get("authorization") || "";
  if (header.toLowerCase().startsWith("bearer ")) return header.slice(7).trim();
  return request.cookies.get("auth-token")?.value || null;
}

// Returns the claims for a valid access token, or a NextResponse error.
export async function requireUser(request: NextRequest): Promise<{ claims: Claims } | { response: NextResponse }> {
  const token = getBearerToken(request);
  if (!token) return { response: errorJson("Authorization token required", 401) };
  try {
    const claims = await verifyToken(getBackendConfig().jwtSecret, token);
    if (claims.tokenType !== "access") return { response: errorJson("Invalid token type", 401) };
    return { claims };
  } catch {
    return { response: errorJson("Invalid or expired token", 401) };
  }
}

export async function requireAdmin(request: NextRequest): Promise<{ response: NextResponse } | null> {
  const auth = await requireUser(request);
  if ("response" in auth) return { response: auth.response };
  if (auth.claims.role !== "admin") return { response: errorJson("Admin access required", 403) };
  return null;
}

// Best-effort, per-isolate fixed-window limiter. Workers do not share memory
// across isolates, so this limits bursts per isolate rather than globally.
const WINDOW_MS = 60_000;
const hits = new Map<string, { count: number; reset: number }>();

export function rateLimit(key: string, limit: number): boolean {
  const now = Date.now();
  const entry = hits.get(key);
  if (!entry || entry.reset < now) {
    hits.set(key, { count: 1, reset: now + WINDOW_MS });
    if (hits.size > 5_000) {
      for (const [k, v] of hits) if (v.reset < now) hits.delete(k);
    }
    return true;
  }
  entry.count += 1;
  return entry.count <= limit;
}

export function clientKey(request: NextRequest): string {
  return request.headers.get("cf-connecting-ip") || request.headers.get("x-forwarded-for") || "unknown";
}
