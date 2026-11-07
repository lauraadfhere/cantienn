import { NextRequest } from "next/server";
import { jsonBody, proxyBackend } from "../../../../_lib/backend";

const TYPES = new Set(["publications", "books", "journals"]);
type Context = { params: Promise<{ type: string; id: string }> };

async function contentPath(context: Context) {
  const { type, id } = await context.params;
  return TYPES.has(type) ? `/api/admin/content/${type}/${encodeURIComponent(id)}` : null;
}

export async function PUT(request: NextRequest, context: Context) {
  const path = await contentPath(context);
  if (!path) return Response.json({ error: "Unsupported content type" }, { status: 404 });
  const body = await jsonBody(request);
  if (body === null) return Response.json({ error: "Invalid request body" }, { status: 400 });
  return proxyBackend(request, path, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

export async function PATCH(request: NextRequest, context: Context) {
  return PUT(request, context);
}

export async function DELETE(request: NextRequest, context: Context) {
  const path = await contentPath(context);
  if (!path) return Response.json({ error: "Unsupported content type" }, { status: 404 });
  return proxyBackend(request, path, { method: "DELETE" });
}
