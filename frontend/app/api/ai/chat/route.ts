import { NextRequest } from "next/server";
import { aiConfigured, chatCompletion, CONSULTANT_SYSTEM_PROMPT, validateChatInput } from "@/lib/backend/ai";
import { errorJson, json, readJson, rateLimit, clientKey } from "@/lib/backend/http";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  if (!rateLimit(`ai:${clientKey(request)}`, 20)) {
    return json({ success: false, error: "Too many requests" }, 429);
  }

  const body = await readJson<{ message?: unknown; history?: unknown }>(request);
  if (!body) return json({ success: false, error: "Invalid request format" }, 400);

  const input = validateChatInput(body.message, body.history);
  if (!input.ok) return json({ success: false, error: input.error }, 400);

  if (!aiConfigured()) return json({ success: false, error: "AI service is not configured" }, 503);

  try {
    const reply = await chatCompletion([
      { role: "system", content: CONSULTANT_SYSTEM_PROMPT },
      ...input.history,
      { role: "user", content: input.message },
    ]);
    return json({ success: true, message: reply });
  } catch (error) {
    console.error("AI chat failed:", error);
    return json({ success: false, error: "AI service is currently unavailable" }, 502);
  }
}

export function GET() {
  return errorJson("Method not allowed", 405);
}
