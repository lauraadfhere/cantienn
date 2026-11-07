import { NextRequest, NextResponse } from "next/server";
import { errorJson, getParse, json, readJson, rateLimit, clientKey } from "@/lib/backend/http";
import { ParseError } from "@/lib/backend/parse";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  if (!rateLimit(`register:${clientKey(request)}`, 5)) {
    return NextResponse.json({ message: "Too many requests, try again later" }, { status: 429 });
  }

  const body = await readJson<{ fullName?: string; email?: string; password?: string }>(request);
  if (!body) return NextResponse.json({ message: "Invalid request body" }, { status: 400 });

  const { fullName, email, password } = body;
  if (!fullName || fullName.length < 2) return NextResponse.json({ message: "Full name is too short" }, { status: 400 });
  if (!email || !email.includes("@")) return NextResponse.json({ message: "Invalid email format" }, { status: 400 });
  if (!password || password.length < 8) {
    return NextResponse.json({ message: "Password must be at least 8 characters" }, { status: 400 });
  }

  const parse = getParse();
  if (!parse) return NextResponse.json({ message: "Backend is not configured" }, { status: 503 });

  try {
    const user = await parse.registerUser(fullName, email, password);
    return json({ success: true, user: { id: user.id, email: user.email, name: user.name, role: user.role } });
  } catch (error) {
    if (error instanceof ParseError && (error.status === 400 || error.status === 202)) {
      return NextResponse.json({ message: "Registration failed" }, { status: 400 });
    }
    console.error("Registration backend error:", error);
    return NextResponse.json({ message: "Backend connection issue" }, { status: 503 });
  }
}

export function GET() {
  return errorJson("Method not allowed", 405);
}
