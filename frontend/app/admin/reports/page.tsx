"use client";

import { useEffect, useState } from "react";
import { Loader2, Mail, Package, RefreshCw } from "lucide-react";

type RecordItem = { status?: string; createdAt?: string };

async function loadList(url: string) {
  const response = await fetch(url);
  const text = await response.text();
  let data: any;
  try { data = text ? JSON.parse(text) : {}; } catch { throw new Error(text || "Invalid server response"); }
  if (!response.ok) throw new Error(data.error || data.message || `Request failed (${response.status})`);
  const list = Array.isArray(data) ? data : data.items || data.data;
  if (!Array.isArray(list)) throw new Error("Response did not contain a list");
  return list as RecordItem[];
}

export default function Reports() {
  const [orders, setOrders] = useState<RecordItem[]>([]);
  const [contacts, setContacts] = useState<RecordItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = async () => {
    setLoading(true); setError("");
    const results = await Promise.allSettled([loadList("/api/admin/orders"), loadList("/api/admin/contacts")]);
    if (results[0].status === "fulfilled") setOrders(results[0].value);
    if (results[1].status === "fulfilled") setContacts(results[1].value);
    const failures = results.filter(result => result.status === "rejected") as PromiseRejectedResult[];
    if (failures.length) setError(failures.map(result => result.reason instanceof Error ? result.reason.message : "Request failed").join(" · "));
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const counts = (items: RecordItem[]) => items.reduce<Record<string, number>>((all, item) => {
    const status = item.status || "new"; all[status] = (all[status] || 0) + 1; return all;
  }, {});
  const cards = [
    { label: "Total inquiries", value: orders.length, icon: Package },
    { label: "Open inquiries", value: orders.filter(item => item.status !== "completed").length, icon: Package },
    { label: "Contact messages", value: contacts.length, icon: Mail },
    { label: "Unread contacts", value: contacts.filter(item => !item.status || item.status === "new").length, icon: Mail },
  ];

  return <div style={{ fontFamily: '"Go", "Work Sans", sans-serif' }}>
    <header style={{ padding: "24px 32px 16px", background: "#fff", borderBottom: "1px solid #e2e8f0", display: "flex", justifyContent: "space-between", gap: 16 }}>
      <div><h1 style={{ margin: 0, fontSize: 26, color: "#1e293b" }}>Reports</h1><p style={{ margin: "4px 0 0", color: "#64748b", fontSize: 13 }}>Live operational summary from backend records.</p></div>
      <button onClick={load} disabled={loading} style={{ alignSelf: "center", border: "1px solid #cbd5e1", background: "#fff", borderRadius: 7, padding: "9px 13px", display: "flex", gap: 7 }}><RefreshCw size={16} /> Refresh</button>
    </header>
    <main style={{ padding: "24px clamp(16px, 4vw, 32px)" }}>
      {error && <div role="alert" style={{ padding: 13, color: "#991b1b", background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 7, marginBottom: 18 }}>{error}</div>}
      {loading ? <div style={{ padding: 60, textAlign: "center" }}><Loader2 className="animate-spin" style={{ margin: "auto" }} /></div> : <>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 16 }}>
          {cards.map(({ label, value, icon: Icon }) => <div key={label} style={{ padding: 22, background: "#fff", border: "1px solid #e2e8f0", borderRadius: 8 }}><Icon size={20} color="#8F001A" /><div style={{ marginTop: 14, color: "#64748b", fontSize: 13 }}>{label}</div><strong style={{ fontSize: 30, color: "#1e293b" }}>{value}</strong></div>)}
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 16, marginTop: 20 }}>
          {[{ title: "Inquiry status", values: counts(orders) }, { title: "Contact status", values: counts(contacts) }].map(group => <section key={group.title} style={{ padding: 22, background: "#fff", border: "1px solid #e2e8f0", borderRadius: 8 }}><h2 style={{ marginTop: 0, fontSize: 17, color: "#1e293b" }}>{group.title}</h2>{Object.entries(group.values).map(([status, count]) => <div key={status} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderTop: "1px solid #f1f5f9", textTransform: "capitalize", color: "#475569" }}><span>{status}</span><strong>{count}</strong></div>)}{!Object.keys(group.values).length && <p style={{ color: "#64748b" }}>No records available.</p>}</section>)}
        </div>
      </>}
    </main>
  </div>;
}
