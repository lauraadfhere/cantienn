import type { NextRequest } from "next/server";
import { deleteOrder, updateOrderStatus } from "@/lib/backend/admin";

export const dynamic = "force-dynamic";

type Ctx = { params: Promise<{ id: string }> };

export function PATCH(request: NextRequest, ctx: Ctx) {
  return updateOrderStatus(request, ctx);
}

export function DELETE(request: NextRequest, ctx: Ctx) {
  return deleteOrder(request, ctx);
}
