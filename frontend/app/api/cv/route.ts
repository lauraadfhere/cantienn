import { getParse, json, errorJson } from "@/lib/backend/http";

export const dynamic = "force-dynamic";

export async function GET() {
  const parse = getParse();
  if (!parse) return errorJson("Backend is not configured", 503);
  try {
    const cv = await parse.getCV();
    return json(cv ?? {});
  } catch (error) {
    console.error("CV fetch failed:", error);
    return errorJson("Failed to load CV", 502);
  }
}
