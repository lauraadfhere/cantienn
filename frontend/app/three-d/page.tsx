"use client";

import Link from "next/link";
import { 
  ClipboardList, 
  Mail, 
  Award, 
  ShoppingCart, 
  Layers,
  FileText
} from "lucide-react";
import { useTranslation } from "../context";

export default function ThreeD() {
  const { t } = useTranslation();

  return (
    <>
      <section className="hero-band" style={{ position: 'relative', overflow: 'hidden' }}>
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
          <h1 className="hero-band-title font-black text-4xl mb-4">{t("threeD.title")}</h1>
          <p className="hero-band-subtitle font-bold mb-8">{t("threeD.subtitle")}</p>
          <div className="hero-band-actions justify-center">
            <Link className="btn btn-primary" href="/order">
              <ClipboardList className="w-4 h-4 mr-2" /> {t("home.cta.primary")}
            </Link>
            <Link className="btn btn-ghost" href="/contact">
              <Mail className="w-4 h-4 mr-2" /> {t("contact.title")}
            </Link>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-head mb-10">
            <h2 className="section-title text-2xl font-black mb-2">{t("threeD.packages.title")}</h2>
            <p className="section-subtitle text-gray-500 font-bold">{t("threeD.packages.subtitle")}</p>
          </div>

          <div className="pricing-grid">
            <div className="pricing-card">
              <div className="pricing-top">
                <div className="pricing-icon"><Cube className="w-5 h-5" /></div>
                <div className="pricing-name">{t("threeD.packages.basic.name")}</div>
                <div className="pricing-badge">3D</div>
              </div>
              <div className="pricing-price">
                <div>15,000 DZD</div>
                <div className="pricing-price-alt font-bold text-gray-400 text-sm mt-1">{t("threeD.packages.basic.tag")}</div>
              </div>
              <div className="pricing-sub text-gray-600 font-bold mt-4 mb-6">{t("threeD.packages.basic.sub")}</div>
              <ul className="pricing-list mb-8 space-y-2">
                <li className="flex items-center gap-2 font-bold text-sm"><span className="w-1.5 h-1.5 rounded-full bg-brand-600"></span> {t("threeD.feature.print")}</li>
                <li className="flex items-center gap-2 font-bold text-sm"><span className="w-1.5 h-1.5 rounded-full bg-brand-600"></span> {t("threeD.feature.files")}</li>
                <li className="flex items-center gap-2 font-bold text-sm"><span className="w-1.5 h-1.5 rounded-full bg-brand-600"></span> {t("threeD.feature.check")}</li>
              </ul>
              <Link className="btn btn-primary pricing-btn mt-auto" href="/order">
                <ShoppingCart className="w-4 h-4 mr-2" /> {t("order.title")}
              </Link>
            </div>

            <div className="pricing-card pricing-featured">
              <div className="pricing-top">
                <div className="pricing-icon"><Layers className="w-5 h-5" /></div>
                <div className="pricing-name">{t("threeD.packages.standard.name")}</div>
                <div className="pricing-badge pricing-badge-pop">Popular</div>
              </div>
              <div className="pricing-price">
                <div>30,000 DZD</div>
                <div className="pricing-price-alt font-bold text-gray-400 text-sm mt-1">{t("threeD.packages.standard.tag")}</div>
              </div>
              <div className="pricing-sub text-gray-600 font-bold mt-4 mb-6">{t("threeD.packages.standard.sub")}</div>
              <ul className="pricing-list mb-8 space-y-2">
                <li className="flex items-center gap-2 font-bold text-sm"><span className="w-1.5 h-1.5 rounded-full bg-brand-600"></span> {t("threeD.feature.print")}</li>
                <li className="flex items-center gap-2 font-bold text-sm"><span className="w-1.5 h-1.5 rounded-full bg-brand-600"></span> {t("threeD.feature.files")}</li>
                <li className="flex items-center gap-2 font-bold text-sm"><span className="w-1.5 h-1.5 rounded-full bg-brand-600"></span> {t("threeD.feature.iterations")}</li>
                <li className="flex items-center gap-2 font-bold text-sm"><span className="w-1.5 h-1.5 rounded-full bg-brand-600"></span> {t("threeD.feature.support")}</li>
              </ul>
              <Link className="btn btn-primary pricing-btn mt-auto" href="/order">
                <ShoppingCart className="w-4 h-4 mr-2" /> {t("order.title")}
              </Link>
            </div>

            <div className="pricing-card">
              <div className="pricing-top">
                <div className="pricing-icon"><Award className="w-5 h-5" /></div>
                <div className="pricing-name">{t("threeD.packages.premium.name")}</div>
                <div className="pricing-badge">Premium</div>
              </div>
              <div className="pricing-price">
                <div>50,000 DZD</div>
                <div className="pricing-price-alt font-bold text-gray-400 text-sm mt-1">{t("threeD.packages.premium.tag")}</div>
              </div>
              <div className="pricing-sub text-gray-600 font-bold mt-4 mb-6">{t("threeD.packages.premium.sub")}</div>
              <ul className="pricing-list mb-8 space-y-2">
                <li className="flex items-center gap-2 font-bold text-sm"><span className="w-1.5 h-1.5 rounded-full bg-brand-600"></span> {t("threeD.feature.print")}</li>
                <li className="flex items-center gap-2 font-bold text-sm"><span className="w-1.5 h-1.5 rounded-full bg-brand-600"></span> {t("threeD.feature.filesFull")}</li>
                <li className="flex items-center gap-2 font-bold text-sm"><span className="w-1.5 h-1.5 rounded-full bg-brand-600"></span> {t("threeD.feature.conception")}</li>
                <li className="flex items-center gap-2 font-bold text-sm"><span className="w-1.5 h-1.5 rounded-full bg-brand-600"></span> {t("threeD.feature.report")}</li>
              </ul>
              <Link className="btn btn-primary pricing-btn mt-auto" href="/order">
                <ShoppingCart className="w-4 h-4 mr-2" /> {t("order.title")}
              </Link>
            </div>
          </div>

          <div className="callout mt-12 p-8 bg-blue-50 border border-blue-100 rounded-2xl">
            <div className="callout-title text-xl font-black mb-2 text-blue-900">{t("threeD.note.title")}</div>
            <div className="callout-text text-blue-800 font-bold mb-6">{t("threeD.note.text")}</div>
            <div className="callout-actions">
              <Link className="btn btn-ghost" href="/services">
                <Layers className="w-4 h-4 mr-2" /> {t("nav.services")}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

function Cube(props: any) {
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
      <path d="m21.12 6.46-9-5c-.7-.39-1.55-.39-2.25 0l-9 5c-.7.39-1.12 1.12-1.12 1.93v10.08c0 .81.42 1.54 1.12 1.93l9 5c.7.39 1.55.39 2.25 0l9-5c.7-.39 1.12-1.12 1.12-1.93V8.39c0-.81-.42-1.54-1.12-1.93Z" />
      <path d="M12 22V12" />
      <path d="m3.31 7.04 8.69 4.83 8.69-4.83" />
    </svg>
  );
}
