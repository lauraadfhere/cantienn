import { NextRequest } from "next/server";
import { proxyBackend } from "../_lib/backend";

export async function GET(request: NextRequest) {
  return proxyBackend(request, "/api/cv");
}
