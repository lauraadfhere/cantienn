import type { NextRequest } from "next/server";
import { updateCV } from "@/lib/backend/admin";

export const dynamic = "force-dynamic";

export function PUT(request: NextRequest) {
  return updateCV(request);
}
