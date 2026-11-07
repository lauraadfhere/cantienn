"use client";

import Image from "next/image";
import Link from "next/link";
import { useTranslation } from "./context";

export default function NotFound() {
  const { t } = useTranslation();
  return (
    <div className="min-h-screen bg-[#8F001A] flex flex-col relative overflow-hidden">
      {/* Geometric Pattern Overlay */}
      <svg 
        className="absolute top-0 right-0 bottom-0 w-[65%] h-full opacity-20 pointer-events-none z-0"
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

      {/* Header Section */}
      <div className="py-16 px-6 flex flex-col items-center justify-center relative z-10">
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

      {/* Main Content Area */}
      <div className="flex-1 flex items-center justify-center px-4 py-8 relative z-10">
        <div className="w-full max-w-2xl bg-white/95 backdrop-blur-sm rounded-none border border-white/20 shadow-2xl p-8 md:p-12 transform hover:scale-[1.01] transition-all duration-500">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-8 mb-8">
            <div className="flex-shrink-0 bg-gray-50 p-4 rounded-full border border-gray-100">
              <svg className="w-12 h-12 text-[#8F001A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-4xl font-black text-gray-900 mb-4 tracking-tighter">
                404 - {t('notFound.title')}
              </h1>
              <p className="text-lg text-gray-600 leading-relaxed mb-6">
                {t('notFound.text')} {t('notFound.startFrom')}{" "}
                <Link href="/" className="text-[#8F001A] hover:underline font-black decoration-2">
                  {t('notFound.homePage')}
                </Link>{" "}
                {t('notFound.orUseBack')}{" "}
                <Link href="/contact" className="text-[#8F001A] hover:underline font-black decoration-2">
                  {t('notFound.contactUs')}
                </Link>{" "}
                {t('notFound.soWeCanFix')}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <Link href="/contact" className="flex items-center gap-3 p-4 bg-gray-50 hover:bg-gray-100 border border-gray-100 rounded-none transition-colors group">
                  <div className="w-8 h-8 flex items-center justify-center bg-white border border-gray-200 group-hover:border-[#8F001A] transition-colors">
                    <span className="text-[#8F001A] font-bold">1</span>
                  </div>
                  <span className="font-bold text-gray-700">{t('notFound.supportLink')}</span>
                </Link>
                <Link href="/articles" className="flex items-center gap-3 p-4 bg-gray-50 hover:bg-gray-100 border border-gray-100 rounded-none transition-colors group">
                  <div className="w-8 h-8 flex items-center justify-center bg-white border border-gray-200 group-hover:border-[#8F001A] transition-colors">
                    <span className="text-[#8F001A] font-bold">2</span>
                  </div>
                  <span className="font-bold text-gray-700">{t('notFound.helpArticles')}</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer with Logo */}
      <footer className="py-4 text-center bg-[#8F001A]">
        <div className="flex justify-center gap-2 mb-2">
          <div className="w-10 h-10 bg-[#8F001A] rounded border border-white/40 flex items-center justify-center">
            <span className="text-lg font-bold text-white">W</span>
          </div>
        </div>
        <div className="flex justify-center gap-3 text-[10px] text-white/70">
          <Link href="/privacy" className="hover:text-white">{t('auth.privacyPolicy')}</Link>
          <span>•</span>
          <Link href="/terms" className="hover:text-white">{t('auth.termsOfService')}</Link>
          <span>•</span>
          <p>© {new Date().getFullYear()} WIPPEL</p>
        </div>
      </footer>
    </div>
  );
}
