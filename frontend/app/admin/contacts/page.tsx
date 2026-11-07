"use client";

import { useState, useEffect } from "react";
import { 
  Eye, Trash2, Search, Mail, MessageSquare
} from "lucide-react";

interface Contact {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  date: string;
  status: 'new' | 'read' | 'replied';
}

export default function AdminContacts() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    setError("");
    try {
      const response = await fetch('/api/admin/contacts');
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || data.message || `Failed to load contacts (${response.status})`);
      const list = Array.isArray(data) ? data : data.items || data.data;
      if (!Array.isArray(list)) throw new Error("Contacts response did not contain a list");
        const formattedContacts = list.map((c: any) => ({
          id: c.objectId || c.id,
          name: c.name,
          email: c.email,
          subject: c.subject,
          message: c.message,
          date: c.createdAt ? new Date(c.createdAt).toLocaleDateString() : new Date().toLocaleDateString(),
          status: c.status || 'new'
        }));
        setContacts(formattedContacts);
    } catch (error) {
      console.error('Failed to fetch contacts:', error);
      setError(error instanceof Error ? error.message : "Failed to load contacts");
    }
  };

  const deleteContact = async (id: string) => {
    if (!confirm('Are you sure you want to delete this contact?')) return;
    
    try {
      setError("");
      const response = await fetch(`/api/admin/contacts/${id}`, { method: 'DELETE' });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || data.message || `Failed to delete contact (${response.status})`);
      setContacts(current => current.filter(c => c.id !== id));
      setSelectedContact(null);
    } catch (error) {
      console.error('Failed to delete contact:', error);
      setError(error instanceof Error ? error.message : "Failed to delete contact");
    }
  };

  const updateStatus = async (id: string, status: Contact['status']) => {
    try {
      setError("");
      const response = await fetch(`/api/admin/contacts/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || data.message || `Failed to update contact (${response.status})`);
      setContacts(current => current.map(c => c.id === id ? { ...c, status } : c));
      setSelectedContact(current => current?.id === id ? { ...current, status } : current);
    } catch (error) {
      console.error('Failed to update status:', error);
      setError(error instanceof Error ? error.message : "Failed to update status");
    }
  };

  const filteredContacts = contacts.filter(contact => {
    const matchesSearch = contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         contact.subject.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || contact.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  return (
    <>
      <div style={{ padding: '24px 32px 16px', borderBottom: '1px solid #e2e8f0', background: '#fff', fontFamily: '"Go", "Luxi Sans Regular", "Work Sans", sans-serif', flexShrink: 0, boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
        <h1 style={{ fontSize: 26, fontWeight: 900, color: '#1e293b', margin: 0, letterSpacing: '-0.8px' }}>Contact Messages</h1>
        <p style={{ fontSize: 13, color: '#64748b', marginTop: 4, fontWeight: 600 }}>Manage inquiries from the contact form</p>
      </div>

      <div style={{ padding: '24px 32px', fontFamily: '"Go", "Luxi Sans Regular", "Work Sans", sans-serif', flex: 1, overflow: 'auto' }}>
        {error && <div role="alert" style={{ padding: 12, marginBottom: 16, color: '#991b1b', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 7 }}>{error}</div>}
        <div style={{ display: 'flex', gap: 16, marginBottom: 24, flexWrap: 'wrap' }}>
          <div style={{ flex: 1, position: 'relative' }}>
            <Search style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', width: 18, height: 18, color: '#94a3b8' }} />
            <input
              type="text"
              placeholder="Search by name, email or subject..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ width: '100%', paddingLeft: 42, paddingRight: 16, height: 44, fontSize: 14, border: '1px solid #e2e8f0', borderRadius: 8, fontFamily: 'inherit', color: '#1e293b', outline: 'none', background: '#fff' }}
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            style={{ padding: '0 16px', height: 44, fontSize: 14, border: '1px solid #e2e8f0', borderRadius: 8, fontFamily: 'inherit', color: '#1e293b', background: '#fff', outline: 'none' }}
          >
            <option value="all">All Status</option>
            <option value="new">New</option>
            <option value="read">Read</option>
            <option value="replied">Replied</option>
          </select>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: 20 }}>
          {filteredContacts.map((contact) => (
            <div
              key={contact.id}
              style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 6, padding: 24, boxShadow: '0 10px 25px rgba(0,0,0,0.08)', display: 'flex', flexDirection: 'column', gap: 16, transition: 'all 200ms ease' }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 15px 35px rgba(0,0,0,0.12)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 10px 25px rgba(0,0,0,0.08)'; }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#1e293b', fontWeight: 900, fontSize: 16 }}>{contact.name.charAt(0)}</div>
                  <div>
                    <h3 style={{ fontSize: 16, fontWeight: 900, color: '#1e293b', margin: 0 }}>{contact.name}</h3>
                    <p style={{ fontSize: 12, color: '#64748b', margin: 0, fontWeight: 600 }}>{contact.email}</p>
                  </div>
                </div>
                <span style={{ padding: '4px 10px', fontSize: 10, fontWeight: 800, textTransform: 'uppercase', letterSpacing: 0.5, background: contact.status === 'new' ? '#fee2e2' : contact.status === 'read' ? '#fef3c7' : '#dcfce7', color: contact.status === 'new' ? '#991b1b' : contact.status === 'read' ? '#92400e' : '#166534', borderRadius: 20 }}>
                  {contact.status}
                </span>
              </div>

              <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: 16 }}>
                <h4 style={{ fontSize: 11, fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 4 }}>Subject</h4>
                <p style={{ fontSize: 14, fontWeight: 700, color: '#1e293b', margin: 0 }}>{contact.subject}</p>
              </div>

              <p style={{ fontSize: 14, color: '#475569', margin: 0, lineHeight: 1.6, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden', height: 67 }}>{contact.message}</p>

              <div style={{ display: 'flex', gap: 10, marginTop: 'auto' }}>
                <button
                  onClick={() => {
                    setSelectedContact(contact);
                    if (contact.status === 'new') updateStatus(contact.id, 'read');
                  }}
                  style={{ flex: 1, height: 40, background: '#1e293b', color: '#fff', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, transition: 'all 150ms ease' }}
                  onMouseEnter={(e) => e.currentTarget.style.background = '#334155'}
                  onMouseLeave={(e) => e.currentTarget.style.background = '#1e293b'}
                >
                  <Eye size={16} /> View Message
                </button>
                <button
                  onClick={() => deleteContact(contact.id)}
                  style={{ width: 40, height: 40, background: '#fee2e2', color: '#ef4444', border: 'none', borderRadius: 8, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 150ms ease' }}
                  onMouseEnter={(e) => e.currentTarget.style.background = '#fecaca'}
                  onMouseLeave={(e) => e.currentTarget.style.background = '#fee2e2'}
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredContacts.length === 0 && (
          <div style={{ textAlign: 'center', padding: '100px 24px', color: '#94a3b8' }}>
            <MessageSquare size={48} style={{ margin: '0 auto 16px', opacity: 0.2 }} />
            <div style={{ fontSize: 16, fontWeight: 700 }}>No messages found</div>
          </div>
        )}
      </div>

      {/* Contact Detail Modal */}
      {selectedContact && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.7)', backdropFilter: 'blur(4px)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
          <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 16, maxWidth: 650, width: '100%', maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)' }}>
            <div style={{ padding: '24px 32px', borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, background: '#fff', zIndex: 10 }}>
              <h2 style={{ fontSize: 20, fontWeight: 900, color: '#1e293b', margin: 0 }}>Message Details</h2>
              <button onClick={() => setSelectedContact(null)} style={{ background: '#f1f5f9', border: 'none', width: 32, height: 32, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#64748b' }}>×</button>
            </div>
            
            <div style={{ padding: 32, display: 'flex', flexDirection: 'column', gap: 24 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                  <div style={{ width: 56, height: 56, borderRadius: '50%', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#1e293b', fontWeight: 900, fontSize: 20 }}>{selectedContact.name.charAt(0)}</div>
                  <div>
                    <h3 style={{ fontSize: 18, fontWeight: 900, color: '#1e293b', margin: 0 }}>{selectedContact.name}</h3>
                    <p style={{ fontSize: 14, color: '#64748b', margin: '4px 0 0 0', fontWeight: 600 }}>{selectedContact.email}</p>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: 12, color: '#94a3b8', fontWeight: 700, display: 'block', marginBottom: 8 }}>Received on {selectedContact.date}</span>
                  <select
                    value={selectedContact.status}
                    onChange={(e) => updateStatus(selectedContact.id, e.target.value as Contact['status'])}
                    style={{ padding: '6px 12px', fontSize: 13, border: '1px solid #e2e8f0', borderRadius: 6, fontFamily: 'inherit', color: '#1e293b', background: '#fff' }}
                  >
                    <option value="new">New</option>
                    <option value="read">Read</option>
                    <option value="replied">Replied</option>
                  </select>
                </div>
              </div>

              <div style={{ background: '#f8fafc', padding: 24, borderRadius: 12, border: '1px solid #f1f5f9' }}>
                <h4 style={{ fontSize: 11, fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>Subject</h4>
                <p style={{ fontSize: 16, fontWeight: 800, color: '#1e293b', margin: 0 }}>{selectedContact.subject}</p>
                <div style={{ height: 1, background: '#e2e8f0', margin: '16px 0' }} />
                <h4 style={{ fontSize: 11, fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12 }}>Message Body</h4>
                <p style={{ fontSize: 15, color: '#334155', lineHeight: 1.7, fontWeight: 500, margin: 0, whiteSpace: 'pre-wrap' }}>{selectedContact.message}</p>
              </div>

              <div style={{ display: 'flex', gap: 12 }}>
                <a
                  href={`mailto:${selectedContact.email}?subject=Re: ${selectedContact.subject}`}
                  style={{ flex: 1, height: 48, background: '#1e293b', color: '#fff', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, fontSize: 14, fontWeight: 800, textDecoration: 'none', transition: 'all 150ms ease' }}
                  onMouseEnter={(e) => e.currentTarget.style.background = '#334155'}
                  onMouseLeave={(e) => e.currentTarget.style.background = '#1e293b'}
                >
                  <Mail size={18} /> Reply via Email
                </a>
                <button onClick={() => deleteContact(selectedContact.id)} style={{ padding: '0 20px', height: 48, background: '#fee2e2', color: '#ef4444', border: 'none', borderRadius: 8, fontSize: 14, fontWeight: 800, cursor: 'pointer' }}>Delete</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
