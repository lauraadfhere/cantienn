"use client";

import Image from "next/image";
import Link from "next/link";
import { CheckCircle, Home, Mail, ArrowRight, Rocket } from "lucide-react";
import { useTranslation } from "../../context";

export default function OrderSuccess() {
  const { t } = useTranslation();
  return (
    <div className="min-h-screen bg-[#8F001A] flex flex-col">
      {/* Header Section */}
      <div className="bg-[#8F001A] py-8 px-6 flex flex-col items-center justify-center">
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

      {/* Main Content Area */}
      <div className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-2xl bg-white rounded-lg shadow-lg p-6 md:p-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-black rounded-full mb-6 shadow-xl">
              <CheckCircle className="w-12 h-12 text-white" />
            </div>
            <h1 className="text-2xl md:text-3xl font-black text-gray-900 mb-3 uppercase tracking-tighter">
              {t('success.title')}
            </h1>
            <p className="text-sm text-gray-700 leading-relaxed">
              {t('success.text')}
            </p>
          </div>

          <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-8">
            <h2 className="text-lg font-black text-gray-900 mb-4 flex items-center gap-2 uppercase tracking-tight">
              <Rocket className="w-5 h-5 text-black" />
              {t('success.whatsNext')}
            </h2>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-7 h-7 bg-black text-white rounded-full flex items-center justify-center font-black text-xs">
                  1
                </div>
                <div>
                  <h3 className="font-bold text-sm text-gray-900 uppercase">{t('success.step1')}</h3>
                  <p className="text-xs text-gray-600 font-bold opacity-70">{t('success.step1Sub')}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-7 h-7 bg-black text-white rounded-full flex items-center justify-center font-black text-xs">
                  2
                </div>
                <div>
                  <h3 className="font-bold text-sm text-gray-900 uppercase">{t('success.step2')}</h3>
                  <p className="text-xs text-gray-600 font-bold opacity-70">{t('success.step2Sub')}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-7 h-7 bg-black text-white rounded-full flex items-center justify-center font-black text-xs">
                  3
                </div>
                <div>
                  <h3 className="font-bold text-sm text-gray-900 uppercase">{t('success.step3')}</h3>
                  <p className="text-xs text-gray-600 font-bold opacity-70">{t('success.step3Sub')}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <Link 
              href="/" 
              className="flex-1 bg-black text-white px-6 py-3 rounded-0 text-sm font-black hover:bg-gray-800 transition-all flex items-center justify-center gap-2 uppercase tracking-widest"
            >
              <Home className="w-4 h-4" />
              {t('success.backHome')}
            </Link>
            <Link 
              href="/services" 
              className="flex-1 bg-white text-gray-900 px-6 py-3 rounded-0 text-sm font-black hover:bg-gray-50 transition-all border-2 border-black flex items-center justify-center gap-2 uppercase tracking-widest"
            >
              {t('success.viewServices')}
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="mt-6 pt-4 border-t border-gray-200 text-center">
            <p className="text-xs text-gray-600 mb-2">
              {t('success.questions')}
            </p>
            <a 
              href="mailto:replies@wappil.com" 
              className="inline-flex items-center gap-2 text-[#2563eb] font-semibold hover:underline"
            >
              <Mail className="w-4 h-4" />
              replies@wappil.com
            </a>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-4 text-center text-xs text-white bg-[#8F001A]">
        <div className="flex justify-center gap-3 mb-1">
          <Link href="/privacy" className="text-white underline decoration-white/60 hover:decoration-white text-xs">{t('auth.privacyPolicy')}</Link>
          <Link href="/terms" className="text-white underline decoration-white/60 hover:decoration-white text-xs">{t('auth.termsOfService')}</Link>
        </div>
        <p className="text-xs text-white/70">© {new Date().getFullYear()} {t('auth.footerCopyright')}</p>
      </footer>
    </div>
  );
}
