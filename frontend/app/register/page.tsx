"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Globe, ChevronDown } from "lucide-react";
import { useTranslation } from "../context";
import type { Language } from "../i18n";

export default function Register() {
  const { t, lang, setLang } = useTranslation();
  const router = useRouter();
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const changeLang = (l: Language) => {
    setLang(l);
    setIsLangMenuOpen(false);
  };

  const validateEmail = (emailValue: string) => {
    if (!emailValue.includes('@')) {
      setError('Invalid email format');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!validateEmail(email)) {
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fullName, email, password })
      });

      if (response.ok) {
        router.push('/login');
      } else {
        const data = await response.json();
        setError(data.message || 'Registration failed');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col relative overflow-hidden">
      {/* Split Layout Container */}
      <div className="flex-1 flex flex-col lg:flex-row relative min-h-0">
        
        {/* Left Side - Image Background (SINGUPWALLPAPER.png) */}
        <div className="hidden lg:block lg:w-1/2 relative">
          <Image 
            src="/images/SINGUPWALLPAPER.png" 
            alt="Background" 
            fill
            style={{ objectFit: 'cover' }}
            priority
          />
          {/* Optional Overlay to match brand feel */}
          <div className="absolute inset-0 bg-[#8F001A]/20" />
        </div>

        {/* Right Side - Form Area */}
        <div className="flex-1 flex flex-col bg-[#8F001A] relative">
          {/* Dotted Pattern Overlay (Right Side Only) */}
          <div 
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.12) 1px, transparent 1px)',
              backgroundSize: '24px 24px',
              zIndex: 1
            }}
          />

          {/* Header Section Inside Form Area */}
          <div className="py-6 px-8 flex items-center justify-between w-full relative z-20">
            <Link href="/">
              <Image 
                src="/BRAND891.png" 
                alt="WIPPEL" 
                width={88} 
                height={25} 
                quality={100}
              />
            </Link>
            
            <div className="flex items-center gap-4">
              {/* Language Switcher */}
              <div className="relative">
                <button 
                  onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
                  className="flex items-center gap-2 px-3 py-2 bg-white/10 hover:bg-white/20 rounded transition-all"
                >
                  <Globe className="w-4 h-4 text-white" />
                  <span className="text-sm font-semibold text-white">{lang.toUpperCase()}</span>
                  <ChevronDown className="w-4 h-4 text-white" />
                </button>
                {isLangMenuOpen && (
                  <div className="absolute right-0 top-full mt-2 bg-white border border-gray-200 rounded shadow-lg overflow-hidden min-w-[140px] z-50">
                    <button onClick={() => changeLang('en')} className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 transition-colors text-gray-900">English</button>
                    <button onClick={() => changeLang('fr')} className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 transition-colors text-gray-900">Français</button>
                    <button onClick={() => changeLang('ar')} className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 transition-colors text-gray-900">العربية</button>
                  </div>
                )}
              </div>
              <div className="text-xs font-bold uppercase tracking-wider text-white hidden sm:block">
                <Link href="/login" className="hover:underline">
                  {t('auth.login')}
                </Link>
              </div>
            </div>
          </div>

          {/* Main Form Content */}
          <div className="flex-1 flex items-center justify-center px-6 py-12 relative z-10">
            <div className="w-full max-w-md bg-white p-8 shadow-2xl" style={{ borderRadius: '4px' }}>
              <h1 className="text-2xl font-black text-center mb-6 text-gray-900 uppercase tracking-wide">
                {t('auth.registerTitle')}
              </h1>

              {error && (
                <div className="bg-black text-white px-4 py-3 mb-4 text-sm font-semibold flex items-center gap-2" style={{ borderRadius: '0' }}>
                  <span>⚠</span> {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-900 uppercase tracking-wider">
                    {t('auth.fullNameLabel')}
                  </label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder={t('auth.fullNamePlaceholder')}
                    required
                    className="w-full h-12 px-4 bg-gray-50 border-2 border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-[#8F001A] focus:ring-0 outline-none transition-all font-medium"
                    style={{ borderRadius: '2px' }}
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-900 uppercase tracking-wider">
                    {t('auth.workEmailLabel')}
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={t('auth.workEmailPlaceholder')}
                    required
                    className="w-full h-12 px-4 bg-gray-50 border-2 border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-[#8F001A] focus:ring-0 outline-none transition-all font-medium"
                    style={{ borderRadius: '2px' }}
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-900 uppercase tracking-wider">
                    {t('auth.passwordLabel')}
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={t('auth.passwordPlaceholder')}
                    required
                    className="w-full h-12 px-4 bg-gray-50 border-2 border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-[#8F001A] focus:ring-0 outline-none transition-all font-medium"
                    style={{ borderRadius: '2px' }}
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-900 uppercase tracking-wider">
                    {t('auth.confirmPasswordLabel')}
                  </label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className="w-full h-12 px-4 bg-gray-50 border-2 border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-[#8F001A] focus:ring-0 outline-none transition-all font-medium"
                    style={{ borderRadius: '2px' }}
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-[#8F001A] text-white h-12 font-bold uppercase tracking-wider hover:bg-[#6b0014] transition-colors mt-4 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                  style={{ borderRadius: '2px' }}
                >
                  {isLoading ? t('auth.creatingAccount') : t('auth.createAccount')}
                </button>

                <p className="text-xs text-gray-500 text-center leading-tight pt-2">
                  {t('auth.termsAgree')}
                </p>
              </form>

              <div className="mt-6 text-center">
                <p className="text-xs text-gray-600">
                  {t('auth.alreadyHaveAccount')}{" "}
                  <Link href="/login" className="text-[#8F001A] font-bold underline underline-offset-2 hover:text-[#6b0014]">
                    {t('auth.login')}
                  </Link>
                </p>
              </div>
            </div>
          </div>

          {/* Copyright Text at bottom of form side */}
          <div className="py-6 text-center relative z-10">
            <p className="text-xs text-white/40 font-medium tracking-wide uppercase">© {new Date().getFullYear()} WIPPEL. All rights reserved.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
