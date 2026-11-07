"use client";

import { useEffect, useState } from "react";
import { Bot, Database, Loader2, RefreshCw } from "lucide-react";

type Service = { ok: boolean; status: number | null; label: string; model?: string; detail?: string };

async function check(url: string, label: string): Promise<Service> {
  try {
    const response = await fetch(url);
    const text = await response.text();
    let data: any = {};
    try { data = text ? JSON.parse(text) : {}; } catch { data = {}; }
    return {
      ok: response.ok && data.configured !== false,
      status: response.status,
      label,
      model: typeof data.model === "string" ? data.model : typeof data.data?.model === "string" ? data.data.model : undefined,
      detail: data.configured === false ? "Not configured" : typeof data.status === "string" ? data.status : typeof data.message === "string" ? data.message : response.statusText,
    };
  } catch { return { ok: false, status: null, label, detail: "Unavailable" }; }
}

export default function Settings() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const load = async () => { setLoading(true); setServices(await Promise.all([check("/api/health", "Go backend"), check("/api/ai/health", "AI service")])); setLoading(false); };
  useEffect(() => { load(); }, []);

  return <div style={{ fontFamily: '"Go", "Work Sans", sans-serif' }}>
    <header style={{ padding: "24px 32px 16px", background: "#fff", borderBottom: "1px solid #e2e8f0" }}><h1 style={{ margin: 0, fontSize: 26, color: "#1e293b" }}>Settings</h1><p style={{ margin: "4px 0 0", color: "#64748b", fontSize: 13 }}>Read-only service configuration and health overview.</p></header>
    <main style={{ padding: "24px clamp(16px, 4vw, 32px)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}><h2 style={{ margin: 0, color: "#1e293b", fontSize: 18 }}>Services</h2><button onClick={load} disabled={loading} style={{ border: "1px solid #cbd5e1", background: "#fff", borderRadius: 7, padding: "9px 13px", display: "flex", gap: 7 }}><RefreshCw size={16} /> Refresh</button></div>
      {loading ? <div style={{ padding: 60, textAlign: "center" }}><Loader2 className="animate-spin" style={{ margin: "auto" }} /></div> : <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: 16 }}>
        {services.map((service, index) => { const Icon = index ? Bot : Database; return <section key={service.label} style={{ padding: 24, background: "#fff", border: "1px solid #e2e8f0", borderRadius: 8 }}><div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}><Icon color="#8F001A" /><span style={{ padding: "5px 9px", borderRadius: 20, fontSize: 11, fontWeight: 800, color: service.ok ? "#166534" : "#991b1b", background: service.ok ? "#dcfce7" : "#fee2e2" }}>{service.ok ? "ONLINE" : "UNAVAILABLE"}</span></div><h3 style={{ color: "#1e293b", marginBottom: 8 }}>{service.label}</h3><div style={{ color: "#64748b", fontSize: 13 }}>HTTP status: {service.status ?? "No response"}</div>{service.model && <div style={{ color: "#64748b", fontSize: 13, marginTop: 5 }}>Model: <strong style={{ color: "#334155" }}>{service.model}</strong></div>}{service.detail && <div style={{ color: "#64748b", fontSize: 13, marginTop: 5 }}>State: {service.detail}</div>}</section>; })}
      </div>}
      <p style={{ color: "#64748b", fontSize: 12, marginTop: 18 }}>Secrets and API keys are intentionally not returned or displayed.</p>
    </main>
  </div>;
}
