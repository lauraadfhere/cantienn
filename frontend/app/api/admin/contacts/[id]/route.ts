import type { NextRequest } from "next/server";
import { deleteContact, updateContactStatus } from "@/lib/backend/admin";

export const dynamic = "force-dynamic";

type Ctx = { params: Promise<{ id: string }> };

export function PATCH(request: NextRequest, ctx: Ctx) {
  return updateContactStatus(request, ctx);
}

export function DELETE(request: NextRequest, ctx: Ctx) {
  return deleteContact(request, ctx);
}
