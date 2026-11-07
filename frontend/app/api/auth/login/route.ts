import { NextRequest, NextResponse } from "next/server";
import { backendError, fetchBackend, readBackendBody } from "../../_lib/backend";

const REMEMBERED_MAX_AGE = 60 * 60 * 24 * 14;
const SESSION_MAX_AGE = 60 * 60 * 8;

export async function POST(request: NextRequest) {
  let credentials: { email?: string; password?: string; rememberMe?: boolean };

  try {
    credentials = await request.json();
  } catch {
    return NextResponse.json({ message: "Invalid request body" }, { status: 400 });
  }

  const { email, password, rememberMe = false } = credentials;
  if (!email || !email.includes("@")) {
    return NextResponse.json({ message: "Invalid email format" }, { status: 400 });
  }
  if (!password || password.length < 8) {
    return NextResponse.json({ message: "Password must be at least 8 characters" }, { status: 400 });
  }

  try {
    const upstream = await fetchBackend(request, "/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Forwarded-For": request.headers.get("x-forwarded-for") || "unknown",
      },
      body: JSON.stringify({ email, password, rememberMe }),
    });
    const data = await readBackendBody(upstream) as { token?: string; user?: unknown; message?: string; error?: string };

    if (!upstream.ok) {
      const message = upstream.status === 401
        ? "Invalid email or password"
        : data.message || data.error || "Authentication failed";
      return NextResponse.json({ message }, { status: upstream.status });
    }

    if (!data.token) {
      return NextResponse.json({ message: "Authentication response did not include a token" }, { status: 502 });
    }

    const response = NextResponse.json({ success: true, token: data.token, user: data.user });
    response.cookies.set("auth-token", data.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: rememberMe ? REMEMBERED_MAX_AGE : SESSION_MAX_AGE,
    });
    return response;
  } catch (error) {
    console.error("Login backend error:", error);
    return backendError(error);
  }
}
