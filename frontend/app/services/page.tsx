"use client";

import Image from "next/image";
import Link from "next/link";
import { 
  FilePen, 
  CalendarCheck, 
  Printer, 
  Leaf, 
  Rocket, 
  Building, 
  Gem, 
  Gift, 
  ShoppingCart, 
  FileText, 
  Bolt, 
  TrendingUp, 
  ShieldCheck, 
  Bot, 
  Smartphone, 
  Layers, 
  Search, 
  PencilRuler, 
  Code, 
  TestTube, 
  Headset, 
  Mail, 
  Send,
  CloudUpload,
  Bold,
  Italic,
  List
} from "lucide-react";
import { useTranslation } from "../context";
import { useState } from "react";

export default function Services() {
  const { t } = useTranslation();
  const [files, setFiles] = useState<FileList | null>(null);

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
          <h1 className="hero-band-title">{t("services.hero.title")}</h1>
          <p className="hero-band-subtitle">{t("services.hero.subtitle")}</p>
          <div className="hero-band-actions justify-center">
            <Link className="btn btn-primary" href="/contact">
              <FilePen className="w-4 h-4 mr-2" /> {t("services.quote")}
            </Link>
            <Link className="btn btn-ghost" href="/contact">
              <CalendarCheck className="w-4 h-4 mr-2" /> {t("services.book")}
            </Link>
            <Link className="btn btn-ghost" href="/parsi-ai" style={{ background: 'linear-gradient(135deg, #8F001A 0%, #C41E3A 100%)', color: 'white', border: 'none' }}>
              <Bot className="w-4 h-4 mr-2" /> {t("parsiAI.title")}
            </Link>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-head">
            <h2 className="section-title">{t("services.section.packages")}</h2>
          </div>

          <div className="services-note">
            <Printer className="w-4 h-4" />
            <em>{t("order.note3d")}</em>
            <Link className="services-note-link" href="/three-d">{t("nav.threeD")}</Link>
          </div>

          <div className="pricing-grid">
            {/* Basic Package */}
            <div className="pricing-card">
              <div className="pricing-top">
                <div className="pricing-icon"><Leaf className="w-5 h-5" /></div>
                <div className="pricing-name">{t("home.offer.basic.name")}</div>
                <div className="pricing-badge">{t("services.badge.basic")}</div>
              </div>
              <div className="pricing-price">
                <div>15,000 DZD</div>
                <div className="pricing-price-alt">{t("home.offer.basic.meta")}</div>
              </div>
              <div className="pricing-sub">{t("home.offer.basic.descText")}</div>
              <ul className="pricing-list">
                <li>{t("services.pack.basic.li1")}</li>
                <li>{t("services.pack.basic.li2")}</li>
                <li>{t("services.pack.basic.li3")}</li>
                <li>{t("services.pack.basic.li4")}</li>
                <li>{t("services.pack.basic.li5")}</li>
              </ul>
              <div className="pricing-meta">{t("services.tech")}: {t("home.offer.basic.stackText")}</div>
              <Link className="btn btn-primary pricing-btn" href="/order">
                <ShoppingCart className="w-4 h-4 mr-2" /> {t("order.title")}
              </Link>
            </div>

            {/* Full Package */}
            <div className="pricing-card pricing-featured">
              <div className="pricing-top">
                <div className="pricing-icon"><Rocket className="w-5 h-5" /></div>
                <div className="pricing-name">{t("home.offer.full.name")}</div>
                <div className="pricing-badge pricing-badge-pop">{t("services.badge.popular")}</div>
              </div>
              <div className="pricing-price">
                <div>25,000 DZD</div>
                <div className="pricing-price-alt">{t("home.offer.full.meta")}</div>
              </div>
              <div className="pricing-sub">{t("home.offer.full.descText")}</div>
              <ul className="pricing-list">
                <li>{t("services.pack.full.li1")}</li>
                <li>{t("services.pack.full.li2")}</li>
                <li>{t("services.pack.full.li3")}</li>
                <li>{t("services.pack.full.li4")}</li>
              </ul>
              <div className="pricing-meta">{t("services.tech")}: {t("home.offer.full.stackText")}</div>
              <Link className="btn btn-primary pricing-btn" href="/order">
                <ShoppingCart className="w-4 h-4 mr-2" /> {t("order.title")}
              </Link>
            </div>

            {/* Advanced Package */}
            <div className="pricing-card">
              <div className="pricing-top">
                <div className="pricing-icon"><Building className="w-5 h-5" /></div>
                <div className="pricing-name">{t("home.offer.adv.name")}</div>
                <div className="pricing-badge">{t("services.badge.platform")}</div>
              </div>
              <div className="pricing-price">
                <div>40,000 DZD</div>
                <div className="pricing-price-alt">{t("home.offer.adv.meta")}</div>
              </div>
              <div className="pricing-sub">{t("home.offer.adv.descText")}</div>
              <ul className="pricing-list">
                <li>{t("services.pack.adv.li1")}</li>
                <li>{t("services.pack.adv.li2")}</li>
                <li>{t("services.pack.adv.li3")}</li>
                <li>{t("services.pack.adv.li4")}</li>
                <li style={{ color: '#059669', fontWeight: 800, borderTop: '1px dashed #bbf7d0', paddingTop: '10px', marginTop: '10px' }}>
                  <Gift className="w-4 h-4 inline mr-1" /> {t("home.offer.offerLabel")}: {t("home.offer.adv.offerText")}
                </li>
              </ul>
              <div className="pricing-meta">{t("services.tech")}: {t("home.offer.adv.stackText")}</div>
              <Link className="btn btn-primary pricing-btn" href="/order">
                <ShoppingCart className="w-4 h-4 mr-2" /> {t("order.title")}
              </Link>
            </div>

            {/* SaaS Package */}
            <div className="pricing-card">
              <div className="pricing-top">
                <div className="pricing-icon"><Gem className="w-5 h-5" /></div>
                <div className="pricing-name">{t("home.offer.saas.name")}</div>
                <div className="pricing-badge">{t("services.badge.saas")}</div>
              </div>
              <div className="pricing-price">
                <div>110,000 DZD</div>
                <div className="pricing-price-alt">{t("home.offer.saas.meta")}</div>
              </div>
              <div className="pricing-sub">{t("home.offer.saas.descText")}</div>
              <ul className="pricing-list">
                <li>{t("services.pack.saas.li1")}</li>
                <li>{t("services.pack.saas.li2")}</li>
                <li>{t("services.pack.saas.li3")}</li>
                <li>{t("services.pack.saas.li4")}</li>
                <li style={{ color: '#059669', fontWeight: 800, borderTop: '1px dashed #bbf7d0', paddingTop: '10px', marginTop: '10px' }}>
                  <Gift className="w-4 h-4 inline mr-1" /> {t("home.offer.offerLabel")}: {t("home.offer.saas.offerText")}
                </li>
              </ul>
              <div className="pricing-meta">{t("services.tech")}: {t("home.offer.saas.stackText")}</div>
              <Link className="btn btn-primary pricing-btn" href="/order">
                <ShoppingCart className="w-4 h-4 mr-2" /> {t("order.title")}
              </Link>
            </div>
          </div>

          <div className="callout" style={{ marginTop: '18px' }}>
            <div className="callout-title">{t("services.fullPricing.title")}</div>
            <div className="callout-text">{t("services.fullPricing.text")}</div>
            <div className="callout-actions">
              <Link className="btn btn-ghost" href="/pricing">
                <FileText className="w-4 h-4 mr-2" /> {t("pricing.openPdf")}
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="section section-muted">
        <div className="container">
          <div className="section-head">
            <h2 className="section-title">{t("services.section.addons")}</h2>
          </div>

          <div className="addon-grid">
            <AddonCard name={t("services.addon.extra")} price="$30 – $80" priceAlt="4,000 – 10,000 DZD" />
            <AddonCard name={t("services.addon.seo")} price="$100 – $300" priceAlt="13,000 – 40,000 DZD" />
            <AddonCard name={t("services.addon.ai")} price="$150 – $500" priceAlt="20,000 – 65,000 DZD" />
            <AddonCard name={t("services.addon.admin")} price="$200 – $600" priceAlt="25,000 – 80,000 DZD" />
            <AddonCard name={t("services.addon.ecommerce")} price="$300 – $800" priceAlt="40,000 – 100,000 DZD" />
            <AddonCard name={t("services.addon.maint")} price="$50 – $150/month" priceAlt="7,000 – 20,000 DZD / month" />
            <AddonCard name={t("services.addon.perf")} price="$100" priceAlt="13,000 DZD" />
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-head">
            <h2 className="section-title">{t("services.section.why")}</h2>
          </div>

          <div className="feature-grid">
            <FeatureCard icon={<Bolt className="w-5 h-5" />} title={t("services.feature.speed")} sub={t("services.feature.speedSub")} />
            <FeatureCard icon={<TrendingUp className="w-5 h-5" />} title={t("services.feature.conv")} sub={t("services.feature.convSub")} />
            <FeatureCard icon={<ShieldCheck className="w-5 h-5" />} title={t("services.feature.secure")} sub={t("services.feature.secureSub")} />
            <FeatureCard icon={<Bot className="w-5 h-5" />} title={t("services.feature.ai")} sub={t("services.feature.aiSub")} />
            <FeatureCard icon={<Smartphone className="w-5 h-5" />} title={t("services.feature.resp")} sub={t("services.feature.respSub")} />
            <FeatureCard icon={<Layers className="w-5 h-5" />} title={t("services.feature.stack")} sub={t("services.feature.stackSub")} />
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-head">
            <h2 className="section-title">{t("services.section.workflow")}</h2>
          </div>

          <div className="workflow-grid">
            <WorkflowStep icon={<Search className="w-5 h-5" />} title={t("services.workflow.step1")} sub={t("services.workflow.step1Sub")} />
            <WorkflowStep icon={<PencilRuler className="w-5 h-5" />} title={t("services.workflow.step2")} sub={t("services.workflow.step2Sub")} />
            <WorkflowStep icon={<Code className="w-5 h-5" />} title={t("services.workflow.step3")} sub={t("services.workflow.step3Sub")} />
            <WorkflowStep icon={<TestTube className="w-5 h-5" />} title={t("services.workflow.step4")} sub={t("services.workflow.step4Sub")} />
            <WorkflowStep icon={<Headset className="w-5 h-5" />} title={t("services.workflow.step5")} sub={t("services.workflow.step5Sub")} />
          </div>

          <div className="callout">
            <div className="callout-title">{t("services.positioning.title")}</div>
            <div className="callout-text">{t("services.positioning.text1")}</div>
            <div className="callout-text">{t("services.positioning.text2")}</div>
            <div className="callout-actions">
              <Link className="btn btn-primary" href="/contact">
                <Mail className="w-4 h-4 mr-2" /> {t("nav.contact")}
              </Link>
            </div>
          </div>

          <div className="section-head" style={{ marginTop: '60px' }}>
            <h2 className="section-title">{t("services.section.ready")}</h2>
            <p className="section-subtitle">{t("order.subtitle")}</p>
          </div>

          <div className="card" style={{ maxWidth: '800px', margin: '0 auto' }}>
            <div className="card-body">
              <form className="form">
                <div className="form-group" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                  <div className="form-row">
                    <label className="form-label" htmlFor="services-name">{t("order.name")}</label>
                    <input className="form-input" id="services-name" name="name" placeholder="John Doe" required />
                  </div>
                  <div className="form-row">
                    <label className="form-label" htmlFor="services-email">{t("order.email")}</label>
                    <input className="form-input" id="services-email" name="email" type="email" placeholder="john@example.com" required />
                  </div>
                </div>
                <div className="form-row">
                  <label className="form-label" htmlFor="services-files">{t("order.files")}</label>
                  <div className="file-upload-container" style={{ border: '2px dashed #000000', padding: '20px', textAlign: 'center', cursor: 'pointer' }} onClick={() => document.getElementById('services-files')?.click()}>
                    <input type="file" id="services-files" name="attachments" multiple accept=".pdf,.doc,.docx,image/*" className="hidden" onChange={(e) => setFiles(e.target.files)} />
                    <CloudUpload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                    <span>{t("order.filesPlaceholder")}</span>
                    <small className="block text-gray-400 mt-1">Max file size: 10MB</small>
                    {files && files.length > 0 && (
                      <div className="mt-2 font-bold text-brand-600">
                        {files.length} file(s) selected
                      </div>
                    )}
                  </div>
                </div>
                <div className="form-row">
                  <label className="form-label" htmlFor="services-message">{t("order.message")}</label>
                  <div className="rich-editor-container">
                    <textarea className="form-input" id="services-message" name="message" rows={8} placeholder={t("order.messagePlaceholder")}></textarea>
                    <div className="editor-toolbar flex gap-2 p-2 border-t bg-gray-50">
                      <button type="button" title="Bold" className="p-1 hover:bg-gray-200 rounded"><Bold size={16} /></button>
                      <button type="button" title="Italic" className="p-1 hover:bg-gray-200 rounded"><Italic size={16} /></button>
                      <button type="button" title="List" className="p-1 hover:bg-gray-200 rounded"><List size={16} /></button>
                    </div>
                  </div>
                </div>
                <div className="form-actions mt-4">
                  <button className="btn btn-primary" type="submit">
                    <Send className="w-4 h-4 mr-2" /> {t("order.send")}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

function AddonCard({ name, price, priceAlt }: { name: string, price: string, priceAlt: string }) {
  return (
    <div className="addon-card">
      <div className="addon-name">{name}</div>
      <div className="addon-price">
        {price}<br />
        <span className="addon-price-alt">{priceAlt}</span>
      </div>
    </div>
  );
}

function FeatureCard({ icon, title, sub }: { icon: React.ReactNode, title: string, sub: string }) {
  return (
    <div className="feature-card">
      <div className="feature-icon">{icon}</div>
      <div className="feature-title">{title}</div>
      <div className="feature-sub">{sub}</div>
    </div>
  );
}

function WorkflowStep({ icon, title, sub }: { icon: React.ReactNode, title: string, sub: string }) {
  return (
    <div className="workflow-step">
      <div className="workflow-icon">{icon}</div>
      <div className="workflow-title">{title}</div>
      <div className="workflow-sub">{sub}</div>
    </div>
  );
}
