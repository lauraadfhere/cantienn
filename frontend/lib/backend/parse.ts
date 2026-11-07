// Parse Server REST client (Back4App). Port of backend/internal/service/parse.go.
// Uses fetch only so it runs on Cloudflare Workers.

import type { ParseConfig } from "./config";

export type ContentType = "publications" | "books" | "journals";
export const CONTENT_TYPES: ContentType[] = ["publications", "books", "journals"];

const CONTENT_CLASS: Record<ContentType, string> = {
  publications: "Publications",
  books: "Books",
  journals: "Journals",
};

export const ORDER_STATUSES = ["new", "in_progress", "completed", "cancelled"] as const;
export const CONTACT_STATUSES = ["new", "read", "replied", "archived"] as const;

export function isContentType(value: string): value is ContentType {
  return (CONTENT_TYPES as string[]).includes(value);
}

export function isOrderStatus(value: unknown): value is string {
  return typeof value === "string" && (ORDER_STATUSES as readonly string[]).includes(value);
}

export function isContactStatus(value: unknown): value is string {
  return typeof value === "string" && (CONTACT_STATUSES as readonly string[]).includes(value);
}

export class ParseError extends Error {
  constructor(message: string, public status: number) {
    super(message);
  }
}

type Json = Record<string, unknown>;

export class ParseClient {
  constructor(private config: ParseConfig) {}

  private async request<T = Json>(method: string, path: string, body?: unknown): Promise<T> {
    const headers: Record<string, string> = {
      "X-Parse-Application-Id": this.config.appId,
      "X-Parse-REST-API-Key": this.config.restKey,
      "Content-Type": "application/json",
    };
    if (this.config.masterKey) headers["X-Parse-Master-Key"] = this.config.masterKey;

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 30_000);
    try {
      const response = await fetch(`${this.config.serverUrl}${path}`, {
        method,
        headers,
        body: body === undefined ? undefined : JSON.stringify(body),
        cache: "no-store",
        signal: controller.signal,
      });
      const text = await response.text();
      if (!response.ok) {
        throw new ParseError(`Parse API ${method} ${path} returned ${response.status}: ${text}`, response.status);
      }
      return (text ? JSON.parse(text) : {}) as T;
    } finally {
      clearTimeout(timeout);
    }
  }

  // ----- CV -----
  async getCV(): Promise<Json | null> {
    const resp = await this.request<{ results: Json[] }>("GET", "/parse/classes/CV?limit=1");
    if (!resp.results?.length) return null;
    const stored = resp.results[0];
    if (typeof stored.cv_json === "string" && stored.cv_json) {
      return JSON.parse(stored.cv_json) as Json;
    }
    return stored;
  }

  async upsertCV(cv: Json): Promise<string> {
    const payload = { cv_json: JSON.stringify(cv) };
    const existing = await this.request<{ results: { objectId: string }[] }>("GET", "/parse/classes/CV?limit=1");
    if (existing.results?.length) {
      const id = existing.results[0].objectId;
      await this.request("PUT", `/parse/classes/CV/${id}`, payload);
      return id;
    }
    const created = await this.request<{ objectId: string }>("POST", "/parse/classes/CV", payload);
    return created.objectId;
  }

  // ----- Articles -----
  async listArticles(limit = 100): Promise<Json[]> {
    const resp = await this.request<{ results: Json[] }>("GET", `/parse/classes/Articles?order=-createdAt&limit=${limit}`);
    return (resp.results || []).map(mapArticle);
  }

  async upsertArticle(article: Json): Promise<string> {
    const payload = {
      title: article.title ?? "",
      url: article.url ?? "",
      summary: article.summary ?? "",
      category: article.category ?? "",
      status: article.status ?? "",
    };
    const id = typeof article.id === "string" ? article.id : "";
    if (id) {
      await this.request("PUT", `/parse/classes/Articles/${id}`, payload);
      return id;
    }
    const created = await this.request<{ objectId: string }>("POST", "/parse/classes/Articles", payload);
    return created.objectId;
  }

  async deleteArticle(id: string): Promise<void> {
    await this.request("DELETE", `/parse/classes/Articles/${id}`);
  }

  // ----- Publications / books / journals -----
  async listContent(type: ContentType, limit: number): Promise<Json[]> {
    const resp = await this.request<{ results: Json[] }>(
      "GET",
      `/parse/classes/${CONTENT_CLASS[type]}?order=-createdAt&limit=${limit}`,
    );
    return (resp.results || []).map((item) => {
      const { objectId, ...rest } = item;
      return { ...rest, id: objectId };
    });
  }

  async createContent(type: ContentType, item: Json): Promise<string> {
    const created = await this.request<{ objectId: string }>(
      "POST",
      `/parse/classes/${CONTENT_CLASS[type]}`,
      mutableFields(item),
    );
    return created.objectId;
  }

  async updateContent(type: ContentType, id: string, item: Json): Promise<void> {
    await this.request("PUT", `/parse/classes/${CONTENT_CLASS[type]}/${id}`, mutableFields(item));
  }

  async deleteContent(type: ContentType, id: string): Promise<void> {
    await this.request("DELETE", `/parse/classes/${CONTENT_CLASS[type]}/${id}`);
  }

  // ----- Orders -----
  async createOrder(order: Json): Promise<string> {
    const created = await this.request<{ objectId: string }>("POST", "/parse/classes/Orders", {
      name: order.name ?? "",
      email: order.email ?? "",
      company: order.company ?? "",
      service: order.service ?? "",
      budget: order.budget ?? "",
      message: order.message ?? "",
      lang: order.lang ?? "",
      status: "new",
    });
    return created.objectId;
  }

  async listOrders(limit = 50): Promise<Json[]> {
    const resp = await this.request<{ results: Json[] }>("GET", `/parse/classes/Orders?order=-createdAt&limit=${limit}`);
    return (resp.results || []).map(mapRecord);
  }

  async updateOrderStatus(id: string, status: string): Promise<void> {
    await this.request("PUT", `/parse/classes/Orders/${id}`, { status });
  }

  async deleteOrder(id: string): Promise<void> {
    await this.request("DELETE", `/parse/classes/Orders/${id}`);
  }

  // ----- Contacts -----
  async createContact(contact: Json): Promise<string> {
    const created = await this.request<{ objectId: string }>("POST", "/parse/classes/Contacts", {
      name: contact.name ?? "",
      email: contact.email ?? "",
      phone: contact.phone ?? "",
      subject: contact.subject ?? "",
      message: contact.message ?? "",
      status: "new",
    });
    return created.objectId;
  }

  async listContacts(limit = 50): Promise<Json[]> {
    const resp = await this.request<{ results: Json[] }>("GET", `/parse/classes/Contacts?order=-createdAt&limit=${limit}`);
    return (resp.results || []).map(mapRecord);
  }

  async updateContactStatus(id: string, status: string): Promise<void> {
    await this.request("PUT", `/parse/classes/Contacts/${id}`, { status });
  }

  async deleteContact(id: string): Promise<void> {
    await this.request("DELETE", `/parse/classes/Contacts/${id}`);
  }

  // ----- Users -----
  async loginUser(email: string, password: string): Promise<{ id: string; email: string; name: string; role: string; username: string }> {
    const resp = await this.request<{ objectId: string; username?: string; email?: string; role?: string }>(
      "POST",
      "/parse/login",
      { username: email, password },
    );
    const username = resp.username || "";
    return {
      id: resp.objectId,
      email: resp.email || "",
      name: username || resp.email || "",
      role: resp.role || "",
      username,
    };
  }

  async registerUser(fullName: string, email: string, password: string): Promise<{ id: string; email: string; name: string; role: string; username: string }> {
    const resp = await this.request<{ objectId: string; username?: string; email?: string; fullName?: string; role?: string }>(
      "POST",
      "/parse/users",
      { username: email, email, password, fullName, role: "user" },
    );
    const username = resp.username || email;
    return {
      id: resp.objectId,
      email: resp.email || email,
      name: resp.fullName || fullName || username,
      role: resp.role || "user",
      username,
    };
  }

  async ensureAdminExists(email: string, password: string): Promise<void> {
    const where = encodeURIComponent(JSON.stringify({ email }));
    const existing = await this.request<{ results: unknown[] }>("GET", `/parse/classes/_User?where=${where}&limit=1`);
    if (existing.results?.length) return;
    await this.request("POST", "/parse/users", { username: email, email, password, role: "admin" });
  }
}

// Strip Parse metadata and keep client-facing fields.
function mutableFields(item: Json): Json {
  const out: Json = {};
  for (const [key, value] of Object.entries(item)) {
    if (["objectId", "id", "createdAt", "updatedAt", "ACL"].includes(key)) continue;
    out[key] = value;
  }
  return out;
}

function mapRecord(record: Json): Json {
  const { objectId, ...rest } = record;
  return { ...rest, id: objectId };
}

function mapArticle(record: Json): Json {
  const { objectId, ...rest } = record;
  return {
    id: objectId,
    title: rest.title ?? "",
    url: rest.url ?? "",
    summary: rest.summary ?? "",
    category: rest.category ?? "",
    status: rest.status ?? "",
    publishedAt: rest.publishedAt ?? "",
    createdAt: rest.createdAt ?? "",
    updatedAt: rest.updatedAt ?? "",
  };
}
