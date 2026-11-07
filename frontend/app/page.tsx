"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { 
  ClipboardList, 
  Layers, 
  Search, 
  Printer, 
  ArrowRight, 
  ShoppingCart, 
  FileText,
  X
} from "lucide-react";
import { useTranslation } from "./context";

interface SearchResult {
  id: number;
  title: string;
  type: string;
  url: string;
}

export default function Home() {
  const { t, lang } = useTranslation();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  useEffect(() => {
    if (searchQuery.trim().length === 0) {
      setSearchResults([]);
      return;
    }

    const query = searchQuery.toLowerCase();
    
    // Mock data - in production, this would fetch from an API
    const mockArticles = [
      { id: 1, title: "Web Development Best Practices", type: "article", url: "/articles" },
      { id: 2, title: "Mobile App Design Trends", type: "article", url: "/articles" },
      { id: 3, title: "Cloud Infrastructure Guide", type: "article", url: "/articles" },
    ];

    const mockPages = [
      { id: 1, title: "Services", type: "page", url: "/services" },
      { id: 2, title: "Pricing", type: "page", url: "/pricing" },
      { id: 3, title: "Contact Us", type: "page", url: "/contact" },
      { id: 4, title: "About Us", type: "page", url: "/" },
    ];

    const results = [
      ...mockArticles.filter(a => a.title.toLowerCase().includes(query)),
      ...mockPages.filter(p => p.title.toLowerCase().includes(query))
    ];

    setSearchResults(results);
  }, [searchQuery]);

  return (
    <>
      <section style={{ position: 'relative', overflow: 'hidden', background: '#8F001A', color: '#ffffff' }}>
        {/* Geometric Angular Pattern Overlay — same as footer */}
        <svg 
          style={{ position: 'absolute', top: 0, right: 0, bottom: 0, width: '65%', height: '100%', opacity: 0.22, pointerEvents: 'none' }}
          viewBox="0 0 800 500" 
          preserveAspectRatio="xMaxYMid slice"
          fill="none"
        >
          <polygon points="150,0 800,0 800,500 300,500" fill="#ffffff" />
          <polygon points="250,0 800,0 800,350 500,500 350,250" fill="#ffffff" opacity="0.5" />
          <polygon points="500,0 800,0 800,250 600,320" fill="#ffffff" opacity="0.45" />
          <polygon points="50,250 350,50 650,250 450,500 100,450" fill="#ffffff" opacity="0.18" />
          <polygon points="450,80 800,30 800,420 550,500" fill="#ffffff" opacity="0.35" />
          <polygon points="600,0 800,0 800,180 680,220 620,100" fill="#ffffff" opacity="0.55" />
          <polygon points="300,0 550,0 500,200 280,180" fill="#ffffff" opacity="0.12" />
        </svg>

        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '60px 40px 24px 40px', position: 'relative', zIndex: 1 }}>
          {/* Top Section: Logo Left, Subtitle Right */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '32px', marginBottom: '40px' }}>
            <div>
              <Image 
                src="/BRAND891.png" 
                alt="WIPPEL" 
                width={88} 
                height={25} 
                style={{ width: 'auto', height: '25px', objectFit: 'contain' }} 
                quality={100}
              />
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '16px', fontWeight: 400, letterSpacing: '1.5px', textTransform: 'uppercase', color: 'rgba(255,255,255,0.85)', marginBottom: '4px' }}>
                WIPPEL | Digital Solutions
              </div>
              <div style={{ fontSize: '28px', fontWeight: 500, letterSpacing: '-0.5px', color: '#ffffff' }}>
                {t("home.hero.title")}
              </div>
            </div>
          </div>
          
          {/* Search Modal */}
          {isSearchOpen && (
            <div style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0,0,0,0.5)',
              zIndex: 100,
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'center',
              paddingTop: '60px'
            }}>
              <div style={{
                background: '#ffffff',
                width: '90%',
                maxWidth: '600px',
                borderRadius: 0,
                boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
                overflow: 'hidden'
              }}>
                {/* Search Input */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  background: '#8F001A',
                  padding: '16px 20px',
                  gap: '12px'
                }}>
                  <Search size={20} style={{ color: '#ffffff' }} />
                  <input
                    type="text"
                    placeholder="Search articles and pages..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    autoFocus
                    style={{
                      flex: 1,
                      background: 'transparent',
                      border: 'none',
                      color: '#ffffff',
                      outline: 'none',
                      fontSize: '16px',
                      fontWeight: 500
                    }}
                  />
                  <button
                    onClick={() => {
                      setIsSearchOpen(false);
                      setSearchQuery("");
                      setSearchResults([]);
                    }}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#ffffff',
                      cursor: 'pointer',
                      padding: 0,
                      fontSize: '24px',
                      display: 'flex',
                      alignItems: 'center'
                    }}
                  >
                    ✕
                  </button>
                </div>

                {/* Search Results */}
                {searchResults.length > 0 ? (
                  <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                    {searchResults.map((result) => (
                      <Link
                        key={`${result.type}-${result.id}`}
                        href={result.url}
                        onClick={() => {
                          setSearchQuery("");
                          setIsSearchOpen(false);
                        }}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '12px',
                          padding: '16px 20px',
                          borderBottom: '1px solid #f3f4f6',
                          textDecoration: 'none',
                          color: '#111827',
                          transition: 'background 150ms ease'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.background = '#f9fafb'}
                        onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                      >
                        <FileText size={18} style={{ color: '#8F001A', flexShrink: 0 }} />
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: '15px', fontWeight: 700, color: '#111827' }}>{result.title}</div>
                          <div style={{ fontSize: '13px', color: '#9ca3af', textTransform: 'capitalize' }}>{result.type}</div>
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : searchQuery && (
                  <div style={{ padding: '40px 20px', textAlign: 'center', color: '#9ca3af' }}>
                    {t('list.empty')}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Thin Separator Line */}
          <div style={{ height: '1px', background: 'rgba(255,255,255,0.3)', marginBottom: '20px' }} />
          
          {/* Bottom: Hero Actions */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '28px', flexWrap: 'wrap', fontSize: '14px' }}>
              <Link href="/order" style={{ color: '#ffffff', textDecoration: 'none', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '8px', transition: 'all 300ms ease', position: 'relative' }}>
                <ClipboardList className="w-4 h-4" /> {t("home.cta.primary")}
                <ArrowRight className="w-4 h-4" style={{ transform: 'rotate(-45deg)', transition: 'transform 300ms ease' }} />
              </Link>
              <Link href="/services" style={{ color: '#ffffff', textDecoration: 'none', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '8px', transition: 'all 300ms ease', position: 'relative' }}>
                <Layers className="w-4 h-4" /> {t("home.cta.secondary")}
                <ArrowRight className="w-4 h-4" style={{ transform: 'rotate(-45deg)', transition: 'transform 300ms ease' }} />
              </Link>
            </div>
            <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.7)', fontWeight: 400 }}>
              {t("home.hero.subtitle")}
            </span>
          </div>
        </div>
      </section>

      <section className="section" style={{ 
        position: 'relative', 
        overflow: 'hidden', 
        background: '#000',
        backgroundImage: 'linear-gradient(to bottom, rgba(0,0,0,0.6), rgba(0,0,0,0.8)), url("/images/WALL.png")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        padding: '120px 0'
      }}>
        {/* Deep Overlay for Depth */}
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 50% 50%, transparent 0%, rgba(0,0,0,0.5) 100%)', pointerEvents: 'none' }} />
        
        {/* Background Blur Effect behind card */}
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '80%', height: '60%', background: 'rgba(143, 0, 26, 0.1)', filter: 'blur(120px)', borderRadius: '50%', pointerEvents: 'none', opacity: 0.4 }} />

        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div className="promo-split" style={{ 
            background: 'rgba(255, 255, 255, 0.98)', 
            backdropFilter: 'blur(30px)', 
            border: '1px solid rgba(255,255,255,0.9)', 
            boxShadow: '0 40px 100px -15px rgba(0,0,0,0.12), 0 20px 40px -20px rgba(0,0,0,0.08)',
            borderRadius: '20px',
            overflow: 'hidden',
            display: 'grid',
            gridTemplateColumns: '1.2fr 0.8fr',
            alignItems: 'center',
            padding: '0'
          }}>
            <div className="promo-copy" style={{ padding: '70px 60px' }}>
              <div className="promo-kicker" style={{ fontSize: '12px', fontWeight: 900, color: '#8F001A', textTransform: 'uppercase', letterSpacing: '3px', marginBottom: '20px' }}>{t("client.eval.kicker")}</div>
              <h2 className="promo-title" style={{ fontSize: '44px', fontWeight: 900, color: '#111', lineHeight: 1.05, marginBottom: '28px', letterSpacing: '-1.5px' }}>{t("client.eval.title")}</h2>
              <p className="promo-sub" style={{ fontSize: '18px', lineHeight: 1.7, color: '#333', marginBottom: '44px', fontWeight: 500, maxWidth: '500px', opacity: 0.9 }}>
                {t("client.eval.subtitle")}
              </p>
              <div className="promo-actions">
                <Link href="/order" style={{ 
                  display: 'inline-flex', 
                  alignItems: 'center', 
                  gap: '14px',
                  background: '#111', 
                  color: '#fff', 
                  padding: '20px 44px', 
                  borderRadius: '10px', 
                  fontSize: '16px', 
                  fontWeight: 900, 
                  textDecoration: 'none',
                  transition: 'all 400ms cubic-bezier(0.23, 1, 0.32, 1)',
                  boxShadow: '0 15px 30px -5px rgba(0,0,0,0.3)',
                  border: '1px solid rgba(255,255,255,0.1)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px) scale(1.05)';
                  e.currentTarget.style.boxShadow = '0 25px 50px -10px rgba(143, 0, 26, 0.4)';
                  e.currentTarget.style.background = '#8F001A';
                  e.currentTarget.style.filter = 'brightness(1.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0) scale(1)';
                  e.currentTarget.style.boxShadow = '0 15px 30px -5px rgba(0,0,0,0.3)';
                  e.currentTarget.style.background = '#111';
                  e.currentTarget.style.filter = 'brightness(1)';
                }}>
                  <Search className="w-5 h-5" /> {t("client.eval.cta")}
                </Link>
              </div>
            </div>
            <div className="promo-media" style={{ 
              height: '100%', 
              position: 'relative', 
              background: 'linear-gradient(135deg, rgba(248, 250, 252, 0.8) 0%, rgba(241, 245, 249, 0.4) 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderLeft: '1px solid transparent',
              borderImage: 'linear-gradient(to bottom, transparent, rgba(0,0,0,0.05), transparent) 1',
              overflow: 'hidden'
            }}>
              {/* Animated Glow Effect */}
              <div style={{
                position: 'absolute',
                width: '180px',
                height: '180px',
                background: 'radial-gradient(circle, rgba(143, 0, 26, 0.15) 0%, transparent 70%)',
                filter: 'blur(40px)',
                borderRadius: '50%',
                zIndex: 0
              }} />

              <div style={{ 
                position: 'relative', 
                zIndex: 1, 
                width: '55%', 
                transition: 'all 500ms cubic-bezier(0.34, 1.56, 0.64, 1)',
                cursor: 'default'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.1) rotate(5deg)';
                e.currentTarget.style.opacity = '1';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1) rotate(0deg)';
                e.currentTarget.style.opacity = '0.8';
              }}
              >
                <Image 
                  src="/images/RIGHT1.png" 
                  alt="" 
                  width={320} 
                  height={320} 
                  style={{ 
                    width: '100%', 
                    height: 'auto',
                    filter: 'drop-shadow(0 15px 30px rgba(143, 0, 26, 0.15))',
                    opacity: 0.8,
                    transition: 'opacity 300ms ease'
                  }} 
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-head">
            <h2 className="section-title">{t("home.prices.title")}</h2>
            <p className="section-subtitle" style={{ marginTop: '8px', fontWeight: 700, color: '#059669' }}>
              <Printer className="w-4 h-4 inline mr-1" /> 3D print services available — 
              <Link href="/three-d" style={{ textDecoration: 'underline', color: '#0080ff', marginLeft: '4px' }}>
                Explore 3D services
              </Link>
            </p>
          </div>

          <div className="offer-grid">
            <div className="offer-card">
              <div className="offer-badge">{t("home.offer.badge")}</div>
              <div className="offer-name">{t("home.offer.basic.name")}</div>
              <div className="offer-price">15,000 DZD</div>
              <div className="offer-meta">{t("home.offer.basic.meta")}</div>
              <div className="offer-details">
                <div className="offer-k">{t("home.offer.desc")}</div>
                <div className="offer-v">{t("home.offer.basic.descText")}</div>
                <div className="offer-k">{t("home.offer.stack")}</div>
                <div className="offer-v">{t("home.offer.basic.stackText")}</div>
              </div>
              <div className="offer-actions">
                <Link className="offer-action" href="/pricing">
                  <ArrowRight className="w-4 h-4 mr-1" /> {t("home.offer.details")}
                </Link>
                <Link className="offer-action" href="/order">
                  <ShoppingCart className="w-4 h-4 mr-1" /> {t("home.offer.order")}
                </Link>
              </div>
            </div>

            <div className="offer-card">
              <div className="offer-badge">{t("home.offer.badge")}</div>
              <div className="offer-name">{t("home.offer.full.name")}</div>
              <div className="offer-price">25,000 DZD</div>
              <div className="offer-meta">{t("home.offer.full.meta")}</div>
              <div className="offer-details">
                <div className="offer-k">{t("home.offer.desc")}</div>
                <div className="offer-v">{t("home.offer.full.descText")}</div>
                <div className="offer-k">{t("home.offer.stack")}</div>
                <div className="offer-v">{t("home.offer.full.stackText")}</div>
              </div>
              <div className="offer-actions">
                <Link className="offer-action" href="/pricing">
                  <ArrowRight className="w-4 h-4 mr-1" /> {t("home.offer.details")}
                </Link>
                <Link className="offer-action" href="/order">
                  <ShoppingCart className="w-4 h-4 mr-1" /> {t("home.offer.order")}
                </Link>
              </div>
            </div>

            <div className="offer-card">
              <div className="offer-badge">{t("home.offer.badge")}</div>
              <div className="offer-name">{t("home.offer.adv.name")}</div>
              <div className="offer-price">40,000 DZD</div>
              <div className="offer-meta">{t("home.offer.adv.meta")}</div>
              <div className="offer-details">
                <div className="offer-k">{t("home.offer.desc")}</div>
                <div className="offer-v">{t("home.offer.adv.descText")}</div>
                <div className="offer-k">{t("home.offer.stack")}</div>
                <div className="offer-v">{t("home.offer.adv.stackText")}</div>
                <div className="offer-k" style={{ color: '#059669', fontWeight: 800 }}>{t("home.offer.offerLabel")}</div>
                <div className="offer-v" style={{ color: '#059669', fontWeight: 700 }}>{t("home.offer.adv.offerText")}</div>
              </div>
              <div className="offer-actions">
                <Link className="offer-action" href="/pricing">
                  <ArrowRight className="w-4 h-4 mr-1" /> {t("home.offer.details")}
                </Link>
                <Link className="offer-action" href="/order">
                  <ShoppingCart className="w-4 h-4 mr-1" /> {t("home.offer.order")}
                </Link>
              </div>
            </div>

            <div className="offer-card">
              <div className="offer-badge">{t("home.offer.badge")}</div>
              <div className="offer-name">{t("home.offer.saas.name")}</div>
              <div className="offer-price">110,000 DZD</div>
              <div className="offer-meta">{t("home.offer.saas.meta")}</div>
              <div className="offer-details">
                <div className="offer-k">{t("home.offer.desc")}</div>
                <div className="offer-v">{t("home.offer.saas.descText")}</div>
                <div className="offer-k">{t("home.offer.stack")}</div>
                <div className="offer-v">{t("home.offer.saas.stackText")}</div>
                <div className="offer-k" style={{ color: '#059669', fontWeight: 800 }}>{t("home.offer.offerLabel")}</div>
                <div className="offer-v" style={{ color: '#059669', fontWeight: 700 }}>{t("home.offer.saas.offerText")}</div>
              </div>
              <div className="offer-actions">
                <Link className="offer-action" href="/pricing">
                  <ArrowRight className="w-4 h-4 mr-1" /> {t("home.offer.details")}
                </Link>
                <Link className="offer-action" href="/order">
                  <ShoppingCart className="w-4 h-4 mr-1" /> {t("home.offer.order")}
                </Link>
              </div>
            </div>

            <div className="offer-card">
              <div className="offer-badge">{t("home.offer.badge")}</div>
              <div className="offer-name">{t("home.offer.pdf.name")}</div>
              <div className="offer-price">{t("home.offer.view")}</div>
              <div className="offer-meta">{t("home.offer.pdf.meta")}</div>
              <div className="offer-details">
                <div className="offer-k">{t("home.offer.pdf.k")}</div>
                <div className="offer-v">{t("home.offer.pdf.v")}</div>
              </div>
              <div className="offer-actions">
                <Link className="offer-action" href="/pricing">
                  <FileText className="w-4 h-4 mr-1" /> {t("pricing.openPdf")}
                </Link>
                <Link className="offer-action" href="/order">
                  <ShoppingCart className="w-4 h-4 mr-1" /> {t("home.offer.order")}
                </Link>
              </div>
            </div>
          </div>

          <div className="user-card">
            <div className="user-card-left">
              <div className="user-avatar">W</div>
              <div>
                <div className="user-name">WIPPEL</div>
                <div className="user-sub">Startup · Web platforms</div>
              </div>
            </div>
            <Link className="btn btn-ghost" href="/contact">
              <Mail className="w-4 h-4 mr-2" /> Contact
            </Link>
          </div>
        </div>
      </section>

      {/* Footer Section */}
      <footer style={{
        background: '#ffffff',
        borderTop: '1px solid rgba(0, 0, 0, 0.08)',
        padding: '60px 40px',
        textAlign: 'center',
        marginTop: '80px'
      }}>
        {/* Logo with tagline */}
        <div style={{
          marginBottom: '32px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '12px'
        }}>
          <Image 
            src="/BRAND891.png" 
            alt="WIPPEL" 
            width={88} 
            height={25} 
            quality={100}
          />
          <p style={{
            fontSize: '13px',
            color: 'rgba(0, 0, 0, 0.65)',
            fontWeight: 500,
            margin: 0,
            fontFamily: '"Go", "Luxi Sans Regular", "Work Sans", sans-serif',
            letterSpacing: '0.3px'
          }}>
            For the future!
          </p>
        </div>

        <p style={{
          fontSize: '14px',
          color: 'rgba(0, 0, 0, 0.7)',
          lineHeight: '1.8',
          maxWidth: '700px',
          margin: '0 auto 16px auto',
          fontFamily: '"Go", "Luxi Sans Regular", "Work Sans", sans-serif'
        }}>
          Building modern, scalable, and high-performance web platforms for startups, businesses, and digital innovators.
        </p>

        <p style={{
          fontSize: '14px',
          color: 'rgba(0, 0, 0, 0.65)',
          lineHeight: '1.8',
          maxWidth: '700px',
          margin: '0 auto',
          fontFamily: '"Go", "Luxi Sans Regular", "Work Sans", sans-serif'
        }}>
          We specialize in full-stack development using Next.js, React, Go, and cloud technologies to deliver fast, secure, and user-focused solutions.
        </p>
      </footer>
    </>
  );
}

function Mail(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="20" height="16" x="2" y="4" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  );
}
