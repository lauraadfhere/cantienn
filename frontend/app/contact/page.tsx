"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Mail, 
  Phone, 
  Briefcase, 
  ClipboardList, 
  Linkedin, 
  Globe, 
  Send, 
  ShieldCheck, 
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import { useTranslation } from "../context";

export default function Contact() {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
    privacy_agreement: false,
    captcha_answer: ""
  });
  const [captcha, setCaptcha] = useState({ question: "", answer: 0 });
  const [status, setStatus] = useState<{ type: 'success' | 'error' | null, message: string }>({ type: null, message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    generateCaptcha();
  }, []);

  const generateCaptcha = () => {
    const a = Math.floor(Math.random() * 10) + 1;
    const b = Math.floor(Math.random() * 10) + 1;
    setCaptcha({ question: `${a} + ${b}`, answer: a + b });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    setFormData(prev => ({ ...prev, [name]: val }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus({ type: null, message: "" });

    if (parseInt(formData.captcha_answer) !== captcha.answer) {
      setStatus({ type: 'error', message: t("captcha.error") });
      generateCaptcha();
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setStatus({ type: 'success', message: t("toast.sent") });
        setFormData({
          name: "",
          email: "",
          phone: "",
          subject: "",
          message: "",
          privacy_agreement: false,
          captcha_answer: ""
        });
        generateCaptcha();
      } else {
        setStatus({ type: 'error', message: "Failed to send message. Please try again." });
      }
    } catch (error) {
      setStatus({ type: 'error', message: "An error occurred. Please try again later." });
    } finally {
      setIsSubmitting(false);
    }
  };

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

        <div className="container hero-band-inner" style={{ position: 'relative', zIndex: 1 }}>
          <h1 className="hero-band-title">{t("contact.title")}</h1>
          <p className="hero-band-subtitle">{t("contact.subtitle")}</p>
          <div className="hero-band-actions">
            <a className="btn btn-primary" href="mailto:belhachemiamohammed@inbox.eu">
              <Mail className="w-4 h-4 mr-2" /> {t("contact.emailMe")}
            </a>
            <Link className="btn btn-ghost" href="/services">
              <Briefcase className="w-4 h-4 mr-2" /> {t("contact.view")}
            </Link>
            <Link className="btn btn-help" href="/order">
              <ClipboardList className="w-4 h-4 mr-2" /> {t("contact.orderForm")}
            </Link>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="card">
              <div className="card-title p-4 border-b font-bold">{t('contact.direct')}</div>
              <div className="card-body p-4">
                <div className="list-item border-b pb-4 mb-4">
                  <div className="list-top flex items-center gap-3 font-bold mb-1">
                    <Mail className="w-5 h-5 text-black" /> belhachemiamohammed@inbox.eu
                  </div>
                  <div className="list-sub text-sm text-gray-500 font-bold">{t('contact.directSub')}</div>
                </div>
                <div className="list-item border-b pb-4 mb-4">
                  <div className="list-top flex items-center gap-3 font-bold mb-1">
                    <Phone className="w-5 h-5 text-black" /> +213 783 217 817
                  </div>
                  <div className="list-sub text-sm text-gray-500 font-bold">{t('contact.phoneSub')}</div>
                </div>
                <div className="form-actions flex flex-wrap gap-3">
                  <a className="btn btn-primary bg-black border-black hover:bg-gray-800" href="mailto:belhachemiamohammed@inbox.eu">
                    <Send className="w-4 h-4 mr-2" /> {t("contact.sendEmail")}
                  </a>
                  <a className="btn btn-primary bg-black border-black hover:bg-gray-800" href="tel:+213783217817">
                    <Phone className="w-4 h-4 mr-2" /> {t('contact.callNow')}
                  </a>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="card-title p-4 border-b font-bold">{t('contact.social')}</div>
              <div className="card-body p-4">
                <div className="cv-links flex flex-col gap-3">
                  <a className="cv-link flex items-center gap-3 font-bold text-brand-600 hover:underline" href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
                    <Linkedin size={18} /> {t('contact.personal')}
                  </a>
                  <a className="cv-link flex items-center gap-3 font-bold text-brand-600 hover:underline" href="https://linkedin.com/company/wippel" target="_blank" rel="noopener noreferrer">
                    <Linkedin size={18} /> {t('contact.company')}
                  </a>
                  <a className="cv-link flex items-center gap-3 font-bold text-brand-600 hover:underline" href="https://wippel.com" target="_blank" rel="noopener noreferrer">
                    <Globe size={18} /> {t('contact.website')}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section bg-gray-50">
        <div className="container">
          <div className="section-head text-center mb-10">
            <h2 className="section-title text-3xl font-black mb-4">{t('contact.form.title')}</h2>
            <p className="text-gray-500 font-bold max-w-2xl mx-auto">{t('contact.form.subtitle')}</p>
          </div>

          <div className="card max-w-3xl mx-auto">
            <div className="card-body p-8">
              {status.type === 'error' && (
                <div className="bg-black text-white p-4 rounded-lg mb-6 flex items-center gap-3 font-bold">
                  <AlertCircle size={20} /> {status.message}
                </div>
              )}
              {status.type === 'success' && (
                <div className="bg-black text-white p-4 rounded-lg mb-6 flex items-center gap-3 font-bold shadow-xl">
                  <CheckCircle2 size={20} /> {status.message}
                </div>
              )}

              <form onSubmit={handleSubmit} className="contact-form">
                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  <div className="form-group">
                    <label htmlFor="contact-name" className="form-label mb-2 block font-bold text-sm text-gray-700 uppercase tracking-wider">{t('contact.form.name')}</label>
                    <input type="text" id="contact-name" name="name" className="form-input" required placeholder={t('contact.form.namePlaceholder')} value={formData.name} onChange={handleChange} />
                  </div>
                  <div className="form-group">
                    <label htmlFor="contact-email" className="form-label mb-2 block font-bold text-sm text-gray-700 uppercase tracking-wider">{t('contact.form.email')}</label>
                    <input type="email" id="contact-email" name="email" className="form-input" required placeholder={t('contact.form.emailPlaceholder')} value={formData.email} onChange={handleChange} />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  <div className="form-group">
                    <label htmlFor="contact-phone" className="form-label mb-2 block font-bold text-sm text-gray-700 uppercase tracking-wider">{t('contact.form.phone')}</label>
                    <input type="tel" id="contact-phone" name="phone" className="form-input" placeholder={t('contact.form.phonePlaceholder')} value={formData.phone} onChange={handleChange} />
                  </div>
                  <div className="form-group">
                    <label htmlFor="contact-subject" className="form-label mb-2 block font-bold text-sm text-gray-700 uppercase tracking-wider">{t('contact.form.subject')}</label>
                    <select id="contact-subject" name="subject" className="form-input" required value={formData.subject} onChange={handleChange}>
                      <option value="">{t('contact.form.subjectPlaceholder')}</option>
                      <option value="General Inquiry">{t('contact.form.subject1')}</option>
                      <option value="Project Quote">{t('contact.form.subject2')}</option>
                      <option value="Technical Support">{t('contact.form.subject3')}</option>
                      <option value="Partnership">{t('contact.form.subject4')}</option>
                      <option value="Other">{t('contact.form.subject5')}</option>
                    </select>
                  </div>
                </div>

                <div className="form-group mb-6">
                  <label htmlFor="contact-message" className="form-label mb-2 block font-bold text-sm text-gray-700 uppercase tracking-wider">{t('contact.form.message')}</label>
                  <textarea name="message" id="contact-message" className="form-input min-h-[180px]" required rows={8} placeholder={t('contact.form.messagePlaceholder')} value={formData.message} onChange={handleChange}></textarea>
                  <div className="flex justify-between items-center mt-2 text-xs font-bold text-gray-400">
                    <span>{formData.message.length} / 2000 {t('contact.form.chars')}</span>
                    <span>{t('contact.form.tip')}</span>
                  </div>
                </div>

                <div className="form-group mb-8">
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <input type="checkbox" name="privacy_agreement" className="w-5 h-5 accent-brand-600 cursor-pointer" required checked={formData.privacy_agreement} onChange={handleChange} />
                    <span className="text-sm font-bold text-gray-600 group-hover:text-gray-900 transition-colors">{t('contact.form.privacy')}</span>
                  </label>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 p-6 rounded-xl mb-8">
                  <label htmlFor="captcha_answer" className="form-label mb-4 flex items-center gap-2 font-bold text-yellow-800">
                    <ShieldCheck size={20} /> {t('captcha.label').replace('%s', captcha.question)}
                  </label>
                  <input type="number" name="captcha_answer" id="captcha_answer" className="form-input max-w-[120px] border-yellow-300 focus:border-yellow-500 focus:ring-yellow-500/20" required placeholder={t('captcha.placeholder')} value={formData.captcha_answer} onChange={handleChange} />
                </div>

                <div className="text-center">
                  <button type="submit" className="btn btn-primary btn-large w-full md:w-auto px-12 py-4 text-lg" disabled={isSubmitting}>
                    {isSubmitting ? t('contact.form.sending') : <><Send className="w-5 h-5 mr-2" /> {t('contact.form.send')}</>}
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
