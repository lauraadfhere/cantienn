"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { 
  Newspaper, FileText, Book, BookOpen, 
  TrendingUp, UserCircle, Inbox, 
  User, Eye, Globe, LogOut, Settings,
  LayoutDashboard, Mail,
  Search, X, MessageCircle
} from "lucide-react";

const sidebarNav = [
  { title: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { title: "Articles", href: "/admin/articles", icon: Newspaper },
  { title: "Publications", href: "/admin/publications", icon: FileText },
  { title: "Books", href: "/admin/books", icon: Book },
  { title: "Journals", href: "/admin/journals", icon: BookOpen },
  { title: "Inquiries", href: "/admin/orders", icon: Inbox },
  { title: "Contacts", href: "/admin/contacts", icon: Mail },
  { title: "Reports", href: "/admin/reports", icon: TrendingUp },
  { title: "Edit CV", href: "/admin/cv", icon: UserCircle },
  { title: "Settings", href: "/admin/settings", icon: Settings },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
  const [isAuthChecked, setIsAuthChecked] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem("auth-token")) {
      router.replace("/login");
      return;
    }
    setIsAuthChecked(true);
  }, [router]);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } finally {
      localStorage.removeItem("auth-token");
      localStorage.removeItem("user-info");
      router.replace("/login");
    }
  };

  if (!isAuthChecked) return null;

  return (
    <div className="min-h-screen flex" style={{ fontFamily: '"Go", "Luxi Sans Regular", "Work Sans", sans-serif' }}>
      {/* Left Sidebar with Logo and Icon Navigation */}
      <aside style={{ 
        width: isSidebarExpanded ? 220 : 100, 
        flexShrink: 0, 
        background: '#540017', 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        position: 'fixed', 
        top: 0, 
        left: 0, 
        bottom: 0, 
        zIndex: 40, 
        padding: '30px 0', 
        transition: 'width 300ms cubic-bezier(0.4, 0, 0.2, 1)', 
        overflowY: 'auto',
        boxShadow: '4px 0 10px rgba(0,0,0,0.2)',
        borderRight: '1px solid rgba(255,255,255,0.05)'
      }}>
        {/* Large Logo replaced with web icon */}
        <div style={{ marginBottom: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
          <Link href="/admin" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Image 
              src="/BRAND891.png" 
              alt="WIPPEL" 
              width={88} 
              height={25} 
              style={{ transition: 'all 300ms ease' }} 
              priority 
              quality={100}
            />
          </Link>
        </div>

        {/* Icon Navigation */}
        <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: isSidebarExpanded ? 'flex-start' : 'center', gap: 12, overflowY: 'auto', width: '100%', padding: '0 12px' }}>
          {sidebarNav.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                title={item.title}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: isSidebarExpanded ? 'flex-start' : 'center',
                  width: '100%',
                  height: 44,
                  padding: isSidebarExpanded ? '0 16px' : '0',
                  borderRadius: 8,
                  background: isActive ? 'rgba(255,255,255,0.12)' : 'transparent',
                  color: isActive ? '#fff' : 'rgba(255,255,255,0.7)',
                  transition: 'all 200ms ease',
                  cursor: 'pointer',
                  textDecoration: 'none',
                  gap: 12
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.18)';
                  e.currentTarget.style.color = '#fff';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = isActive ? 'rgba(255,255,255,0.12)' : 'transparent';
                  e.currentTarget.style.color = isActive ? '#fff' : 'rgba(255,255,255,0.7)';
                }}
              >
                <Icon size={20} />
                {isSidebarExpanded && <span style={{ fontSize: '13px', fontWeight: isActive ? 700 : 500 }}>{item.title}</span>}
              </Link>
            );
          })}
        </nav>

        <button
          onClick={() => setIsSidebarExpanded(!isSidebarExpanded)}
          style={{
            background: 'rgba(255,255,255,0.08)',
            border: 'none',
            color: '#fff',
            padding: '10px 0',
            cursor: 'pointer',
            fontSize: '12px',
            fontWeight: 600,
            width: 'calc(100% - 24px)',
            margin: '12px 12px 0 12px',
            borderRadius: 8,
            transition: 'all 150ms ease'
          }}
          onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.15)'}
          onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'}
        >
          {isSidebarExpanded ? 'Collapse' : 'Expand'}
        </button>

        {/* Copyright */}
        <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', textAlign: 'center', marginTop: 16 }}>
          © {new Date().getFullYear()}
        </div>
      </aside>

      {/* Center Content */}
      <div style={{ marginLeft: isSidebarExpanded ? 220 : 100, flex: 1, display: 'flex', flexDirection: 'column', minHeight: '100vh', position: 'relative', transition: 'margin-left 300ms cubic-bezier(0.4, 0, 0.2, 1)' }}>
        {/* Background Pattern */}
        <div style={{ position: 'absolute', top: 0, right: 0, bottom: 0, width: '100%', background: '#f8fafc', zIndex: 0 }}>
          <svg style={{ position: 'absolute', top: 0, right: 0, width: '60%', height: '100%', opacity: 0.1, pointerEvents: 'none' }} viewBox="0 0 800 500" preserveAspectRatio="xMaxYMid slice" fill="none">
            <polygon points="150,0 800,0 800,500 300,500" fill="#540017" />
            <polygon points="250,0 800,0 800,350 500,500 350,250" fill="#540017" opacity="0.5" />
            <polygon points="500,0 800,0 800,250 600,320" fill="#540017" opacity="0.45" />
            <polygon points="50,250 350,50 650,250 450,500 100,450" fill="#540017" opacity="0.18" />
            <polygon points="450,80 800,30 800,420 550,500" fill="#540017" opacity="0.35" />
            <polygon points="600,0 800,0 800,180 680,220 620,100" fill="#540017" opacity="0.55" />
            <polygon points="300,0 550,0 500,200 280,180" fill="#540017" opacity="0.12" />
          </svg>
        </div>

        {/* Compact Top Header */}
        <header style={{ background: '#540017', color: '#fff', height: 40, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 24px', fontSize: 13, fontWeight: 700, position: 'sticky', top: 0, zIndex: 30, fontFamily: '"Go", "Luxi Sans Regular", "Work Sans", sans-serif', letterSpacing: '0.5px' }}>
          <span style={{ fontWeight: 800, letterSpacing: 1 }}>WIPPEL ADMIN</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 20, fontWeight: 700 }}>
            {isSearchOpen ? (
              <div style={{ display: 'flex', alignItems: 'center', background: 'rgba(255,255,255,0.15)', borderRadius: 4, padding: '4px 8px', gap: 6 }}>
                <Search size={14} />
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoFocus
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: '#fff',
                    outline: 'none',
                    fontSize: '13px',
                    width: '150px'
                  }}
                />
                <button
                  onClick={() => {
                    setIsSearchOpen(false);
                    setSearchQuery("");
                  }}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#fff',
                    cursor: 'pointer',
                    padding: 0,
                    display: 'flex',
                    alignItems: 'center'
                  }}
                >
                  <X size={14} />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsSearchOpen(true)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#fff',
                  cursor: 'pointer',
                  padding: 0,
                  display: 'flex',
                  alignItems: 'center',
                  opacity: 0.9
                }}
              >
                <Search size={16} />
              </button>
            )}

            <Link href="/dashboard" style={{ color: '#fff', display: 'flex', alignItems: 'center', gap: 4, textDecoration: 'none', opacity: 0.9, fontWeight: 700 }}>
              <MessageCircle size={14} /> <span style={{ display: isSidebarExpanded ? 'inline' : 'none' }}>Client Space</span>
            </Link>

            <Link href="/admin" style={{ color: '#fff', display: 'flex', alignItems: 'center', gap: 4, textDecoration: 'none', opacity: 0.9, fontWeight: 700 }}>
              <Globe size={14} /> English
            </Link>
            <Link href="/" style={{ color: '#fff', display: 'flex', alignItems: 'center', gap: 4, textDecoration: 'none', opacity: 0.9, fontWeight: 700 }}>
              <Eye size={14} /> <span style={{ display: isSidebarExpanded ? 'inline' : 'none' }}>View Site</span>
            </Link>
            <span style={{ display: 'flex', alignItems: 'center', gap: 4, opacity: 0.9, fontWeight: 700 }}>
              <User size={14} /> admin
            </span>
            <button 
              onClick={handleLogout}
              style={{ color: '#fff', display: 'flex', alignItems: 'center', background: 'none', border: 'none', cursor: 'pointer', opacity: 0.9, padding: 0, fontWeight: 700 }}
              title="Logout"
            >
              <LogOut size={14} />
            </button>
          </div>
        </header>

        {/* Main Content Area */}
        <main style={{ flex: 1, background: 'transparent', position: 'relative', zIndex: 1, overflow: 'auto', display: 'flex', flexDirection: 'column' }}>
          {children}
        </main>
      </div>
    </div>
  );
}
