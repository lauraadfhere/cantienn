// NVIDIA NIM (OpenAI-compatible) chat client. Port of backend/internal/ai/nvapi.go
// and handlers/ai.go validation rules.

export interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export function getNvapiConfig() {
  return {
    apiKey: (process.env.NVAPI_KEY || "").trim(),
    baseUrl: (process.env.NVAPI_BASE_URL || "https://integrate.api.nvidia.com/v1").replace(/\/$/, ""),
    model: process.env.NVAPI_MODEL || "qwen/qwen3-coder-480b-a35b-instruct",
  };
}

export function aiConfigured(): boolean {
  const cfg = getNvapiConfig();
  return Boolean(cfg.apiKey && cfg.baseUrl && cfg.model);
}

export async function chatCompletion(messages: ChatMessage[]): Promise<string> {
  const cfg = getNvapiConfig();
  if (!aiConfigured()) throw new Error("NVAPI is not configured");

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 60_000);
  try {
    const response = await fetch(`${cfg.baseUrl}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${cfg.apiKey}`,
      },
      body: JSON.stringify({
        model: cfg.model,
        messages,
        temperature: 0.7,
        max_tokens: 1024,
        stream: false,
      }),
      cache: "no-store",
      signal: controller.signal,
    });
    if (!response.ok) throw new Error(`NVAPI returned ${response.status}`);
    const data = (await response.json()) as { choices?: { message?: { content?: string } }[] };
    const content = data.choices?.[0]?.message?.content;
    if (!content) throw new Error("NVAPI returned no choices");
    return content;
  } finally {
    clearTimeout(timeout);
  }
}

export const CONSULTANT_SYSTEM_PROMPT = `You are ParsiAI, an intelligent project consultant for WIPPEL. Your role is to help users evaluate, refine, and perfect their project ideas before submission.

Your expertise includes:
- Technical feasibility analysis
- Budget and timeline estimation
- Technology stack recommendations
- Feature prioritization
- Risk assessment
- Best practices guidance

When analyzing project ideas:
1. Ask clarifying questions if details are missing
2. Provide specific, actionable recommendations
3. Consider both technical and business aspects
4. Suggest modern, scalable solutions
5. Be honest about potential challenges
6. Maintain a professional yet friendly tone

Keep responses concise (under 200 words) and focused on helping the user make informed decisions.`;

export function validateChatInput(
  message: unknown,
  history: unknown,
): { ok: true; message: string; history: ChatMessage[] } | { ok: false; error: string } {
  if (typeof message !== "string" || !message.trim()) return { ok: false, error: "Message is required" };
  if (message.length > 2000) return { ok: false, error: "Message is too long" };

  const items = Array.isArray(history) ? history : [];
  if (items.length > 20) return { ok: false, error: "Conversation history is too long" };

  const clean: ChatMessage[] = [];
  let total = 0;
  for (const item of items) {
    const role = (item as { role?: unknown })?.role;
    const content = (item as { content?: unknown })?.content;
    if (role !== "user" && role !== "assistant") return { ok: false, error: "History roles must be user or assistant" };
    if (typeof content !== "string" || !content.trim() || content.length > 2000) {
      return { ok: false, error: "History content is invalid" };
    }
    total += content.length;
    if (total > 8000) return { ok: false, error: "Conversation history is too long" };
    clean.push({ role, content });
  }
  return { ok: true, message: message.trim(), history: clean };
}
