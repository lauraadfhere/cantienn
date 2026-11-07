import { NextRequest } from "next/server";
import { adminRecipient, emailConfigured, sendEmail } from "@/lib/backend/email";
import { errorJson, getParse, json, readJson, rateLimit, clientKey } from "@/lib/backend/http";

export const dynamic = "force-dynamic";

const MAX_FIELD = 2000;

function str(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

export async function POST(request: NextRequest) {
  if (!rateLimit(`order:${clientKey(request)}`, 10)) return errorJson("Too many requests", 429);

  const body = await readJson<Record<string, unknown>>(request);
  if (!body) return errorJson("Invalid request body", 400);

  const order = {
    name: str(body.name),
    email: str(body.email),
    company: str(body.company),
    service: str(body.service),
    budget: str(body.budget),
    message: str(body.message),
    lang: str(body.lang),
  };
  if (!order.name || !order.email.includes("@") || !order.message) {
    return errorJson("Name, valid email and message are required", 400);
  }
  if (Object.values(order).some((value) => value.length > MAX_FIELD)) {
    return errorJson("One or more fields are too long", 400);
  }

  const parse = getParse();
  if (!parse) return errorJson("Backend is not configured", 503);

  try {
    await parse.createOrder(order);
  } catch (error) {
    console.error("Order save failed:", error);
    return errorJson("Failed to save order", 502);
  }

  // Notifications are best-effort; the order is already stored.
  if (emailConfigured()) {
    const text = Object.entries(order).map(([k, v]) => `${k}: ${v}`).join("\n");
    try {
      await sendEmail({ to: adminRecipient(), subject: `New Order from ${order.name}`, text });
      await sendEmail({
        to: order.email,
        subject: `Thank you for contacting ${process.env.SITE_NAME || "WIPPEL"}`,
        text: `Hello ${order.name},\n\nThank you for your order. We will get back to you shortly.`,
      });
    } catch (error) {
      console.error("Order email failed:", error);
    }
  }

  return json({ message: "Order received successfully" });
}
