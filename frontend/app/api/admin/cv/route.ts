import { NextRequest } from "next/server";
import { jsonBody, proxyBackend } from "../../_lib/backend";

export async function PUT(request: NextRequest) {
  const body = await jsonBody(request);
  if (body === null) return Response.json({ error: "Invalid request body" }, { status: 400 });
  return proxyBackend(request, "/api/admin/cv", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}
