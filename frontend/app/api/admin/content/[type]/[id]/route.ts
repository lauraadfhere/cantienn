import type { NextRequest } from "next/server";
import { deleteContent, updateContent } from "@/lib/backend/admin";

export const dynamic = "force-dynamic";

type Ctx = { params: Promise<{ type: string; id: string }> };

export function PUT(request: NextRequest, ctx: Ctx) {
  return updateContent(request, ctx);
}

export function DELETE(request: NextRequest, ctx: Ctx) {
  return deleteContent(request, ctx);
}
