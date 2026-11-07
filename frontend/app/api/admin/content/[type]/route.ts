import { NextRequest } from "next/server";
import { jsonBody, proxyBackend } from "../../../_lib/backend";

const TYPES = new Set(["publications", "books", "journals"]);
type Context = { params: Promise<{ type: string }> };

async function contentPath(context: Context) {
  const { type } = await context.params;
  return TYPES.has(type) ? `/api/admin/content/${type}` : null;
}

export async function GET(request: NextRequest, context: Context) {
  const path = await contentPath(context);
  if (!path) return Response.json({ error: "Unsupported content type" }, { status: 404 });
  return proxyBackend(request, path);
}

export async function POST(request: NextRequest, context: Context) {
  const path = await contentPath(context);
  if (!path) return Response.json({ error: "Unsupported content type" }, { status: 404 });
  const body = await jsonBody(request);
  if (body === null) return Response.json({ error: "Invalid request body" }, { status: 400 });
  return proxyBackend(request, path, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}
