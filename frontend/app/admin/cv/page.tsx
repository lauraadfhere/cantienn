"use client";

import { useEffect, useState } from "react";
import { Loader2, RefreshCw, Save } from "lucide-react";

async function parseResponse(response: Response) {
  const text = await response.text();
  try { return text ? JSON.parse(text) : {}; } catch { throw new Error(response.ok ? "Invalid JSON response" : text || "Request failed"); }
}

export default function CVEditor() {
  const [document, setDocument] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const load = async () => {
    setLoading(true); setError(""); setMessage("");
    try {
      const response = await fetch("/api/cv");
      const data = await parseResponse(response);
      if (!response.ok) throw new Error(data.error || data.message || `Unable to load CV (${response.status})`);
      setDocument(JSON.stringify(data, null, 2));
    } catch (err) { setError(err instanceof Error ? err.message : "Unable to load CV"); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const save = async () => {
    setError(""); setMessage("");
    let data: unknown;
    try { data = JSON.parse(document); } catch { return setError("CV document must be valid JSON before saving."); }
    setSaving(true);
    try {
      const response = await fetch("/api/admin/cv", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
      const result = await parseResponse(response);
      if (!response.ok) throw new Error(result.error || result.message || `Unable to save CV (${response.status})`);
      setMessage("CV saved successfully.");
    } catch (err) { setError(err instanceof Error ? err.message : "Unable to save CV"); }
    finally { setSaving(false); }
  };

  return <div style={{ fontFamily: '"Go", "Work Sans", sans-serif' }}>
    <header style={{ padding: "24px 32px 16px", background: "#fff", borderBottom: "1px solid #e2e8f0" }}><h1 style={{ margin: 0, fontSize: 26, color: "#1e293b" }}>CV Editor</h1><p style={{ margin: "4px 0 0", color: "#64748b", fontSize: 13 }}>Edit the complete CV document while preserving nested sections.</p></header>
    <main style={{ padding: "24px clamp(16px, 4vw, 32px)" }}>
      <div style={{ maxWidth: 1000, margin: "auto", background: "#fff", padding: 22, border: "1px solid #e2e8f0", borderRadius: 8 }}>
        <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 12, marginBottom: 14 }}><strong style={{ color: "#1e293b" }}>CV JSON</strong><div style={{ display: "flex", gap: 8 }}><button onClick={load} disabled={loading || saving} style={{ padding: "9px 13px", border: "1px solid #cbd5e1", background: "#fff", borderRadius: 7, display: "flex", gap: 7 }}><RefreshCw size={16} /> Reload</button><button onClick={save} disabled={loading || saving} style={{ padding: "9px 15px", border: 0, background: "#540017", color: "#fff", borderRadius: 7, display: "flex", gap: 7, fontWeight: 800 }}>{saving ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />} Save</button></div></div>
        {error && <div role="alert" style={{ padding: 12, color: "#991b1b", background: "#fef2f2", borderRadius: 6, marginBottom: 12 }}>{error}</div>}
        {message && <div role="status" style={{ padding: 12, color: "#166534", background: "#dcfce7", borderRadius: 6, marginBottom: 12 }}>{message}</div>}
        {loading ? <div style={{ padding: 70, textAlign: "center" }}><Loader2 className="animate-spin" style={{ margin: "auto" }} /></div> : <textarea value={document} onChange={event => setDocument(event.target.value)} spellCheck={false} rows={28} style={{ width: "100%", resize: "vertical", border: "1px solid #cbd5e1", borderRadius: 7, padding: 16, fontFamily: '"IBM Plex Mono", monospace', fontSize: 13, lineHeight: 1.55, color: "#1e293b" }} />}
      </div>
    </main>
  </div>;
}
