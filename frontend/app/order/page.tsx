"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { 
  Printer, 
  CheckCircle2, 
  AlertCircle, 
  CloudUpload, 
  Bold, 
  Italic, 
  Underline, 
  List, 
  ListOrdered, 
  ArrowRight, 
  ShieldCheck, 
  X, 
  Mail, 
  Briefcase, 
  Award,
  Send,
  FileText,
  Image as ImageIcon,
  ChevronRight,
  Sparkles,
  Loader2
} from "lucide-react";
import { useTranslation } from "../context";

export default function Order() {
  const { t, lang } = useTranslation();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    budget: "",
    service: "",
    media_type: "",
    message: "",
    policy_agreement: false,
    captcha_answer: ""
  });
  const [files, setFiles] = useState<FileList | null>(null);
  const [captcha, setCaptcha] = useState({ question: "", answer: 0 });
  const [status, setStatus] = useState<{ type: 'success' | 'error' | null, message: string }>({ type: null, message: "" });
  const [showPolicy, setShowPolicy] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);

  useEffect(() => {
    generateCaptcha();
    // Pre-fill user data if logged in
    const storedUser = localStorage.getItem('user-info');
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        setFormData(prev => ({
          ...prev,
          name: user.name || "",
          email: user.email || ""
        }));
      } catch (err) {
        console.error("Failed to parse user info:", err);
      }
    }
  }, []);

  const generateCaptcha = () => {
    const a = Math.floor(Math.random() * 10) + 1;
    const b = Math.floor(Math.random() * 10) + 1;
    setCaptcha({ question: `${a} + ${b}`, answer: a + b });
  };

  const handleFormat = (type: string) => {
    if (!textareaRef.current) return;
    const start = textareaRef.current.selectionStart;
    const end = textareaRef.current.selectionEnd;
    const text = formData.message;
    const selectedText = text.substring(start, end);
    let newText = "";

    switch (type) {
      case "bold": newText = `**${selectedText}**`; break;
      case "italic": newText = `*${selectedText}*`; break;
      case "underline": newText = `<u>${selectedText}</u>`; break;
      case "list": newText = `\n- ${selectedText}`; break;
      case "ordered": newText = `\n1. ${selectedText}`; break;
    }

    const updatedMessage = text.substring(0, start) + newText + text.substring(end);
    setFormData(prev => ({ ...prev, message: updatedMessage }));
    
    // Focus back and set cursor
    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.focus();
        const newCursorPos = start + newText.length;
        textareaRef.current.setSelectionRange(newCursorPos, newCursorPos);
      }
    }, 0);
  };

  const generateAIDescription = async () => {
    setIsGeneratingAI(true);
    try {
      const projectContext = `
        Service Type: ${formData.service || "Not specified"}
        Company: ${formData.company || "Not specified"}
        Budget: ${formData.budget || "Not specified"}
        Current Description: ${formData.message || "No description provided yet"}
      `;

      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: `Generate a professional project description based on this information: ${projectContext}. The description should be detailed, professional, and suitable for a project submission. Include technical requirements, goals, and expected outcomes.`,
          history: []
        }),
      });

      const text = await response.text();
      let data: { success?: boolean; message?: string; error?: string } = {};
      try {
        data = text ? JSON.parse(text) : {};
      } catch {
        throw new Error(response.ok ? 'AI service returned an invalid response' : text || 'AI request failed');
      }

      if (!response.ok) throw new Error(data.error || data.message || `AI request failed (${response.status})`);

      if (data.success && data.message) {
        const generatedMessage = data.message;
        setFormData(prev => ({
          ...prev,
          message: prev.message ? prev.message + "\n\n" + generatedMessage : generatedMessage
        }));
      } else {
        setStatus({ type: 'error', message: 'Failed to generate AI description. Please try again.' });
      }
    } catch (error) {
      console.error('AI Error:', error);
      setStatus({ type: 'error', message: 'Failed to connect to AI service. Please try again.' });
    } finally {
      setIsGeneratingAI(false);
    }
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
    
    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      data.append(key, value.toString());
    });
    if (files) {
      for (let i = 0; i < files.length; i++) {
        data.append('attachments', files[i]);
      }
    }

    try {
      const response = await fetch("/api/order", {
        method: "POST",
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        window.location.href = "/order/success";
      } else {
        setStatus({ type: 'error', message: "Failed to send request. Please try again." });
        setIsSubmitting(false);
      }
    } catch (error) {
      setStatus({ type: 'error', message: "An error occurred. Please try again later." });
      setIsSubmitting(false);
    }
  };

  const isRtl = lang === 'ar';

  return (
    <>
      <section style={{ position: 'relative', overflow: 'hidden', background: '#8F001A', color: '#ffffff' }}>
        {/* Geometric Angular Pattern Overlay — same as home */}
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
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '32px', marginBottom: '40px' }}>
            <div>
              <Link href="/">
                <Image 
                  src="/images/logo2.png" 
                  alt="WIPPEL" 
                  width={240} 
                  height={68} 
                  priority
                  quality={100}
                />
              </Link>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '14px', fontWeight: 600, letterSpacing: '1px', textTransform: 'uppercase', color: 'rgba(255,255,255,0.85)', marginBottom: '16px', display: 'flex', gap: '32px', justifyContent: 'flex-end', alignItems: 'center' }}>
                <Link href="/services" style={{ color: 'inherit', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '6px' }} className="hover:text-white transition-colors">
                  {t("nav.services")} <ChevronRight size={14} style={{ opacity: 0.5 }} />
                </Link>
                <Link href="/contact" style={{ color: 'inherit', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '6px' }} className="hover:text-white transition-colors">
                  {t("nav.contact")} <ChevronRight size={14} style={{ opacity: 0.5 }} />
                </Link>
              </div>
              <div style={{ fontSize: '32px', fontWeight: 900, letterSpacing: '-0.5px', color: '#ffffff', textTransform: 'uppercase' }}>
                {t("order.title")}
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="order-page py-16 bg-gray-50">
        <div className="container">
          <div className="grid lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2">
              <p className="text-gray-500 font-bold text-lg mb-8">{t("order.subtitle")}</p>
              
              <div className="flex items-center gap-2 text-black font-black mb-8 border-b border-gray-100 pb-4">
                <Printer size={18} />
                <em className="italic">{t("order.note3d")}</em>
              </div>

              {status.type === 'success' && (
                <div className="bg-black text-white p-6 rounded-xl mb-8 flex items-start gap-4 shadow-xl border-2 border-white/20">
                  <CheckCircle2 size={24} className="mt-1 flex-shrink-0 text-white" />
                  <div>
                    <div className="font-black text-lg uppercase tracking-widest">Success!</div>
                    <div className="font-bold opacity-80">{status.message}</div>
                  </div>
                </div>
              )}

              {status.type === 'error' && (
                <div className="bg-black text-white p-6 rounded-xl mb-8 flex items-start gap-4 shadow-sm">
                  <AlertCircle size={24} className="mt-1 flex-shrink-0" />
                  <div>
                    <div className="font-black text-lg">Error</div>
                    <div className="font-bold">{status.message}</div>
                  </div>
                </div>
              )}

              <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-8">
                <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="form-row">
                      <label className="form-label mb-2 block font-black text-sm text-gray-700 uppercase" htmlFor="order-name">{t("order.name")} <span className="text-black font-bold">*</span></label>
                      <input className="form-input" id="order-name" name="name" placeholder="John Doe" required value={formData.name} onChange={handleChange} />
                    </div>
                    <div className="form-row">
                      <label className="form-label mb-2 block font-black text-sm text-gray-700 uppercase" htmlFor="order-email">{t("order.email")} <span className="text-black font-bold">*</span></label>
                      <input className="form-input" id="order-email" name="email" type="email" placeholder="john@example.com" required value={formData.email} onChange={handleChange} />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="form-row">
                      <label className="form-label mb-2 block font-black text-sm text-gray-700 uppercase" htmlFor="order-company">{t("order.company")}</label>
                      <input className="form-input" id="order-company" name="company" placeholder="Acme Inc." value={formData.company} onChange={handleChange} />
                    </div>
                    <div className="form-row">
                      <label className="form-label mb-2 block font-black text-sm text-gray-700 uppercase" htmlFor="order-budget">{t("order.budget")}</label>
                      <input className="form-input" id="order-budget" name="budget" placeholder="e.g. $400–$900" value={formData.budget} onChange={handleChange} />
                    </div>
                  </div>

                  <div className="form-row">
                    <label className="form-label mb-2 block font-black text-sm text-gray-700 uppercase" htmlFor="order-service">{t("order.service")} <span className="text-black font-bold">*</span></label>
                    <select className="form-input" id="order-service" name="service" required value={formData.service} onChange={handleChange}>
                      <option value="" disabled>{t("order.servicePlaceholder")}</option>
                      <option value="Basic Website">Basic Website</option>
                      <option value="Full Website">Full Website</option>
                      <option value="Advanced Platform">Advanced Platform</option>
                      <option value="Startup SaaS">Startup SaaS</option>
                    </select>
                  </div>

                  <div className="form-row">
                    <label className="form-label mb-2 block font-black text-sm text-gray-700 uppercase">Media Type <span className="text-black font-bold">*</span></label>
                    <div className="grid grid-cols-2 gap-4">
                      <label className={`flex items-center gap-3 p-4 border-2 rounded-xl cursor-pointer transition-all ${formData.media_type === 'picture' ? 'border-black bg-gray-50' : 'border-gray-100 hover:border-gray-200'}`}>
                        <input type="radio" name="media_type" value="picture" required className="w-5 h-5 accent-black" checked={formData.media_type === 'picture'} onChange={handleChange} />
                        <div>
                          <div className="flex items-center gap-2 font-black text-gray-900">
                            <ImageIcon size={18} className="text-black" /> Pictures
                          </div>
                          <small className="block text-gray-500 text-xs font-bold">JPG, PNG, GIF, WebP</small>
                        </div>
                      </label>
                      <label className={`flex items-center gap-3 p-4 border-2 rounded-xl cursor-pointer transition-all ${formData.media_type === 'pdf' ? 'border-black bg-gray-50' : 'border-gray-100 hover:border-gray-200'}`}>
                        <input type="radio" name="media_type" value="pdf" required className="w-5 h-5 accent-black" checked={formData.media_type === 'pdf'} onChange={handleChange} />
                        <div>
                          <div className="flex items-center gap-2 font-black text-gray-900">
                            <FileText size={18} className="text-black" /> PDF Documents
                          </div>
                          <small className="block text-gray-500 text-xs font-bold">PDF, DOC, DOCX</small>
                        </div>
                      </label>
                    </div>
                  </div>

                  <div className="form-row">
                    <label className="form-label mb-2 block font-black text-sm text-gray-700 uppercase" htmlFor="order-files">{t("order.files")}</label>
                    <div className="relative group">
                      <input type="file" id="order-files" name="attachments" multiple accept=".pdf,.doc,.docx,image/*" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" onChange={(e) => setFiles(e.target.files)} />
                      <div className="border-2 border-dashed border-gray-200 group-hover:border-black rounded-2xl p-8 text-center transition-colors">
                        <CloudUpload size={48} className="mx-auto mb-4 text-gray-300 group-hover:text-black transition-colors" />
                        <div className="font-black text-gray-700 mb-1">{t("order.filesPlaceholder")}</div>
                        <small className="block text-gray-400 font-bold">Max file size: 10MB • Powered by Cloudinary</small>
                        {files && files.length > 0 && (
                          <div className="mt-4 p-3 bg-gray-100 rounded-lg text-black font-black text-sm">
                            {files.length} file(s) selected
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="form-row">
                    <label className="form-label mb-2 block font-black text-sm text-gray-700 uppercase" htmlFor="order-message">{t("order.message")}</label>
                    <div className="border-2 border-gray-100 rounded-2xl overflow-hidden focus-within:border-black transition-colors">
                      <div className="bg-gray-50 p-2 border-b border-gray-100 flex gap-2 items-center">
                        <button type="button" onClick={() => handleFormat('bold')} className="p-2 hover:bg-white rounded transition-colors text-gray-600" title="Bold"><Bold size={16} /></button>
                        <button type="button" onClick={() => handleFormat('italic')} className="p-2 hover:bg-white rounded transition-colors text-gray-600" title="Italic"><Italic size={16} /></button>
                        <button type="button" onClick={() => handleFormat('underline')} className="p-2 hover:bg-white rounded transition-colors text-gray-600" title="Underline"><Underline size={16} /></button>
                        <div className="w-px bg-gray-200 mx-1"></div>
                        <button type="button" onClick={() => handleFormat('list')} className="p-2 hover:bg-white rounded transition-colors text-gray-600" title="Bullet List"><List size={16} /></button>
                        <button type="button" onClick={() => handleFormat('ordered')} className="p-2 hover:bg-white rounded transition-colors text-gray-600" title="Numbered List"><ListOrdered size={16} /></button>
                        <div className="w-px bg-gray-200 mx-1"></div>
                        <button 
                          type="button" 
                          onClick={generateAIDescription} 
                          disabled={isGeneratingAI}
                          className="ml-auto flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg font-bold text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                          title="Generate with AI"
                        >
                          {isGeneratingAI ? (
                            <>
                              <Loader2 size={16} className="animate-spin" />
                              <span>Generating...</span>
                            </>
                          ) : (
                            <>
                              <Sparkles size={16} />
                              <span>AI Generate</span>
                            </>
                          )}
                        </button>
                      </div>
                      <textarea 
                        ref={textareaRef}
                        className="w-full p-4 min-h-[220px] outline-none font-bold text-gray-800 placeholder:text-gray-300 resize-none" 
                        id="order-message" 
                        name="message" 
                        placeholder={t("order.messagePlaceholder")} 
                        value={formData.message} 
                        onChange={handleChange}
                      ></textarea>
                    </div>
                  </div>

                  <div className="bg-gray-50 border border-gray-200 p-6 rounded-2xl">
                    <div className="flex items-center gap-2 text-black font-black mb-2">
                      <ShieldCheck size={20} /> {t("order.privacyTitle")}
                    </div>
                    <p className="text-gray-500 font-bold text-sm mb-6 leading-relaxed">
                      {t("order.privacyText")}
                    </p>
                    
                    <label className="flex items-start gap-3 p-4 bg-white border-2 border-gray-100 rounded-xl cursor-pointer hover:border-black transition-all">
                      <input type="checkbox" name="policy_agreement" required className="w-6 h-6 mt-1 accent-black cursor-pointer" checked={formData.policy_agreement} onChange={handleChange} />
                      <span className="font-bold text-gray-700 leading-tight">
                        <strong>{t("order.policyAgree")}</strong> {t("order.policyRead")} <span className="text-black font-bold">*</span>
                        <button type="button" onClick={() => setShowPolicy(true)} className="ml-1 text-black underline hover:opacity-70">{t("order.policyLink")}</button>
                      </span>
                    </label>
                  </div>

                  {/* Academic & Security Validation */}
                  <div className="bg-black text-white p-8 rounded-2xl shadow-xl overflow-hidden relative group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                      <Award size={120} />
                    </div>
                    
                    <div className="relative z-10">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="bg-white/20 p-2 rounded-lg">
                          <ShieldCheck size={24} className="text-white" />
                        </div>
                        <h3 className="text-xl font-black tracking-tight uppercase italic">Academic & Security Verification</h3>
                      </div>
                      
                      <p className="text-gray-400 font-bold text-sm mb-6 max-w-md">
                        To maintain platform integrity and academic standards, please complete the following verification challenge.
                      </p>

                      <div className="flex flex-col md:flex-row items-end gap-6">
                        <div className="flex-1 w-full">
                          <label className="block font-black text-white/70 mb-3 text-xs uppercase letter-spacing-widest">
                            Challenge: What is {captcha.question}?
                          </label>
                          <div className="relative">
                            <input 
                              type="number" 
                              name="captcha_answer" 
                              required 
                              placeholder="???" 
                              className="w-full bg-white/10 border-2 border-white/20 rounded-xl p-4 outline-none focus:border-white transition-all font-black text-2xl placeholder:text-white/20" 
                              value={formData.captcha_answer} 
                              onChange={handleChange} 
                            />
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 pointer-events-none">
                              <CheckCircle2 size={24} />
                            </div>
                          </div>
                        </div>
                        
                        <div className="hidden md:block pb-2">
                          <div className="text-[10px] font-black text-white/30 uppercase vertical-text tracking-tighter">
                            SECURE-TRANS-ID: {Math.random().toString(36).substring(7).toUpperCase()}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col md:flex-row gap-4 mt-8 pt-8 border-t border-gray-100">
                    <button type="submit" className="btn btn-primary bg-black hover:bg-gray-800 border-none btn-large flex-1 py-5 text-xl font-black uppercase tracking-tight shadow-xl hover:scale-[1.01] active:scale-[0.99] transition-all" disabled={isSubmitting}>
                      {isSubmitting ? "Processing..." : <><Send size={22} className="mr-3" /> {t("order.send")}</>}
                    </button>
                    <Link href="/contact" className="btn btn-ghost py-5 px-10 text-xl font-black border-2 border-black hover:bg-black hover:text-white transition-all text-center">
                      Back to Contact
                    </Link>
                  </div>
                </form>
              </div>
            </div>

            <aside className="lg:col-span-1">
              <div className="sticky top-24 flex flex-col gap-6">
                <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6">
                  <h3 className="text-xl font-black mb-4 uppercase tracking-tighter">{t("order.directContact")}</h3>
                  <p className="text-gray-500 font-bold text-sm mb-6">Prefer email or have questions before ordering?</p>
                  <a href="mailto:belhachemiamohammed@inbox.eu" className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl hover:bg-black hover:text-white transition-all group">
                    <Mail size={20} className="text-black group-hover:text-white transition-colors" />
                    <span className="font-black text-sm break-all">belhachemiamohammed@inbox.eu</span>
                  </a>
                  <div className="h-px bg-gray-100 my-6"></div>
                  <div className="flex flex-col gap-2">
                    <Link href="/services" className="flex items-center gap-3 p-3 font-black text-gray-700 hover:text-black transition-colors">
                      <Briefcase size={18} /> View Services
                    </Link>
                    <Link href="/cv" className="flex items-center gap-3 p-3 font-black text-gray-700 hover:text-black transition-colors">
                      <Award size={18} /> My CV & Experience
                    </Link>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </div>

      {showPolicy && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={() => setShowPolicy(false)}></div>
          <div className="relative bg-white w-full max-w-2xl rounded-0 shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200 border-4 border-black">
            <div className="p-8 border-b-2 border-black flex justify-between items-center bg-gray-50">
              <h3 className="text-2xl font-black flex items-center gap-3 uppercase tracking-tighter">
                <ShieldCheck className="text-black" size={28} /> {t("order.modalTitle")}
              </h3>
              <button onClick={() => setShowPolicy(false)} className="p-2 hover:bg-black hover:text-white transition-all">
                <X size={32} strokeWidth={3} />
              </button>
            </div>
            <div className="p-8 max-h-[70vh] overflow-y-auto">
              <div className={`leading-relaxed text-gray-800 font-bold ${isRtl ? 'text-right' : 'text-left'}`}>
                <p className="mb-8 text-xl border-l-4 border-black pl-6 py-2">{t("order.modalIntro")}</p>
                
                <h4 className="text-black font-black mb-6 flex items-center gap-2 text-lg uppercase tracking-wider underline underline-offset-8 decoration-2">Security Commitment</h4>
                <ul className="space-y-6 mb-10">
                  <li className="flex items-start gap-4">
                    <span className="w-2 h-2 rounded-full bg-black mt-2.5 flex-shrink-0"></span>
                    <span><strong className="text-black uppercase text-sm tracking-widest">{isRtl ? 'عدم المشاركة مع أطراف ثالثة:' : lang === 'fr' ? 'Pas de partage avec des tiers :' : 'No sharing with third parties:'}</strong> <span className="block mt-1 text-gray-600">{t("order.modalItem1")}</span></span>
                  </li>
                  <li className="flex items-start gap-4">
                    <span className="w-2 h-2 rounded-full bg-black mt-2.5 flex-shrink-0"></span>
                    <span><strong className="text-black uppercase text-sm tracking-widest">{isRtl ? 'الاستخدام الحصري:' : lang === 'fr' ? 'Usage exclusif :' : 'Exclusive usage:'}</strong> <span className="block mt-1 text-gray-600">{t("order.modalItem2")}</span></span>
                  </li>
                  <li className="flex items-start gap-4">
                    <span className="w-2 h-2 rounded-full bg-black mt-2.5 flex-shrink-0"></span>
                    <span><strong className="text-black uppercase text-sm tracking-widest">{isRtl ? 'الملكية الفكرية:' : lang === 'fr' ? 'Propriété intellectuelle :' : 'Intellectual property:'}</strong> <span className="block mt-1 text-gray-600">{t("order.modalItem3")}</span></span>
                  </li>
                  <li className="flex items-start gap-4">
                    <span className="w-2 h-2 rounded-full bg-black mt-2.5 flex-shrink-0"></span>
                    <span><strong className="text-black uppercase text-sm tracking-widest">{isRtl ? 'أمان البيانات:' : lang === 'fr' ? 'Sécurité des données :' : 'Data security:'}</strong> <span className="block mt-1 text-gray-600">{t("order.modalItem4")}</span></span>
                  </li>
                </ul>
                
                <div className="bg-black text-white p-8 font-black text-center uppercase tracking-widest text-sm">
                  {t("order.modalFooter")}
                </div>
              </div>
            </div>
            <div className="p-8 bg-gray-50 border-t-2 border-black text-right">
              <button onClick={() => setShowPolicy(false)} className="bg-black text-white px-12 py-4 font-black uppercase tracking-widest hover:bg-gray-800 transition-all">
                {isRtl ? 'إغلاق' : lang === 'fr' ? 'Fermer' : 'Close'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
