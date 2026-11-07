"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import { Edit3, Loader2, Plus, RefreshCw, Save, Trash2, X } from "lucide-react";

type ContentItem = {
  id?: string;
  objectId?: string;
  title?: string;
  summary?: string;
  url?: string;
  category?: string;
  publishedAt?: string;
  status?: string;
};

type FormData = Required<Pick<ContentItem, "title" | "summary" | "url" | "category" | "publishedAt" | "status">>;

const emptyForm: FormData = {
  title: "",
  summary: "",
  url: "",
  category: "",
  publishedAt: "",
  status: "draft",
};

async function responseData(response: Response) {
  const text = await response.text();
  try {
    return text ? JSON.parse(text) : {};
  } catch {
    throw new Error(response.ok ? "Server returned an invalid response" : text || `Request failed (${response.status})`);
  }
}

function errorMessage(data: any, fallback: string) {
  return data?.error || data?.message || fallback;
}

export default function ContentManager({ title, endpoint }: { title: string; endpoint: string }) {
  const [items, setItems] = useState<ContentItem[]>([]);
  const [form, setForm] = useState<FormData>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const loadItems = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch(endpoint);
      const data = await responseData(response);
      if (!response.ok) throw new Error(errorMessage(data, `Unable to load ${title.toLowerCase()}`));
      const list = Array.isArray(data) ? data : data.items || data.data;
      if (!Array.isArray(list)) throw new Error("Server response did not contain a content list");
      setItems(list);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load content");
    } finally {
      setLoading(false);
    }
  }, [endpoint, title]);

  useEffect(() => { loadItems(); }, [loadItems]);

  const resetForm = () => {
    setEditingId(null);
    setForm(emptyForm);
  };

  const editItem = (item: ContentItem) => {
    setEditingId(item.objectId || item.id || null);
    setForm({
      title: item.title || "",
      summary: item.summary || "",
      url: item.url || "",
      category: item.category || "",
      publishedAt: item.publishedAt ? item.publishedAt.slice(0, 10) : "",
      status: item.status || "draft",
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const saveItem = async (event: FormEvent) => {
    event.preventDefault();
    if (!form.title.trim()) return setError("Title is required");
    setSaving(true);
    setError("");
    try {
      const response = await fetch(editingId ? `${endpoint}/${encodeURIComponent(editingId)}` : endpoint, {
        method: editingId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
                  ...form,
                  publishedAt: form.publishedAt ? `${form.publishedAt}T00:00:00Z` : undefined,
                }),
      });
      const data = await responseData(response);
      if (!response.ok) throw new Error(errorMessage(data, "Unable to save content"));
      resetForm();
      await loadItems();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to save content");
    } finally {
      setSaving(false);
    }
  };

  const deleteItem = async (item: ContentItem) => {
    const id = item.objectId || item.id;
    if (!id || !confirm(`Delete “${item.title || "this item"}”?`)) return;
    setError("");
    try {
      const response = await fetch(`${endpoint}/${encodeURIComponent(id)}`, { method: "DELETE" });
      const data = await responseData(response);
      if (!response.ok) throw new Error(errorMessage(data, "Unable to delete content"));
      setItems(current => current.filter(entry => (entry.objectId || entry.id) !== id));
      if (editingId === id) resetForm();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to delete content");
    }
  };

  const inputStyle = { width: "100%", minHeight: 42, border: "1px solid #cbd5e1", borderRadius: 7, padding: "10px 12px", color: "#1e293b", background: "#fff" };

  return (
    <div style={{ fontFamily: '"Go", "Work Sans", sans-serif' }}>
      <header style={{ padding: "24px 32px 16px", background: "#fff", borderBottom: "1px solid #e2e8f0" }}>
        <h1 style={{ margin: 0, color: "#1e293b", fontSize: 26, fontWeight: 900 }}>{title}</h1>
        <p style={{ margin: "4px 0 0", color: "#64748b", fontSize: 13 }}>Create, edit, publish, and remove content.</p>
      </header>
      <div style={{ padding: "24px clamp(16px, 4vw, 32px)", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 340px), 1fr))", gap: 24, alignItems: "start" }}>
        <form onSubmit={saveItem} style={{ background: "#fff", padding: 24, border: "1px solid #e2e8f0", borderRadius: 8, boxShadow: "0 10px 25px rgba(0,0,0,.06)", display: "grid", gap: 14 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h2 style={{ margin: 0, fontSize: 17, color: "#1e293b" }}>{editingId ? "Edit item" : "New item"}</h2>
            {editingId && <button type="button" onClick={resetForm} title="Cancel edit" style={{ border: 0, background: "transparent", cursor: "pointer" }}><X size={18} /></button>}
          </div>
          <input required placeholder="Title" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} style={inputStyle} />
          <textarea placeholder="Summary or description" value={form.summary} onChange={e => setForm({ ...form, summary: e.target.value })} rows={5} style={inputStyle} />
          <input placeholder="External URL" type="url" value={form.url} onChange={e => setForm({ ...form, url: e.target.value })} style={inputStyle} />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <input placeholder="Category" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} style={inputStyle} />
            <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })} style={inputStyle}>
              <option value="draft">Draft</option><option value="published">Published</option><option value="archived">Archived</option>
            </select>
          </div>
          <input aria-label="Publication date" type="date" value={form.publishedAt} onChange={e => setForm({ ...form, publishedAt: e.target.value })} style={inputStyle} />
          <button disabled={saving} style={{ height: 44, border: 0, borderRadius: 7, background: "#540017", color: "#fff", fontWeight: 800, cursor: saving ? "wait" : "pointer", display: "flex", gap: 8, alignItems: "center", justifyContent: "center" }}>
            {saving ? <Loader2 className="animate-spin" size={17} /> : editingId ? <Save size={17} /> : <Plus size={17} />} {editingId ? "Save changes" : "Create item"}
          </button>
        </form>

        <section style={{ minWidth: 0 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
            <h2 style={{ margin: 0, color: "#1e293b", fontSize: 17 }}>{items.length} items</h2>
            <button onClick={loadItems} disabled={loading} style={{ border: "1px solid #cbd5e1", background: "#fff", borderRadius: 7, padding: "8px 12px", cursor: "pointer", display: "flex", gap: 7, alignItems: "center" }}><RefreshCw size={15} /> Refresh</button>
          </div>
          {error && <div role="alert" style={{ background: "#fef2f2", border: "1px solid #fecaca", color: "#991b1b", borderRadius: 7, padding: 12, marginBottom: 14 }}>{error}</div>}
          {loading ? <div style={{ padding: 40, textAlign: "center", color: "#64748b" }}><Loader2 className="animate-spin" style={{ margin: "0 auto 8px" }} /> Loading…</div> : (
            <div style={{ display: "grid", gap: 12 }}>
              {items.map((item, index) => <article key={item.objectId || item.id || index} style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 8, padding: 18 }}>
                <div style={{ display: "flex", justifyContent: "space-between", gap: 16 }}>
                  <div style={{ minWidth: 0 }}>
                    <h3 style={{ margin: 0, color: "#1e293b", fontSize: 16 }}>{item.title || "Untitled"}</h3>
                    <div style={{ marginTop: 5, color: "#64748b", fontSize: 12 }}>{[item.category, item.status, item.publishedAt?.slice(0, 10)].filter(Boolean).join(" · ")}</div>
                    {item.summary && <p style={{ color: "#475569", fontSize: 13, lineHeight: 1.5, marginBottom: 0 }}>{item.summary}</p>}
                  </div>
                  <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
                    <button onClick={() => editItem(item)} title="Edit" style={{ width: 34, height: 34, border: 0, borderRadius: 6, color: "#475569", cursor: "pointer" }}><Edit3 size={16} /></button>
                    <button onClick={() => deleteItem(item)} title="Delete" style={{ width: 34, height: 34, border: 0, borderRadius: 6, color: "#dc2626", background: "#fee2e2", cursor: "pointer" }}><Trash2 size={16} /></button>
                  </div>
                </div>
              </article>)}
              {!items.length && !error && <div style={{ padding: 50, background: "#fff", border: "1px dashed #cbd5e1", borderRadius: 8, textAlign: "center", color: "#64748b" }}>No content yet.</div>}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
