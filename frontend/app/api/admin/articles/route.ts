import { NextRequest } from "next/server";
import { jsonBody, proxyBackend } from "../../_lib/backend";

export async function GET(request: NextRequest) {
  return proxyBackend(request, "/api/admin/articles");
}

export async function POST(request: NextRequest) {
  const body = await jsonBody(request);
  if (body === null) return Response.json({ error: "Invalid request body" }, { status: 400 });
  return proxyBackend(request, "/api/admin/articles", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}
