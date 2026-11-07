import { NextRequest } from "next/server";
import { jsonBody, proxyBackend } from "../../../_lib/backend";

type Context = { params: Promise<{ id: string }> };

export async function PUT(request: NextRequest, { params }: Context) {
  const body = await jsonBody(request);
  if (body === null) return Response.json({ error: "Invalid request body" }, { status: 400 });
  const { id } = await params;
  return proxyBackend(request, `/api/admin/articles/${encodeURIComponent(id)}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

export async function PATCH(request: NextRequest, context: Context) {
  return PUT(request, context);
}

export async function DELETE(request: NextRequest, { params }: Context) {
  const { id } = await params;
  return proxyBackend(request, `/api/admin/articles/${encodeURIComponent(id)}`, { method: "DELETE" });
}
