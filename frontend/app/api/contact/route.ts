import { NextRequest } from "next/server";
import { adminRecipient, emailConfigured, sendEmail } from "@/lib/backend/email";
import { errorJson, getParse, json, readJson, rateLimit, clientKey } from "@/lib/backend/http";

export const dynamic = "force-dynamic";

const MAX_FIELD = 2000;

function str(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

export async function POST(request: NextRequest) {
  if (!rateLimit(`contact:${clientKey(request)}`, 10)) return errorJson("Too many requests", 429);

  const body = await readJson<Record<string, unknown>>(request);
  if (!body) return errorJson("Invalid request body", 400);

  const contact = {
    name: str(body.name),
    email: str(body.email),
    phone: str(body.phone),
    subject: str(body.subject),
    message: str(body.message),
  };
  if (!contact.name || !contact.email.includes("@") || !contact.message) {
    return errorJson("Name, valid email and message are required", 400);
  }
  if (Object.values(contact).some((value) => value.length > MAX_FIELD)) {
    return errorJson("One or more fields are too long", 400);
  }

  const parse = getParse();
  if (!parse) return errorJson("Backend is not configured", 503);

  let id: string;
  try {
    id = await parse.createContact(contact);
  } catch (error) {
    console.error("Contact save failed:", error);
    return errorJson("Failed to save contact", 502);
  }

  if (emailConfigured()) {
    const text = Object.entries(contact).map(([k, v]) => `${k}: ${v}`).join("\n");
    try {
      await sendEmail({ to: adminRecipient(), subject: `New Contact from ${contact.name}`, text });
    } catch (error) {
      console.error("Contact email failed:", error);
    }
  }

  return json({ message: "Contact received successfully", id }, 201);
}
