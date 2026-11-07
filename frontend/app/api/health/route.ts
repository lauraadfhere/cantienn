import { getBackendConfig } from "@/lib/backend/config";
import { json } from "@/lib/backend/http";

export const dynamic = "force-dynamic";

export async function GET() {
  const config = getBackendConfig();
  const ready = Boolean(config.parse && config.jwtSecret);
  return json(
    { status: ready ? "ok" : "degraded", runtime: "cloudflare-worker", parseConfigured: Boolean(config.parse) },
    ready ? 200 : 503,
  );
}
