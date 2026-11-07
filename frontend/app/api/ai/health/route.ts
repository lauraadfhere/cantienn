import { aiConfigured, getNvapiConfig } from "@/lib/backend/ai";
import { json } from "@/lib/backend/http";

export const dynamic = "force-dynamic";

export function GET() {
  const configured = aiConfigured();
  return json({ status: configured ? "ok" : "not_configured", model: getNvapiConfig().model }, configured ? 200 : 503);
}
