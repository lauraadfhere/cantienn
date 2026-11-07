"use client";

import "./globals.css";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { 
  Menu, 
  X, 
  Search, 
  Linkedin, 
  Youtube, 
  MessageCircle,
  Bell,
  ChevronDown,
  Cookie,
  User
} from "lucide-react";

import { LanguageProvider, useTranslation } from "./context";
import { Language } from "./i18n";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-scroll-behavior="smooth" style={{ backgroundColor: '#8F001A' }}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;500;600;700&family=Work+Sans:wght@400;500;600;700;800;900&family=Schibsted+Grotesk:wght@400;500;600;700;800;900&family=Open+Sans:wght@400;500;600;700;800&family=IBM+Plex+Mono:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;1,100;1,200;1,300;1,400;1,500;1,600;1,700&display=swap" rel="stylesheet" />
        <link href="https://db.onlinewebfonts.com/c/7d668c0d0c730c313019902165f9af13?family=Luxi+Sans+Regular" rel="stylesheet" />
        <link rel="icon" href="/images/FAVICONZERO.png" />
        <link rel="apple-touch-icon" href="/images/FAVICONZERO.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/images/FAVICONZERO.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/images/FAVICONZERO.png" />
      </head>
      <body>
        <LanguageProvider>
          <ClientLayout>{children}</ClientLayout>
        </LanguageProvider>
      </body>
    </html>
  );
}

function ClientLayout({ children }: { children: React.ReactNode }) {
  const { lang, setLang, t } = useTranslation();
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [showCookies, setShowCookies] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);

  useEffect(() => {
    const cookieAccepted = localStorage.getItem('cookie-accepted');
    if (!cookieAccepted) {
      setShowCookies(true);
    }

    // Check if user is logged in
    const authToken = localStorage.getItem('auth-token');
    setIsUserLoggedIn(!!authToken);

    const timer = setTimeout(() => {
      setIsFadingOut(true);
      setTimeout(() => setIsLoading(false), 1200); // Wait for the fade out to finish
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

  const changeLang = (l: Language) => {
    setLang(l);
    setIsLangMenuOpen(false);
  };

  const acceptCookies = () => {
    localStorage.setItem('cookie-accepted', 'true');
    setShowCookies(false);
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } finally {
      localStorage.removeItem('auth-token');
      localStorage.removeItem('user-info');
      setIsUserLoggedIn(false);
      setIsUserMenuOpen(false);
      window.location.href = '/login';
    }
  };

  const navLinks = [
    { key: "nav.home", href: "/" },
    { key: "nav.services", href: "/services" },
    { key: "nav.articles", href: "/articles" },
    { key: "nav.pricing", href: "/pricing" },
    { key: "nav.cv", href: "/cv" },
    { key: "parsiAI.title", href: "/parsi-ai" },
  ];

  const isRtl = lang === 'ar';
  const isAuthPage = pathname === '/login' || pathname === '/register' || pathname === '/reset-password';
  const isDashboardPage = pathname === '/dashboard';
  const isOrderPage = pathname === '/order';
  const isOrderSuccessPage = pathname === '/order/success';
  const isAdminPage = pathname.startsWith('/admin');
  const isNotFoundPage = pathname === '/not-found' || !pathname || pathname === '/404';

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMenuOpen]);

  return (
    <div lang={lang} dir={isRtl ? 'rtl' : 'ltr'} className={isRtl ? 'rtl' : ''} style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
          {isLoading && (
            <div className={`page-loader ${isFadingOut ? 'fade-out' : ''}`} style={{
              position: 'fixed',
              inset: 0,
              background: '#8F001A',
              zIndex: 1000,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 1200ms cubic-bezier(0.4, 0, 0.2, 1)',
              opacity: isFadingOut ? 0 : 1,
              pointerEvents: isFadingOut ? 'none' : 'auto',
              visibility: isFadingOut ? 'hidden' : 'visible'
            }}>
              {/* Geometric Pattern - matching home and footer */}
              <svg 
                style={{ position: 'absolute', top: 0, right: 0, bottom: 0, width: '65%', height: '100%', opacity: 0.15, pointerEvents: 'none' }}
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

              <div className="page-loader-inner" style={{ 
                textAlign: 'center',
                zIndex: 1,
                transform: isFadingOut ? 'scale(1.05) translateY(-10px)' : 'scale(1) translateY(0)',
                transition: 'transform 1200ms cubic-bezier(0.4, 0, 0.2, 1)'
              }}>
                <Image 
                  src="/WAPPILFINAL.png" 
                  alt="WIPPEL" 
                  width={200} 
                  height={50} 
                  style={{ 
                    width: 'auto', 
                    height: '23px', 
                    objectFit: 'contain',
                    animation: isFadingOut ? 'none' : 'logo-pulse 2.5s ease-in-out infinite'
                  }} 
                  priority
                  quality={100}
                />
                <div style={{
                  marginTop: '24px',
                  height: '2px',
                  width: '60px',
                  background: 'rgba(255,255,255,0.3)',
                  margin: '24px auto 0',
                  position: 'relative',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    height: '100%',
                    width: '100%',
                    background: '#ffffff',
                    animation: 'loading-line 1.5s ease-in-out infinite'
                  }} />
                </div>
              </div>
              <style jsx global>{`
                @keyframes logo-pulse {
                  0%, 100% { opacity: 0.8; transform: scale(0.98); }
                  50% { opacity: 1; transform: scale(1); }
                }
                @keyframes loading-line {
                  0% { transform: translateX(-100%); }
                  50% { transform: translateX(0); }
                  100% { transform: translateX(100%); }
                }
              `}</style>
            </div>
          )}

          {!isAuthPage && !isAdminPage && !isNotFoundPage && !isDashboardPage && !isOrderPage && !isOrderSuccessPage && (
            <header className="site-header">
              <div className="container">
                <div className="header-row">
                  <div className="header-left-group">
                    <nav className="header-nav">
                      <div className="nav-links">
                        {navLinks.map((link) => (
                          <Link 
                            key={link.key} 
                            href={link.href} 
                            className="nav-link"
                            style={{ 
                              textTransform: 'uppercase', 
                              fontFamily: '"IBM Plex Sans", sans-serif',
                              fontWeight: 700,
                              fontSize: '13px',
                              letterSpacing: '0.5px'
                            }}
                          >
                            {t(link.key)}
                          </Link>
                        ))}
                      </div>
                    </nav>
                  </div>

                  {/* Search Icon - Center */}
                  <div className="header-center" style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <div style={{ textAlign: 'center', opacity: 0.85 }}>
                      <div style={{ fontSize: '10px', fontWeight: 600, letterSpacing: '1px', textTransform: 'uppercase', color: 'rgba(255,255,255,0.7)', marginBottom: '1px' }}>
                        WIPPEL | Digital Solutions
                      </div>
                      <div style={{ fontSize: '14px', fontWeight: 700, letterSpacing: '-0.2px', color: '#ffffff' }}>
                        Empowering Digital Growth
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
                            onClick={() => setIsSearchOpen(false)}
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
                      </div>
                    </div>
                  )}

                  <div className="header-actions">
                    <button className="search-icon-btn" onClick={() => setIsSearchOpen(!isSearchOpen)} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', color: '#fff', padding: '8px' }}>
                      <Search size={20} />
                    </button>
                    {isUserLoggedIn ? (
                      <div style={{ position: 'relative' }}>
                        <button 
                          onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                          style={{
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            color: '#fff',
                            padding: '8px',
                            transition: 'all 150ms ease'
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.opacity = '0.7'}
                          onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
                        >
                          <User size={20} />
                          <ChevronDown size={14} style={{ marginLeft: '4px' }} />
                        </button>
                        
                        {isUserMenuOpen && (
                          <div style={{
                            position: 'absolute',
                            top: '100%',
                            right: 0,
                            marginTop: '8px',
                            background: '#ffffff',
                            borderRadius: '8px',
                            boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                            minWidth: '180px',
                            zIndex: 110,
                            overflow: 'hidden',
                            border: '1px solid rgba(0,0,0,0.05)'
                          }}>
                            <Link 
                              href="/dashboard" 
                              onClick={() => setIsUserMenuOpen(false)}
                              style={{
                                display: 'block',
                                padding: '12px 16px',
                                color: '#374151',
                                fontSize: '14px',
                                fontWeight: 500,
                                textDecoration: 'none',
                                transition: 'background 150ms ease'
                              }}
                              onMouseEnter={(e) => e.currentTarget.style.background = '#f9fafb'}
                              onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                            >
                              Dashboard
                            </Link>
                            <Link 
                              href="/admin" 
                              onClick={() => setIsUserMenuOpen(false)}
                              style={{
                                display: 'block',
                                padding: '12px 16px',
                                color: '#374151',
                                fontSize: '14px',
                                fontWeight: 500,
                                textDecoration: 'none',
                                borderTop: '1px solid #f3f4f6'
                              }}
                              onMouseEnter={(e) => e.currentTarget.style.background = '#f9fafb'}
                              onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                            >
                              Admin Panel
                            </Link>
                            <button 
                              onClick={handleLogout}
                              style={{
                                display: 'block',
                                width: '100%',
                                textAlign: 'left',
                                padding: '12px 16px',
                                color: '#dc2626',
                                fontSize: '14px',
                                fontWeight: 600,
                                background: 'none',
                                border: 'none',
                                borderTop: '1px solid #f3f4f6',
                                cursor: 'pointer',
                                transition: 'background 150ms ease'
                              }}
                              onMouseEnter={(e) => e.currentTarget.style.background = '#fef2f2'}
                              onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                            >
                              Log Out
                            </button>
                          </div>
                        )}
                      </div>
                    ) : (
                      <>
                        <Link 
                          href="/login" 
                          className="header-login"
                          style={{ 
                            textTransform: 'uppercase', 
                            fontFamily: '"IBM Plex Sans", sans-serif',
                            fontWeight: 700,
                            fontSize: '13px',
                            letterSpacing: '0.5px'
                          }}
                        >
                          {t('auth.login')}
                        </Link>

                        <Link href="/order" className="btn btn-cta">
                          {t('home.cta.primary')}
                        </Link>
                      </>
                    )}

                    {/* Social Icons */}
                    <div className="header-social">
                      <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="social-icon">
                        <Linkedin size={18} />
                      </a>
                      <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="social-icon">
                        <Youtube size={18} />
                      </a>
                    </div>

                    <div className="lang">
                      <button className="lang-btn" onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}>
                        <Image 
                          src="/images/EARTH.png" 
                          alt={lang} 
                          width={16} 
                          height={16} 
                          className="lang-icon"
                          style={{ filter: 'brightness(0) invert(1)' }}
                        />
                        <span className="lang-code" style={{ color: '#fff' }}>{lang.toUpperCase()}</span>
                        <ChevronDown size={14} color="#fff" />
                      </button>
                      
                      {isLangMenuOpen && (
                        <div className="lang-menu">
                          <button className="lang-item w-full" onClick={() => changeLang('en')}>
                            {t('lang.english')}
                          </button>
                          <button className="lang-item w-full" onClick={() => changeLang('fr')}>
                            {t('lang.french')}
                          </button>
                          <button className="lang-item w-full" onClick={() => changeLang('ar')}>
                            {t('lang.arabic')}
                          </button>
                        </div>
                      )}
                    </div>

                    <button className="mobile-toggle" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                      {isMenuOpen ? (
                        <X size={24} color="#fff" />
                      ) : (
                        <Image 
                          src="/images/Menu.png" 
                          alt="Menu" 
                          width={28} 
                          height={28} 
                          style={{ filter: 'brightness(0) invert(1)' }}
                        />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </header>
          )}

          {isMenuOpen && (
            <div className="mobile-nav" style={{ zIndex: 10000, display: 'block' }}>
              <div className="mobile-nav-inner">
                <div style={{ padding: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                  <Image 
                    src="/BRAND891.png" 
                    alt="WIPPEL" 
                    width={88} 
                    height={25} 
                    quality={100}
                  />
                  <button 
                    onClick={() => setIsMenuOpen(false)}
                    style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', padding: '8px' }}
                  >
                    <X size={28} />
                  </button>
                </div>
                
                <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                  {navLinks.map((link) => (
                    <Link 
                      key={link.key} 
                      href={link.href} 
                      className="mobile-link" 
                      onClick={() => setIsMenuOpen(false)} 
                    >
                      {t(link.key)}
                    </Link>
                  ))}
                  
                  {!isUserLoggedIn && (
                    <Link 
                      href="/login" 
                      className="mobile-link" 
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {t('auth.login')}
                    </Link>
                  )}
                </div>

                <div style={{ padding: '32px 24px', display: 'flex', flexDirection: 'column', gap: '20px', borderTop: '1px solid rgba(255,255,255,0.1)', background: 'rgba(0,0,0,0.1)' }}>
                  <Link 
                    href="/order" 
                    className="btn btn-cta" 
                    style={{ width: '100%', textAlign: 'center', padding: '16px', fontSize: '16px' }}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {t('home.cta.primary')}
                  </Link>
                </div>
              </div>
            </div>
          )}

          <main className="main" style={{ flex: 1 }}>
            {children}
          </main>

          {/* uOttawa-Style Footer — Only on non-auth pages */}
          {!isAuthPage && !isAdminPage && (
            <footer style={{ position: 'relative', overflow: 'hidden', fontFamily: '"IBM Plex Sans", "Go", sans-serif', marginTop: 'auto' }}>
            {/* Main Footer - Black Background with Geometric Pattern */}
            <div style={{ backgroundColor: '#000000', color: '#ffffff', padding: '60px 0 24px 0', position: 'relative' }}>
              {/* Geometric Angular Pattern Overlay */}
              <svg 
                style={{ position: 'absolute', top: 0, right: 0, bottom: 0, width: '65%', height: '100%', opacity: 0.15, pointerEvents: 'none' }}
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

              <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 40px', position: 'relative', zIndex: 1 }}>
                {/* Top Section: Logo Left, Subtitle Right */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '32px', marginBottom: '40px' }}>
                  {/* Left: Large Logo */}
                  <div>
                    <Image 
                      src="/BRAND891.png" 
                      alt="WIPPEL" 
                      width={88} 
                      height={25} 
                      quality={100}
                    />
                  </div>
                  
                  {/* Right: Subtitle Text */}
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '16px', fontWeight: 400, letterSpacing: '1.5px', textTransform: 'uppercase', color: 'rgba(255,255,255,0.85)', marginBottom: '4px' }}>
                      WIPPEL | Digital Solutions
                    </div>
                    <div style={{ fontSize: '28px', fontWeight: 500, letterSpacing: '-0.5px', color: '#ffffff' }}>
                      {t('footer.since')} {new Date().getFullYear() - 1}
                    </div>
                  </div>
                </div>
                
                {/* Thin Separator Line */}
                <div style={{ height: '1px', background: 'rgba(255,255,255,0.3)', marginBottom: '20px' }} />
                
                {/* Bottom: Footer Links & Copyright */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '28px', flexWrap: 'wrap', fontSize: '14px' }}>
                    <Link href="/terms" style={{ color: '#ffffff', textDecoration: 'underline', textUnderlineOffset: '3px', fontWeight: 700 }}>{t('footer.terms')}</Link>
                    <Link href="/accessibility" style={{ color: '#ffffff', textDecoration: 'underline', textUnderlineOffset: '3px', fontWeight: 400 }}>{t('footer.accessibility')}</Link>
                    <Link href="/support" style={{ color: '#ffffff', textDecoration: 'underline', textUnderlineOffset: '3px', fontWeight: 400 }}>{t('footer.feedback')}</Link>
                  </div>
                  <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.7)', fontWeight: 400 }}>© {new Date().getFullYear()} WIPPEL. {t('footer.rights')}</span>
                </div>
              </div>
            </div>
          </footer>
          )}

          {!isAuthPage && (
            <div className="chat-widget">
              {isChatOpen && (
                <div className="chat-panel">
                  <div className="chat-panel-head">
                    <span className="chat-title">{t('chat.title')}</span>
                    <button className="chat-close" onClick={() => setIsChatOpen(false)}>
                      <X size={16} />
                    </button>
                  </div>
                  <div className="chat-panel-body">
                    <div className="chat-bubble">
                      {t('chat.welcome')}
                    </div>
                    <div className="chat-actions">
                      <Link href="/order" className="btn btn-primary btn-sm w-full">
                        {t('home.cta.primary')}
                      </Link>
                      <Link href="/contact" className="btn btn-ghost btn-sm w-full">
                        {t('nav.contact')}
                      </Link>
                    </div>
                  </div>
                </div>
              )}
              <button className="chat-fab" onClick={() => setIsChatOpen(!isChatOpen)}>
                <Image 
                  src="/images/CHAT.png" 
                  alt="Chat" 
                  width={28} 
                  height={28} 
                  style={{ width: '28px', height: '28px' }} 
                />
              </button>
            </div>
          )}

          {showCookies && (
            <div className="cookie-modal">
              <div className="cookie-backdrop" onClick={() => setShowCookies(false)}></div>
              <div className="cookie-dialog">
                <div className="cookie-dialog-head">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <Cookie size={40} style={{ color: '#ffffff', flexShrink: 0 }} />
                    <span className="cookie-title">{t('cookie.title')}</span>
                  </div>
                  <button className="cookie-x" onClick={() => setShowCookies(false)}>
                    <X size={20} />
                  </button>
                </div>
                <div className="cookie-dialog-body">
                  <p className="cookie-p">{t('cookie.p1')}</p>
                  <p className="cookie-p">{t('cookie.p2')}</p>
                  <div className="cookie-links">
                    <Link href="/cookies" className="cookie-link">{t('cookie.link.cookies')}</Link>
                    <Link href="/privacy" className="cookie-link">{t('cookie.link.privacy')}</Link>
                  </div>
                </div>
                <div className="cookie-dialog-actions">
                  <button className="btn btn-primary" onClick={acceptCookies}>
                    {t('cookie.btn.accept')}
                  </button>
                  <button className="btn btn-ghost" onClick={acceptCookies}>
                    {t('cookie.btn.necessary')}
                  </button>
                </div>
              </div>
            </div>
          )}
    </div>
  );
}
