import type { NextRequest } from "next/server";
import { deleteArticle, updateArticle } from "@/lib/backend/admin";

export const dynamic = "force-dynamic";

type Ctx = { params: Promise<{ id: string }> };

export function PUT(request: NextRequest, ctx: Ctx) {
  return updateArticle(request, ctx);
}

export function DELETE(request: NextRequest, ctx: Ctx) {
  return deleteArticle(request, ctx);
}
