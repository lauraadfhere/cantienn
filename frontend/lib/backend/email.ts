// Transactional email. The Go backend used raw SMTP, which Cloudflare Workers
// cannot open. Email is sent as an HTTP POST to EMAIL_WEBHOOK_URL (for example
// a Resend/Mailgun relay or an automation endpoint). If it is not configured,
// the send is skipped and reported as not sent, without failing the request.

export interface EmailPayload {
  to: string;
  subject: string;
  text: string;
}

export function emailConfigured(): boolean {
  return Boolean(process.env.EMAIL_WEBHOOK_URL && process.env.EMAIL_ADMIN_TO);
}

export async function sendEmail(payload: EmailPayload): Promise<boolean> {
  const url = process.env.EMAIL_WEBHOOK_URL;
  if (!url) return false;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(process.env.EMAIL_WEBHOOK_TOKEN
        ? { Authorization: `Bearer ${process.env.EMAIL_WEBHOOK_TOKEN}` }
        : {}),
    },
    body: JSON.stringify({
      from: process.env.SMTP_FROM || "",
      to: payload.to,
      subject: payload.subject,
      text: payload.text,
    }),
    cache: "no-store",
  });
  if (!response.ok) throw new Error(`email webhook returned ${response.status}`);
  return true;
}

export function adminRecipient(): string {
  return process.env.EMAIL_ADMIN_TO || process.env.SMTP_ADMIN_TO || "";
}
