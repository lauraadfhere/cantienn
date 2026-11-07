"use client";

import { ShoppingCart, MessageSquare, FileText, Star, Bell, Mail, User, Search } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { useState } from "react";

export default function Dashboard() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const dashboardItems = [
    {
      icon: ShoppingCart,
      label: "Orders",
      href: "/admin/orders",
      description: "View and manage your orders"
    },
    {
      icon: MessageSquare,
      label: "Messages",
      href: "/admin/contacts",
      description: "Check your messages"
    },
    {
      icon: FileText,
      label: "Details",
      href: "/admin",
      description: "View order details"
    },
    {
      icon: Star,
      label: "Reviews",
      href: "/admin",
      description: "Manage reviews"
    }
  ];

  return (
    <div className="dashboard-page" style={{
      minHeight: '100vh',
      background: '#ffffff',
      display: 'flex',
      flexDirection: 'column',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Compact Top Bar with Logo, Search, Profile, Notification, Inbox */}
      <div style={{
        background: '#ffffff',
        borderBottom: '1px solid rgba(0, 0, 0, 0.08)',
        padding: '12px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'sticky',
        top: 0,
        zIndex: 50,
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        {/* Logo */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          flexShrink: 0
        }}>
          <Image 
            src="/images/logo2.png" 
            alt="WIPPEL" 
            width={240} 
            height={68} 
            quality={100}
          />
        </div>
        
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 'clamp(8px, 3vw, 16px)',
          flexWrap: 'nowrap'
        }}>
          {/* Search Icon */}
          <button 
            onClick={() => setIsSearchOpen(!isSearchOpen)}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              color: '#000000',
              padding: '8px',
              transition: 'all 150ms ease'
            }}
            onMouseEnter={(e) => e.currentTarget.style.opacity = '0.7'}
            onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
          >
            <Search size={18} strokeWidth={1.5} />
          </button>
          {/* Notification Icon */}
          <button style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            color: '#000000',
            padding: '8px',
            position: 'relative',
            transition: 'all 150ms ease'
          }}
          onMouseEnter={(e) => e.currentTarget.style.opacity = '0.7'}
          onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
          >
            <Bell size={18} strokeWidth={1.5} />
            <span style={{
              position: 'absolute',
              top: '6px',
              right: '6px',
              width: '5px',
              height: '5px',
              background: '#8F001A',
              borderRadius: '50%'
            }}></span>
          </button>

          {/* Inbox Icon */}
          <button style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            color: '#000000',
            padding: '8px',
            position: 'relative',
            transition: 'all 150ms ease'
          }}
          onMouseEnter={(e) => e.currentTarget.style.opacity = '0.7'}
          onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
          >
            <Mail size={18} strokeWidth={1.5} />
            <span style={{
              position: 'absolute',
              top: '6px',
              right: '6px',
              width: '5px',
              height: '5px',
              background: '#8F001A',
              borderRadius: '50%'
            }}></span>
          </button>

          {/* Profile Icon */}
          <button style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            color: '#000000',
            padding: '8px',
            transition: 'all 150ms ease'
          }}
          onMouseEnter={(e) => e.currentTarget.style.opacity = '0.7'}
          onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
          >
            <User size={18} strokeWidth={1.5} />
          </button>
        </div>
      </div>

      {/* Special Header */}
      <header style={{
        background: '#540017',
        color: '#ffffff',
        padding: '40px 24px 60px 24px',
        position: 'relative',
        zIndex: 10,
        textAlign: 'center'
      }}>
        <h1 style={{
          fontSize: '36px',
          fontWeight: 300,
          margin: '0 0 32px 0',
          letterSpacing: '0.5px',
          fontFamily: '"Go", "Luxi Sans Regular", "Work Sans", sans-serif'
        }}>
          Client Dashboard
        </h1>
        
        {/* Icon Navigation */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'flex-start',
          gap: 'clamp(40px, 8vw, 60px)',
          flexWrap: 'wrap'
        }}>
          {dashboardItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.label}
                href={item.href}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '12px',
                  textDecoration: 'none',
                  transition: 'all 200ms ease',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.opacity = '0.8';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.opacity = '1';
                }}
              >
                <Icon size={56} style={{ color: '#ffffff', strokeWidth: 1.5 }} />
                <span style={{
                  fontSize: '14px',
                  fontWeight: 300,
                  color: '#ffffff',
                  letterSpacing: '0.3px',
                  fontFamily: '"Go", "Luxi Sans Regular", "Work Sans", sans-serif'
                }}>
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </header>

      {/* Main Content - Cards with Black Borders */}
      <main style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'clamp(24px, 5vw, 60px)',
        position: 'relative',
        zIndex: 1
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(clamp(160px, 45vw, 240px), 1fr))',
          gap: 'clamp(16px, 4vw, 32px)',
          maxWidth: '1000px',
          width: '100%'
        }}>
          {dashboardItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.label}
                href={item.href}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '20px',
                  padding: '48px 32px',
                  background: '#ffffff',
                  border: '2px solid #000000',
                  borderRadius: 0,
                  cursor: 'pointer',
                  textDecoration: 'none',
                  transition: 'all 300ms ease',
                  color: '#000000'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = '0 12px 32px rgba(0, 0, 0, 0.15)';
                  e.currentTarget.style.transform = 'translateY(-6px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = 'none';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <Icon size={52} style={{ color: '#000000', strokeWidth: 1.5 }} />
                <h2 style={{
                  fontSize: '22px',
                  fontWeight: 600,
                  margin: 0,
                  textAlign: 'center',
                  fontFamily: '"Go", "Luxi Sans Regular", "Work Sans", sans-serif'
                }}>
                  {item.label}
                </h2>
                <p style={{
                  fontSize: '13px',
                  color: 'rgba(0, 0, 0, 0.65)',
                  margin: 0,
                  textAlign: 'center',
                  lineHeight: '1.5',
                  fontFamily: '"Go", "Luxi Sans Regular", "Work Sans", sans-serif'
                }}>
                  {item.description}
                </p>
              </Link>
            );
          })}
        </div>
      </main>

      {/* Footer */}
      <footer style={{
        background: '#ffffff',
        borderTop: '1px solid rgba(0, 0, 0, 0.08)',
        padding: '60px 40px',
        textAlign: 'center',
        position: 'relative',
        zIndex: 5
      }}>
        {/* Logo */}
        <div style={{
          marginBottom: '24px',
          display: 'flex',
          justifyContent: 'center'
        }}>
          <Image 
            src="/images/logo2.png" 
            alt="WIPPEL" 
            width={240} 
            height={68} 
            quality={100}
          />
        </div>

        {/* Description */}
        <p style={{
          fontSize: '14px',
          color: 'rgba(0, 0, 0, 0.7)',
          lineHeight: '1.8',
          maxWidth: '600px',
          margin: '0 auto 16px auto',
          fontFamily: '"Go", "Luxi Sans Regular", "Work Sans", sans-serif'
        }}>
          Building modern, scalable, and high-performance web platforms for startups, businesses, and digital innovators.
        </p>

        <p style={{
          fontSize: '14px',
          color: 'rgba(0, 0, 0, 0.65)',
          lineHeight: '1.8',
          maxWidth: '600px',
          margin: '0 auto 32px auto',
          fontFamily: '"Go", "Luxi Sans Regular", "Work Sans", sans-serif'
        }}>
          We specialize in full-stack development using Next.js, React, Go, and cloud technologies to deliver fast, secure, and user-focused solutions.
        </p>

        {/* Copyright */}
        <div style={{
          borderTop: '1px solid rgba(0, 0, 0, 0.08)',
          paddingTop: '24px',
          fontSize: '13px',
          color: 'rgba(0, 0, 0, 0.6)',
          fontFamily: '"Go", "Luxi Sans Regular", "Work Sans", sans-serif'
        }}>
          <p style={{ margin: '0 0 8px 0' }}>
            © 2026 Wappe. All rights reserved.
          </p>
          <p style={{ margin: 0 }}>
            Empowering digital innovation.
          </p>
        </div>
      </footer>
    </div>
  );
}
