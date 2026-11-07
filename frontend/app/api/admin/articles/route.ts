import type { NextRequest } from "next/server";
import { createArticle, listArticles } from "@/lib/backend/admin";

export const dynamic = "force-dynamic";

export function GET(request: NextRequest) {
  return listArticles(request);
}

export function POST(request: NextRequest) {
  return createArticle(request);
}
