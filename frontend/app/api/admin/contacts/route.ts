import type { NextRequest } from "next/server";
import { listContacts } from "@/lib/backend/admin";

export const dynamic = "force-dynamic";

export function GET(request: NextRequest) {
  return listContacts(request);
}
