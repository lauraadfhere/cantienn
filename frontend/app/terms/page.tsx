"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { 
  ShieldCheck, 
  CreditCard, 
  RotateCcw, 
  Handshake, 
  Lock, 
  FileText,
  ChevronRight,
  Mail,
  Home
} from "lucide-react";
import { useTranslation } from "../context";

export default function Terms() {
  const { t, lang } = useTranslation();
  const isRtl = lang === 'ar';

  const policies = [
    {
      id: "payment",
      title: lang === 'ar' ? 'سياسة الدفع' : lang === 'fr' ? 'Politique de Paiement' : 'Payment Policy',
      icon: <CreditCard className="w-6 h-6" />,
      content: lang === 'ar' ? (
        <ul className="space-y-3">
          <li><strong>الإيداع:</strong> مطلوب إيداع 50٪ مقدمًا لبدء أي مشروع.</li>
          <li><strong>المراحل:</strong> بالنسبة للمشاريع الكبيرة، قد يتم تقسيم الدفعات إلى مراحل محددة.</li>
          <li><strong>الدفع النهائي:</strong> الرصيد المتبقي مستحق عند اكتمال المشروع وقبل النشر النهائي.</li>
        </ul>
      ) : lang === 'fr' ? (
        <ul className="space-y-3">
          <li><strong>Acompte :</strong> Un acompte de 50 % est requis pour lancer tout projet.</li>
          <li><strong>Jalons :</strong> Pour les grands projets, les paiements peuvent être divisés en jalons.</li>
          <li><strong>Paiement Final :</strong> Le solde restant est dû à la fin du projet avant le déploiement.</li>
        </ul>
      ) : (
        <ul className="space-y-3">
          <li><strong>Deposit:</strong> A 50% upfront deposit is required to initiate any project.</li>
          <li><strong>Milestones:</strong> For larger projects, payments may be divided into specific milestones.</li>
          <li><strong>Final Payment:</strong> The remaining balance is due upon project completion and before final deployment.</li>
        </ul>
      )
    },
    {
      id: "refund",
      title: lang === 'ar' ? 'سياسة الاسترجاع' : lang === 'fr' ? 'Politique de Remboursement' : 'Refund Policy',
      icon: <RotateCcw className="w-6 h-6" />,
      content: lang === 'ar' ? (
        <p>نظرًا لطبيعة الخدمات الرقمية المخصصة، فإن الودائع غير قابلة للاسترداد بمجرد بدء أعمال التصميم أو التطوير لتغطية الموارد المخصصة.</p>
      ) : lang === 'fr' ? (
        <p>En raison de la nature des services numériques personnalisés, les acomptes ne sont pas remboursables une fois le travail commencé.</p>
      ) : (
        <p>Due to the nature of custom digital services, deposits are non-refundable once design or development work has begun to cover allocated resources.</p>
      )
    },
    {
      id: "ip",
      title: lang === 'ar' ? 'الملكية الفكرية' : lang === 'fr' ? 'Propriété Intellectuelle' : 'Intellectual Property',
      icon: <Handshake className="w-6 h-6" />,
      content: lang === 'ar' ? (
        <p>عند استلام الدفعة الكاملة، تمتلك الحقوق الكاملة للكود المخصص والتصميمات والمحتوى الذي تم إنشاؤه لمشروعك.</p>
      ) : lang === 'fr' ? (
        <p>Dès réception du paiement intégral, vous possédez tous les droits sur le code, les designs et le contenu créés pour votre projet.</p>
      ) : (
        <p>Upon receipt of full payment, you own the full rights to the custom code, designs, and content created specifically for your project.</p>
      )
    },
    {
      id: "privacy",
      title: lang === 'ar' ? 'سياسة الخصوصية' : lang === 'fr' ? 'Confidentialité' : 'Privacy Policy',
      icon: <Lock className="w-6 h-6" />,
      content: lang === 'ar' ? (
        <p>نحن نحمي بياناتك ومعلومات مشروعك. لا يتم مشاركة أي معلومات مع أطراف ثالثة دون موافقة صريحة.</p>
      ) : lang === 'fr' ? (
        <p>Nous protégeons vos données et les informations de votre projet. Aucune information n'est partagée sans votre consentement.</p>
      ) : (
        <p>We protect your data and project information. No information is shared with third parties without explicit consent.</p>
      )
    }
  ];

  return (
    <>
      <section style={{ position: 'relative', overflow: 'hidden', background: '#8F001A', color: '#ffffff' }}>
        {/* Geometric Angular Pattern Overlay */}
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
                  src="/images/WappilLogo.png" 
                  alt="WIPPEL" 
                  width={240} 
                  height={68} 
                  style={{ width: 'auto', height: '68px', filter: 'brightness(0) invert(1)' }} 
                  priority
                />
              </Link>
            </div>
            <div style={{ textAlign: isRtl ? 'left' : 'right' }}>
              <div style={{ fontSize: '16px', fontWeight: 400, letterSpacing: '1.5px', textTransform: 'uppercase', color: 'rgba(255,255,255,0.85)', marginBottom: '12px', display: 'flex', gap: '24px', justifyContent: isRtl ? 'flex-start' : 'flex-end' }}>
                <Link href="/services" style={{ color: 'inherit', textDecoration: 'none' }} className="hover:text-white transition-colors">{t("nav.services")}</Link>
                <Link href="/contact" style={{ color: 'inherit', textDecoration: 'none' }} className="hover:text-white transition-colors">{t("nav.contact")}</Link>
              </div>
              <div style={{ fontSize: '28px', fontWeight: 500, letterSpacing: '-0.5px', color: '#ffffff' }}>
                {lang === 'ar' ? 'الشروط والسياسات' : lang === 'fr' ? 'Conditions et Politiques' : 'Terms & Policies'}
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className={`py-16 bg-gray-50 ${isRtl ? 'text-right' : 'text-left'}`} dir={isRtl ? 'rtl' : 'ltr'}>
        <div className="container max-w-4xl">
          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
            <div className="p-8 md:p-12 space-y-12">
              {policies.map((policy) => (
                <section key={policy.id} className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-black text-white rounded-xl flex items-center justify-center shadow-lg">
                      {policy.icon}
                    </div>
                    <h2 className="text-2xl font-black text-gray-900 tracking-tight">{policy.title}</h2>
                  </div>
                  <div className="text-lg font-bold text-gray-600 leading-relaxed pl-2 border-l-4 border-gray-100 ml-6">
                    {policy.content}
                  </div>
                </section>
              ))}
            </div>
            
            <div className="bg-gray-50 p-8 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-6">
              <div>
                <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Last updated</p>
                <p className="text-sm font-bold text-gray-900">April 8, 2026</p>
              </div>
              <Link href="/contact" className="btn btn-primary bg-black hover:bg-gray-900 text-white border-none py-3 px-8 font-black">
                {lang === 'ar' ? 'لديك أسئلة؟ اتصل بنا' : lang === 'fr' ? 'Des questions ? Contactez-nous' : 'Have questions? Contact us'}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
