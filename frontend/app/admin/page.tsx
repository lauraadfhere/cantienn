"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Eye, Trash2, ClipboardList, Loader2
} from "lucide-react";

interface Order {
  id: string;
  name: string;
  email: string;
  service: string;
  budget: string;
  date: string;
  createdAt?: string;
  status: string;
}

export default function AdminDashboard() {
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [stats, setStats] = useState({
    totalInquiries: 0,
    activeProjects: 0,
    completed: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setError("");
        const response = await fetch('/api/admin/orders');
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || data.message || `Failed to load dashboard (${response.status})`);
        const list = Array.isArray(data) ? data : data.items || data.data;
        if (!Array.isArray(list)) throw new Error("Orders response did not contain a list");
          const formattedOrders = list.map((o: any) => ({
            id: o.objectId || o.id,
            name: o.name,
            email: o.email,
            service: o.service,
            budget: o.budget,
            status: o.status || 'new',
            date: o.createdAt ? new Date(o.createdAt).toLocaleDateString() : 'Unknown'
          })).slice(0, 5);

          setRecentOrders(formattedOrders);
          setStats({
            totalInquiries: list.length,
            activeProjects: list.filter((o: any) => o.status === 'new' || o.status === 'pending' || o.status === 'in_progress').length,
            completed: list.filter((o: any) => o.status === 'completed').length
          });
      } catch (err) {
        console.error("Failed to fetch dashboard data:", err);
        setError(err instanceof Error ? err.message : "Failed to load dashboard");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const deleteOrder = async (id: string) => {
    if (!confirm('Are you sure you want to delete this inquiry?')) return;
    setError("");
    try {
      const response = await fetch(`/api/admin/orders/${encodeURIComponent(id)}`, { method: 'DELETE' });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || data.message || `Failed to delete inquiry (${response.status})`);
      const deleted = recentOrders.find(order => order.id === id);
      setRecentOrders(current => current.filter(order => order.id !== id));
      setStats(current => ({
        totalInquiries: Math.max(0, current.totalInquiries - 1),
        activeProjects: deleted && (deleted.status === 'new' || deleted.status === 'pending' || deleted.status === 'in_progress') ? Math.max(0, current.activeProjects - 1) : current.activeProjects,
        completed: deleted?.status === 'completed' ? Math.max(0, current.completed - 1) : current.completed,
      }));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete inquiry");
    }
  };

  return (
    <div style={{ fontFamily: '"IBM Plex Mono", monospace' }}>
      <div style={{ padding: '24px 32px 16px', borderBottom: '1px solid #e2e8f0', background: '#fff', flexShrink: 0, boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
        <h1 style={{ fontSize: 26, fontWeight: 900, color: '#1e293b', margin: 0, letterSpacing: '-0.8px' }}>Dashboard</h1>
        <p style={{ fontSize: 13, color: '#64748b', marginTop: 4, fontWeight: 600 }}>Real-time overview of your platform operations</p>
      </div>

      <div style={{ padding: '24px 32px', flex: 1, overflow: 'auto' }}>
        {/* Quick Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 20, marginBottom: 32 }}>
          {[
              { label: 'Total Inquiries', value: stats.totalInquiries.toString() },
              { label: 'Active Projects', value: stats.activeProjects.toString() },
              { label: 'Completed', value: stats.completed.toString() },
            ].map((stat, i) => (
              <div key={i} style={{ background: '#fff', padding: 24, borderRadius: 6, border: '1px solid #e2e8f0', boxShadow: '0 10px 25px rgba(0,0,0,0.08)', transition: 'transform 200ms ease' }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
              >
              <div style={{ fontSize: 13, fontWeight: 700, color: '#64748b', marginBottom: 12 }}>{stat.label}</div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 12 }}>
                <div style={{ fontSize: 28, fontWeight: 900, color: '#1e293b' }}>{stat.value}</div>

              </div>
            </div>
          ))}
        </div>

        {error && <div role="alert" style={{ padding: 12, marginBottom: 20, color: '#991b1b', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 7 }}>{error}</div>}

        {/* Recent Inquiries */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h2 style={{ fontSize: 18, fontWeight: 900, color: '#1e293b', textTransform: 'uppercase', letterSpacing: 1.8 }}>Recent Inquiries</h2>
          <Link href="/admin/orders" style={{ fontSize: 14, color: '#8F001A', fontWeight: 900, textDecoration: 'none', borderBottom: '2px solid #8F001A', paddingBottom: 2 }}>View all</Link>
        </div>
        <div style={{ background: '#fff', border: '1px solid #e2e8f0', overflow: 'hidden', borderRadius: 6, boxShadow: '0 15px 35px rgba(0,0,0,0.1)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
                <th style={{ padding: '16px 20px', textAlign: 'left', fontSize: 12, fontWeight: 800, color: '#475569', textTransform: 'uppercase', letterSpacing: 1.2 }}>Date</th>
                <th style={{ padding: '16px 20px', textAlign: 'left', fontSize: 12, fontWeight: 800, color: '#475569', textTransform: 'uppercase', letterSpacing: 1.2 }}>Client</th>
                <th style={{ padding: '16px 20px', textAlign: 'left', fontSize: 12, fontWeight: 800, color: '#475569', textTransform: 'uppercase', letterSpacing: 1.2 }}>Service</th>
                <th style={{ padding: '16px 20px', textAlign: 'left', fontSize: 12, fontWeight: 800, color: '#475569', textTransform: 'uppercase', letterSpacing: 1.2 }}>Budget</th>
                <th style={{ padding: '16px 20px', textAlign: 'left', fontSize: 12, fontWeight: 800, color: '#475569', textTransform: 'uppercase', letterSpacing: 1.2 }}>Status</th>
                <th style={{ padding: '16px 20px', textAlign: 'right', fontSize: 12, fontWeight: 800, color: '#475569', textTransform: 'uppercase', letterSpacing: 1.2 }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={6} style={{ padding: '60px', textAlign: 'center' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
                      <Loader2 className="animate-spin" size={32} style={{ color: '#8F001A' }} />
                      <div style={{ fontSize: 14, color: '#64748b', fontWeight: 700 }}>Loading inquiries...</div>
                    </div>
                  </td>
                </tr>
              ) : recentOrders.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ padding: '60px', textAlign: 'center' }}>
                    <div style={{ fontSize: 14, color: '#64748b', fontWeight: 700 }}>No inquiries found yet.</div>
                  </td>
                </tr>
              ) : (
                recentOrders.map((order) => (
                  <tr key={order.id} style={{ borderBottom: '1px solid #f1f5f9', transition: 'background 150ms ease' }}
                    onMouseEnter={(e) => e.currentTarget.style.background = '#f8fafc'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                  >
                    <td style={{ padding: '18px 20px', fontSize: 14, color: '#1e293b', fontWeight: 700 }}>{order.date}</td>
                    <td style={{ padding: '18px 20px' }}>
                      <div style={{ fontSize: 15, fontWeight: 900, color: '#1e293b' }}>{order.name}</div>
                      <div style={{ fontSize: 12, color: '#64748b', fontWeight: 600 }}>{order.email}</div>
                    </td>
                    <td style={{ padding: '18px 20px', fontSize: 14, color: '#1e293b', fontWeight: 700 }}>{order.service}</td>
                    <td style={{ padding: '18px 20px', fontSize: 15, fontWeight: 900, color: '#1e293b' }}>{order.budget}</td>
                    <td style={{ padding: '18px 20px', fontSize: 12, fontWeight: 800, color: '#475569', textTransform: 'uppercase' }}>{order.status}</td>
                    <td style={{ padding: '18px 20px', textAlign: 'right' }}>
                      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
                        <Link href={`/admin/orders?id=${order.id}`} style={{ width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b', background: '#f1f5f9', border: 'none', borderRadius: 6, cursor: 'pointer', transition: 'all 150ms ease' }} 
                          onMouseEnter={(e) => { e.currentTarget.style.background = '#e2e8f0'; e.currentTarget.style.color = '#1e293b'; }}
                          onMouseLeave={(e) => { e.currentTarget.style.background = '#f1f5f9'; e.currentTarget.style.color = '#64748b'; }}
                          title="View"><Eye size={18} /></Link>
                        <button onClick={() => deleteOrder(order.id)} style={{ width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ef4444', background: '#fee2e2', border: 'none', borderRadius: 6, cursor: 'pointer', transition: 'all 150ms ease' }}
                          onMouseEnter={(e) => { e.currentTarget.style.background = '#fecaca'; }}
                          onMouseLeave={(e) => { e.currentTarget.style.background = '#fee2e2'; }}
                          title="Delete"><Trash2 size={18} /></button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
