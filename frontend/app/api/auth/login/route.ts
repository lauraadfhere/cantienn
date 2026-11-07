import { NextRequest, NextResponse } from "next/server";
import { getBackendConfig } from "@/lib/backend/config";
import { signToken } from "@/lib/backend/jwt";
import { errorJson, getParse, json, readJson, rateLimit, clientKey } from "@/lib/backend/http";
import { ParseError } from "@/lib/backend/parse";

export const dynamic = "force-dynamic";

const REMEMBERED_MAX_AGE = 60 * 60 * 24 * 14;
const SESSION_MAX_AGE = 60 * 60 * 8;

export async function POST(request: NextRequest) {
  if (!rateLimit(`login:${clientKey(request)}`, 10)) {
    return NextResponse.json({ message: "Too many login attempts, try again later" }, { status: 429 });
  }

  const credentials = await readJson<{ email?: string; password?: string; rememberMe?: boolean }>(request);
  if (!credentials) return NextResponse.json({ message: "Invalid request body" }, { status: 400 });

  const { email, password, rememberMe = false } = credentials;
  if (!email || !email.includes("@")) {
    return NextResponse.json({ message: "Invalid email format" }, { status: 400 });
  }
  if (!password || password.length < 8) {
    return NextResponse.json({ message: "Password must be at least 8 characters" }, { status: 400 });
  }

  const parse = getParse();
  const { jwtSecret } = getBackendConfig();
  if (!parse || !jwtSecret) {
    return NextResponse.json({ message: "Backend is not configured" }, { status: 503 });
  }

  let user;
  try {
    user = await parse.loginUser(email, password);
  } catch (error) {
    if (error instanceof ParseError && (error.status === 400 || error.status === 401 || error.status === 404)) {
      return NextResponse.json({ message: "Invalid email or password" }, { status: 401 });
    }
    console.error("Login backend error:", error);
    return NextResponse.json({ message: "Authentication service unavailable" }, { status: 502 });
  }

  const claims = { userId: user.id, email: user.email, name: user.name, role: user.role };
  const token = await signToken(jwtSecret, claims, "access");
  const refreshToken = rememberMe ? await signToken(jwtSecret, claims, "refresh") : undefined;

  const response = NextResponse.json({
    success: true,
    token,
    ...(refreshToken ? { refreshToken } : {}),
    user: { id: user.id, email: user.email, name: user.name, role: user.role, username: user.username },
  });
  response.cookies.set("auth-token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: rememberMe ? REMEMBERED_MAX_AGE : SESSION_MAX_AGE,
  });
  return response;
}

export function GET() {
  return errorJson("Method not allowed", 405);
}
