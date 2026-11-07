import type { NextRequest } from "next/server";
import { createContent, listContent } from "@/lib/backend/admin";

export const dynamic = "force-dynamic";

type Ctx = { params: Promise<{ type: string }> };

export function GET(request: NextRequest, ctx: Ctx) {
  return listContent(request, ctx);
}

export function POST(request: NextRequest, ctx: Ctx) {
  return createContent(request, ctx);
}
