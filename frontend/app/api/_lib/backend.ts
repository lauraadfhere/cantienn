import { NextRequest, NextResponse } from "next/server";

const DEFAULT_BACKEND_URL = "http://localhost:9050";
const REQUEST_TIMEOUT_MS = 12_000;

export function getBackendUrl() {
  return (process.env.BACKEND_URL || process.env.NEXT_PUBLIC_BACKEND_URL || DEFAULT_BACKEND_URL).replace(/\/$/, "");
}

export function getAuthToken(request: NextRequest) {
  return request.cookies.get("auth-token")?.value;
}

export async function fetchBackend(
  request: NextRequest,
  path: string,
  init: RequestInit = {},
) {
  const headers = new Headers(init.headers);
  const token = getAuthToken(request);

  if (token && !headers.has("Authorization")) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    return await fetch(`${getBackendUrl()}${path.startsWith("/") ? path : `/${path}`}`, {
      ...init,
      headers,
      cache: init.cache ?? "no-store",
      signal: controller.signal,
    });
  } finally {
    clearTimeout(timeout);
  }
}

export async function readBackendBody(response: Response): Promise<unknown> {
  const text = await response.text();
  if (!text) return response.ok ? { success: true } : { error: response.statusText || "Backend request failed" };

  try {
    return JSON.parse(text);
  } catch {
    const message = text.slice(0, 1_000);
    return response.ok ? { data: message } : { error: message || response.statusText || "Backend request failed" };
  }
}

export function backendError(error: unknown) {
  const timedOut = error instanceof Error && error.name === "AbortError";
  return NextResponse.json(
    { error: timedOut ? "Backend request timed out" : "Backend service is unavailable" },
    { status: timedOut ? 504 : 503 },
  );
}

export async function proxyBackend(
  request: NextRequest,
  path: string,
  init: RequestInit = {},
) {
  try {
    const response = await fetchBackend(request, path, init);
    const body = await readBackendBody(response);
    return NextResponse.json(body, { status: response.status });
  } catch (error) {
    console.error(`Backend proxy failed for ${path}:`, error);
    return backendError(error);
  }
}

export async function jsonBody(request: NextRequest) {
  try {
    return await request.json();
  } catch {
    return null;
  }
}
