"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { 
  Eye, Trash2, Search,
  Calendar, Mail, Building, DollarSign, Package
} from "lucide-react";

interface Order {
  id: string;
  name: string;
  email: string;
  company: string;
  service: string;
  budget: string;
  message: string;
  date: string;
  status: 'new' | 'pending' | 'in_progress' | 'completed' | 'cancelled';
}

function OrdersContent() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [error, setError] = useState("");
  const searchParams = useSearchParams();

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    const orderId = searchParams.get('id');
    if (orderId && orders.length > 0) {
      const order = orders.find(o => o.id === orderId);
      if (order) setSelectedOrder(order);
    }
  }, [searchParams, orders]);

  const fetchOrders = async () => {
    setError("");
    try {
      const response = await fetch('/api/admin/orders');
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || data.message || `Failed to load orders (${response.status})`);
      const list = Array.isArray(data) ? data : data.items || data.data;
      if (!Array.isArray(list)) throw new Error("Orders response did not contain a list");
        const formattedOrders = list.map((o: any) => ({
          id: o.objectId || o.id,
          name: o.name,
          email: o.email,
          company: o.company || '',
          service: o.service,
          budget: o.budget,
          message: o.message || '',
          date: o.createdAt ? new Date(o.createdAt).toLocaleDateString() : new Date().toLocaleDateString(),
          status: o.status || 'new'
        }));
        setOrders(formattedOrders);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
      setError(error instanceof Error ? error.message : "Failed to load orders");
    }
  };

  const deleteOrder = async (id: string) => {
    if (!confirm('Are you sure you want to delete this order?')) return;
    
    try {
      setError("");
      const response = await fetch(`/api/admin/orders/${id}`, { method: 'DELETE' });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || data.message || `Failed to delete order (${response.status})`);
      setOrders(current => current.filter(o => o.id !== id));
      setSelectedOrder(null);
    } catch (error) {
      console.error('Failed to delete order:', error);
      setError(error instanceof Error ? error.message : "Failed to delete order");
    }
  };

  const updateStatus = async (id: string, status: Order['status']) => {
    try {
      setError("");
      const response = await fetch(`/api/admin/orders/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || data.message || `Failed to update order (${response.status})`);
      setOrders(current => current.map(o => o.id === id ? { ...o, status } : o));
      setSelectedOrder(current => current?.id === id ? { ...current, status } : current);
    } catch (error) {
      console.error('Failed to update status:', error);
      setError(error instanceof Error ? error.message : "Failed to update status");
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.company.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || order.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  return (
    <>
      <div style={{ padding: '24px 32px 16px', borderBottom: '1px solid #e2e8f0', background: '#fff', fontFamily: '"Go", "Luxi Sans Regular", "Work Sans", sans-serif', flexShrink: 0, boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
        <h1 style={{ fontSize: 26, fontWeight: 900, color: '#1e293b', margin: 0, letterSpacing: '-0.8px' }}>Order Management</h1>
        <p style={{ fontSize: 13, color: '#64748b', marginTop: 4, fontWeight: 600 }}>Review and respond to service inquiries</p>
      </div>

      <div style={{ padding: '24px 32px', fontFamily: '"Go", "Luxi Sans Regular", "Work Sans", sans-serif', flex: 1, overflow: 'auto' }}>
        {error && <div role="alert" style={{ padding: 12, marginBottom: 16, color: '#991b1b', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 7 }}>{error}</div>}
        <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 6, boxShadow: '0 15px 35px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
          {/* Filters */}
          <div style={{ display: 'flex', gap: 16, padding: '20px 24px', borderBottom: '1px solid #f1f5f9', background: '#f8fafc' }}>
            <div style={{ flex: 1, position: 'relative' }}>
              <Search style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', width: 18, height: 18, color: '#94a3b8' }} />
              <input
                type="text"
                placeholder="Search by name, email or company..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ width: '100%', paddingLeft: 42, paddingRight: 16, height: 44, fontSize: 14, border: '1px solid #e2e8f0', borderRadius: 8, fontFamily: 'inherit', color: '#1e293b', outline: 'none', transition: 'all 200ms ease' }}
                onFocus={(e) => e.currentTarget.style.borderColor = '#8F001A'}
                onBlur={(e) => e.currentTarget.style.borderColor = '#e2e8f0'}
              />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              style={{ padding: '0 16px', height: 44, fontSize: 14, border: '1px solid #e2e8f0', borderRadius: 8, fontFamily: 'inherit', color: '#1e293b', background: '#fff', outline: 'none', cursor: 'pointer' }}
            >
              <option value="all">All Status</option>
              <option value="new">New</option>
              <option value="pending">Pending</option>
              <option value="in_progress">In progress</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          {/* Orders Table */}
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
                  <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: 12, fontWeight: 800, color: '#475569', textTransform: 'uppercase', letterSpacing: 1.2 }}>Date</th>
                  <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: 12, fontWeight: 800, color: '#475569', textTransform: 'uppercase', letterSpacing: 1.2 }}>Client</th>
                  <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: 12, fontWeight: 800, color: '#475569', textTransform: 'uppercase', letterSpacing: 1.2 }}>Service</th>
                  <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: 12, fontWeight: 800, color: '#475569', textTransform: 'uppercase', letterSpacing: 1.2 }}>Budget</th>
                  <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: 12, fontWeight: 800, color: '#475569', textTransform: 'uppercase', letterSpacing: 1.2 }}>Status</th>
                  <th style={{ padding: '16px 24px', textAlign: 'right', fontSize: 12, fontWeight: 800, color: '#475569', textTransform: 'uppercase', letterSpacing: 1.2 }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order) => (
                  <tr key={order.id} style={{ borderBottom: '1px solid #f1f5f9', transition: 'background 150ms ease' }}
                    onMouseEnter={(e) => e.currentTarget.style.background = '#f8fafc'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                  >
                    <td style={{ padding: '20px 24px', fontSize: 14, color: '#1e293b', fontWeight: 700 }}>{order.date}</td>
                    <td style={{ padding: '20px 24px' }}>
                      <div style={{ fontSize: 15, fontWeight: 900, color: '#1e293b' }}>{order.name}</div>
                      <div style={{ fontSize: 12, color: '#64748b', fontWeight: 600 }}>{order.email}</div>
                      <div style={{ fontSize: 11, color: '#94a3b8', fontWeight: 700, marginTop: 4 }}>{order.company || 'Personal Project'}</div>
                    </td>
                    <td style={{ padding: '20px 24px', fontSize: 14, color: '#1e293b', fontWeight: 700 }}>{order.service}</td>
                    <td style={{ padding: '20px 24px', fontSize: 15, fontWeight: 900, color: '#1e293b' }}>{order.budget}</td>
                    <td style={{ padding: '20px 24px' }}>
                      <span style={{ display: 'inline-block', padding: '6px 12px', fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: 0.5, background: order.status === 'new' ? '#fee2e2' : order.status === 'pending' || order.status === 'in_progress' ? '#fef3c7' : order.status === 'cancelled' ? '#f1f5f9' : '#dcfce7', color: order.status === 'new' ? '#991b1b' : order.status === 'pending' || order.status === 'in_progress' ? '#92400e' : order.status === 'cancelled' ? '#475569' : '#166534', borderRadius: 20 }}>
                        {order.status}
                      </span>
                    </td>
                    <td style={{ padding: '20px 24px', textAlign: 'right' }}>
                      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
                        <button onClick={() => setSelectedOrder(order)} style={{ width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#8F001A', background: '#fef2f2', border: 'none', borderRadius: 8, cursor: 'pointer', transition: 'all 150ms ease' }} 
                          onMouseEnter={(e) => { e.currentTarget.style.background = '#fee2e2'; }}
                          onMouseLeave={(e) => { e.currentTarget.style.background = '#fef2f2'; }}
                          title="View Details"><Eye size={18} /></button>
                        <button onClick={() => deleteOrder(order.id)} style={{ width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ef4444', background: '#fee2e2', border: 'none', borderRadius: 8, cursor: 'pointer', transition: 'all 150ms ease' }}
                          onMouseEnter={(e) => { e.currentTarget.style.background = '#fecaca'; }}
                          onMouseLeave={(e) => { e.currentTarget.style.background = '#fee2e2'; }}
                          title="Delete"><Trash2 size={18} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredOrders.length === 0 && (
            <div style={{ textAlign: 'center', padding: '60px 24px', color: '#94a3b8' }}>
              <Package size={48} style={{ margin: '0 auto 16px', opacity: 0.2 }} />
              <div style={{ fontSize: 16, fontWeight: 700 }}>No orders found</div>
              <p style={{ fontSize: 14, marginTop: 4 }}>Try adjusting your search or filters</p>
            </div>
          )}
        </div>
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.7)', backdropFilter: 'blur(4px)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
          <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 16, maxWidth: 700, width: '100%', maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', position: 'relative' }}>
            <div style={{ padding: '24px 32px', borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, background: '#fff', zIndex: 10 }}>
              <div>
                <h2 style={{ fontSize: 20, fontWeight: 900, color: '#1e293b', margin: 0 }}>Order Details</h2>
                <p style={{ fontSize: 12, color: '#64748b', margin: '4px 0 0 0' }}>Reference ID: #{selectedOrder.id}</p>
              </div>
              <button onClick={() => setSelectedOrder(null)} style={{ background: '#f1f5f9', border: 'none', width: 32, height: 32, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#64748b', transition: 'all 150ms ease' }} onMouseEnter={(e) => e.currentTarget.style.background = '#e2e8f0'}>×</button>
            </div>
            
            <div style={{ padding: 32, display: 'flex', flexDirection: 'column', gap: 28 }}>
              <div style={{ background: '#f8fafc', padding: 20, borderRadius: 12, border: '1px solid #f1f5f9' }}>
                <label style={{ fontSize: 11, fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: 1, display: 'block', marginBottom: 12 }}>Update Order Status</label>
                <div style={{ display: 'flex', gap: 12 }}>
                  {['new', 'pending', 'in_progress', 'completed', 'cancelled'].map((s) => (
                    <button
                      key={s}
                      onClick={() => updateStatus(selectedOrder.id, s as Order['status'])}
                      style={{ flex: 1, padding: '10px', fontSize: 13, fontWeight: 700, textTransform: 'capitalize', border: '2px solid', borderRadius: 8, cursor: 'pointer', transition: 'all 200ms ease', background: selectedOrder.status === s ? '#1e293b' : '#fff', color: selectedOrder.status === s ? '#fff' : '#1e293b', borderColor: selectedOrder.status === s ? '#1e293b' : '#e2e8f0' }}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
                {[
                  { icon: UserCircle, label: 'Client Name', value: selectedOrder.name },
                  { icon: Mail, label: 'Email Address', value: selectedOrder.email },
                  { icon: Building, label: 'Company', value: selectedOrder.company || 'Personal' },
                  { icon: Calendar, label: 'Inquiry Date', value: selectedOrder.date },
                  { icon: Package, label: 'Requested Service', value: selectedOrder.service },
                  { icon: DollarSign, label: 'Estimated Budget', value: selectedOrder.budget },
                ].map((item, i) => {
                  const Icon = item.icon as any;
                  return (
                    <div key={i}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                        <Icon size={14} style={{ color: '#94a3b8' }} />
                        <label style={{ fontSize: 11, fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: 0.8 }}>{item.label}</label>
                      </div>
                      <p style={{ fontSize: 15, color: '#1e293b', fontWeight: 700, margin: 0 }}>{item.value}</p>
                    </div>
                  );
                })}
              </div>

              <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: 24 }}>
                <label style={{ fontSize: 11, fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: 0.8, display: 'block', marginBottom: 12 }}>Message from Client</label>
                <div style={{ background: '#f8fafc', padding: 20, borderRadius: 12, border: '1px solid #f1f5f9', fontSize: 15, color: '#334155', lineHeight: 1.7, fontWeight: 500, whiteSpace: 'pre-wrap' }}>
                  {selectedOrder.message}
                </div>
              </div>
            </div>

            <div style={{ padding: '24px 32px', borderTop: '1px solid #f1f5f9', display: 'flex', justifyContent: 'flex-end', background: '#f8fafc' }}>
              <button onClick={() => setSelectedOrder(null)} style={{ padding: '10px 24px', fontSize: 14, fontWeight: 800, color: '#475569', background: '#fff', border: '1px solid #e2e8f0', borderRadius: 8, cursor: 'pointer', transition: 'all 150ms ease' }} onMouseEnter={(e) => e.currentTarget.style.background = '#f1f5f9'}>Close Preview</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default function AdminOrders() {
  return (
    <Suspense fallback={<div style={{ padding: '24px 32px' }}>Loading...</div>}>
      <OrdersContent />
    </Suspense>
  );
}

function UserCircle(props: any) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
  );
}
