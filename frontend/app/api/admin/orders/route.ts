import type { NextRequest } from "next/server";
import { listOrders } from "@/lib/backend/admin";

export const dynamic = "force-dynamic";

export function GET(request: NextRequest) {
  return listOrders(request);
}
