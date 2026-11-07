// Admin API handlers. Port of the Go admin routes in backend/main.go.
// Every handler requires an access token whose role is "admin".

import type { NextRequest } from "next/server";
import { errorJson, getParse, json, readJson, requireAdmin } from "./http";
import { isContactStatus, isContentType, isOrderStatus, type ContentType } from "./parse";

type Ctx = { params: Promise<Record<string, string>> };

async function guard(request: NextRequest) {
  return requireAdmin(request);
}

function serverError(label: string, error: unknown) {
  console.error(`${label} failed:`, error);
  return errorJson(`${label} failed`, 502);
}

// ----- Articles -----
export async function listArticles(request: NextRequest) {
  const denied = await guard(request);
  if (denied) return denied.response;
  const parse = getParse();
  if (!parse) return errorJson("Parse not configured", 503);
  try {
    return json(await parse.listArticles());
  } catch (e) {
    return serverError("Load articles", e);
  }
}

export async function createArticle(request: NextRequest) {
  const denied = await guard(request);
  if (denied) return denied.response;
  const body = await readJson(request);
  if (!body) return errorJson("Invalid article", 400);
  const parse = getParse();
  if (!parse) return errorJson("Parse not configured", 503);
  try {
    const id = await parse.upsertArticle(body);
    return json({ id, message: "Article saved" });
  } catch (e) {
    return serverError("Create article", e);
  }
}

export async function updateArticle(request: NextRequest, ctx: Ctx) {
  const denied = await guard(request);
  if (denied) return denied.response;
  const { id } = await ctx.params;
  const body = await readJson(request);
  if (!body) return errorJson("Invalid article", 400);
  const parse = getParse();
  if (!parse) return errorJson("Parse not configured", 503);
  try {
    await parse.upsertArticle({ ...body, id });
    return json({ id, message: "Article updated" });
  } catch (e) {
    return serverError("Update article", e);
  }
}

export async function deleteArticle(request: NextRequest, ctx: Ctx) {
  const denied = await guard(request);
  if (denied) return denied.response;
  const { id } = await ctx.params;
  const parse = getParse();
  if (!parse) return errorJson("Parse not configured", 503);
  try {
    await parse.deleteArticle(id);
    return json({ message: "Article deleted" });
  } catch (e) {
    return serverError("Delete article", e);
  }
}

// ----- CV -----
export async function updateCV(request: NextRequest) {
  const denied = await guard(request);
  if (denied) return denied.response;
  const body = await readJson(request);
  if (!body) return errorJson("Invalid CV", 400);
  const parse = getParse();
  if (!parse) return errorJson("Parse not configured", 503);
  try {
    const id = await parse.upsertCV(body);
    return json({ id, message: "CV saved" });
  } catch (e) {
    return serverError("Save CV", e);
  }
}

// ----- Publications / books / journals -----
function contentTypeOf(params: Record<string, string>): ContentType | null {
  return isContentType(params.type) ? params.type : null;
}

export async function listContent(request: NextRequest, ctx: Ctx) {
  const denied = await guard(request);
  if (denied) return denied.response;
  const type = contentTypeOf(await ctx.params);
  if (!type) return errorJson("Unsupported content type", 400);
  const parse = getParse();
  if (!parse) return errorJson("Parse not configured", 503);
  try {
    return json(await parse.listContent(type, 100));
  } catch (e) {
    return serverError("Load content", e);
  }
}

export async function createContent(request: NextRequest, ctx: Ctx) {
  const denied = await guard(request);
  if (denied) return denied.response;
  const type = contentTypeOf(await ctx.params);
  if (!type) return errorJson("Unsupported content type", 400);
  const body = await readJson(request);
  if (!body) return errorJson("Invalid content item", 400);
  const parse = getParse();
  if (!parse) return errorJson("Parse not configured", 503);
  try {
    const id = await parse.createContent(type, body);
    return json({ id }, 201);
  } catch (e) {
    return serverError("Create content", e);
  }
}

export async function updateContent(request: NextRequest, ctx: Ctx) {
  const denied = await guard(request);
  if (denied) return denied.response;
  const { type: rawType, id } = await ctx.params;
  const type = contentTypeOf({ type: rawType });
  if (!type) return errorJson("Unsupported content type", 400);
  const body = await readJson(request);
  if (!body) return errorJson("Invalid content item", 400);
  const parse = getParse();
  if (!parse) return errorJson("Parse not configured", 503);
  try {
    await parse.updateContent(type, id, body);
    return json({ message: "Content updated" });
  } catch (e) {
    return serverError("Update content", e);
  }
}

export async function deleteContent(request: NextRequest, ctx: Ctx) {
  const denied = await guard(request);
  if (denied) return denied.response;
  const { type: rawType, id } = await ctx.params;
  const type = contentTypeOf({ type: rawType });
  if (!type) return errorJson("Unsupported content type", 400);
  const parse = getParse();
  if (!parse) return errorJson("Parse not configured", 503);
  try {
    await parse.deleteContent(type, id);
    return json({ message: "Content deleted" });
  } catch (e) {
    return serverError("Delete content", e);
  }
}

// ----- Orders -----
export async function listOrders(request: NextRequest) {
  const denied = await guard(request);
  if (denied) return denied.response;
  const parse = getParse();
  if (!parse) return json([]);
  try {
    return json(await parse.listOrders());
  } catch (e) {
    return serverError("Load orders", e);
  }
}

export async function updateOrderStatus(request: NextRequest, ctx: Ctx) {
  const denied = await guard(request);
  if (denied) return denied.response;
  const { id } = await ctx.params;
  const body = await readJson<{ status?: unknown }>(request);
  if (!body || !isOrderStatus(body.status)) return errorJson("Invalid order status", 400);
  const parse = getParse();
  if (!parse) return errorJson("Parse not configured", 503);
  try {
    await parse.updateOrderStatus(id, body.status);
    return json({ message: "Order status updated" });
  } catch (e) {
    return serverError("Update order", e);
  }
}

export async function deleteOrder(request: NextRequest, ctx: Ctx) {
  const denied = await guard(request);
  if (denied) return denied.response;
  const { id } = await ctx.params;
  const parse = getParse();
  if (!parse) return errorJson("Parse not configured", 503);
  try {
    await parse.deleteOrder(id);
    return json({ message: "Order deleted" });
  } catch (e) {
    return serverError("Delete order", e);
  }
}

// ----- Contacts -----
export async function listContacts(request: NextRequest) {
  const denied = await guard(request);
  if (denied) return denied.response;
  const parse = getParse();
  if (!parse) return json([]);
  try {
    return json(await parse.listContacts());
  } catch (e) {
    return serverError("Load contacts", e);
  }
}

export async function updateContactStatus(request: NextRequest, ctx: Ctx) {
  const denied = await guard(request);
  if (denied) return denied.response;
  const { id } = await ctx.params;
  const body = await readJson<{ status?: unknown }>(request);
  if (!body || !isContactStatus(body.status)) return errorJson("Invalid contact status", 400);
  const parse = getParse();
  if (!parse) return errorJson("Parse not configured", 503);
  try {
    await parse.updateContactStatus(id, body.status);
    return json({ message: "Contact status updated" });
  } catch (e) {
    return serverError("Update contact", e);
  }
}

export async function deleteContact(request: NextRequest, ctx: Ctx) {
  const denied = await guard(request);
  if (denied) return denied.response;
  const { id } = await ctx.params;
  const parse = getParse();
  if (!parse) return errorJson("Parse not configured", 503);
  try {
    await parse.deleteContact(id);
    return json({ message: "Contact deleted" });
  } catch (e) {
    return serverError("Delete contact", e);
  }
}

