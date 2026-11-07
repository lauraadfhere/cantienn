import { getParse, json, errorJson } from "@/lib/backend/http";

export const dynamic = "force-dynamic";

export async function GET() {
  const parse = getParse();
  if (!parse) return errorJson("Backend is not configured", 503);
  try {
    return json(await parse.listArticles());
  } catch (error) {
    console.error("Articles fetch failed:", error);
    return errorJson("Failed to load articles", 502);
  }
}
