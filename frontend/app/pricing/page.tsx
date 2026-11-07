"use client";

import Link from "next/link";
import { FileText, ExternalLink, Info, ClipboardList } from "lucide-react";
import { useTranslation } from "../context";

export default function Pricing() {
  const { t } = useTranslation();

  return (
    <>
      <section className="hero-band" style={{ paddingBottom: '24px', position: 'relative', overflow: 'hidden' }}>
        {/* Geometric Angular Pattern Overlay — white effect */}
        <svg 
          style={{ position: 'absolute', top: 0, right: 0, bottom: 0, width: '65%', height: '100%', opacity: 0.22, pointerEvents: 'none', zIndex: 0 }}
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

        <div className="container hero-band-inner text-center" style={{ position: 'relative', zIndex: 1 }}>
          <h1 className="hero-band-title" style={{ fontSize: '32px', fontWeight: 900 }}>Official Pricing & Services</h1>
          <p className="hero-band-subtitle" style={{ maxWidth: '600px', margin: '0 auto', fontSize: '16px', opacity: 0.9 }}>
            {t("pricing.subtitle")}
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container" style={{ maxWidth: '800px' }}>
          <div className="card pricing-pdf-card" style={{ padding: '48px 32px', textAlign: 'center', border: '1px solid #e5e7eb', borderRadius: '16px', background: 'white', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
            <div className="pdf-icon-wrapper" style={{ width: '80px', height: '80px', background: '#fee2e2', color: '#dc2626', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', fontSize: '32px' }}>
              <FileText size={32} />
            </div>
            
            <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#111827', marginBottom: '12px' }}>Complete Pricing Sheet</h2>
            <p style={{ color: '#4b5563', lineHeight: 1.6, marginBottom: '32px', fontSize: '16px' }}>
              For a comprehensive overview of our development packages, add-ons, and detailed service terms, please access our official pricing document. This file includes all regional pricing (DZD/USD) and project-specific notes.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', alignItems: 'center' }}>
              <a className="btn btn-primary btn-large" href="/PDF/PRICINGFULL.pdf" target="_blank" rel="noopener noreferrer" style={{ width: '100%', maxWidth: '320px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                <ExternalLink size={18} /> Open Full View PDF
              </a>
              
              <p style={{ fontSize: '13px', color: '#9ca3af', marginTop: '8px' }}>
                <Info size={14} className="inline mr-1" /> Optimized for high-resolution viewing and printing.
              </p>
            </div>
          </div>

          <div style={{ marginTop: '40px', textAlign: 'center' }}>
            <Link href="/order" className="btn btn-ghost" style={{ fontWeight: 600 }}>
              <ClipboardList className="w-4 h-4 mr-2" /> Start a Project Request
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
