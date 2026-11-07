"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useTranslation } from "../context";
import { ChevronRight } from "lucide-react";

export default function ResetPassword() {
  const { t, lang, setLang } = useTranslation();
  const [step, setStep] = useState<'email' | 'code' | 'password'>('email');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);

  const changeLang = (l: 'en' | 'fr' | 'ar') => {
    setLang(l);
    setIsLangMenuOpen(false);
  };

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return 'Invalid email format';
    }
    return '';
  };

  const validatePassword = (pwd: string) => {
    if (pwd.length < 8) {
      return 'Password must be at least 8 characters';
    }
    if (!/[A-Z]/.test(pwd)) {
      return 'Password must contain at least one uppercase letter';
    }
    if (!/[0-9]/.test(pwd)) {
      return 'Password must contain at least one number';
    }
    if (!/[!@#$%^&*]/.test(pwd)) {
      return 'Password must contain at least one special character (!@#$%^&*)';
    }
    return '';
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const emailError = validateEmail(email);
    if (emailError) {
      setError(emailError);
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/auth/reset-password/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      if (response.ok) {
        setSuccess('Verification code sent to your email');
        setStep('code');
      } else {
        const data = await response.json();
        setError(data.message || 'Failed to send reset code');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCodeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!code || code.length !== 6) {
      setError('Please enter a valid 6-digit code');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/auth/reset-password/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code })
      });

      if (response.ok) {
        setSuccess('Code verified. Please set your new password.');
        setStep('password');
      } else {
        const data = await response.json();
        setError(data.message || 'Invalid verification code');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const passwordError = validatePassword(password);
    if (passwordError) {
      setError(passwordError);
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/auth/reset-password/confirm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code, password })
      });

      if (response.ok) {
        setSuccess('Password reset successfully! Redirecting to login...');
        setTimeout(() => {
          window.location.href = '/login';
        }, 2000);
      } else {
        const data = await response.json();
        setError(data.message || 'Failed to reset password');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#8F001A] flex flex-col">
      {/* Header */}
      <div className="bg-[#8F001A] py-4 px-4 flex items-center justify-end max-w-7xl mx-auto w-full">
        {/* Logo removed from here as per user request */}
        
        <div className="flex items-center gap-3">
          <div className="relative">
            <button 
              onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
              className="flex items-center gap-2 px-3 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-all"
            >
              <span className="text-sm font-semibold text-white">{lang.toUpperCase()}</span>
            </button>
            {isLangMenuOpen && (
              <div className="absolute right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                <button className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 transition-colors text-gray-900" onClick={() => changeLang('en')}>
                  English
                </button>
                <button className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 transition-colors text-gray-900" onClick={() => changeLang('fr')}>
                  Français
                </button>
                <button className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 transition-colors text-gray-900" onClick={() => changeLang('ar')}>
                  العربية
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-6 md:p-8">
          <h1 className="text-2xl md:text-3xl font-bold text-center mb-2 text-gray-900">
            Reset Password
          </h1>
          <p className="text-sm text-gray-600 text-center mb-6">
            {step === 'email' && 'Enter your wappil.com email to receive a reset code'}
            {step === 'code' && 'Enter the 6-digit code sent to your email'}
            {step === 'password' && 'Create a new secure password'}
          </p>

          {error && (
            <div className="bg-black text-white px-4 py-3 rounded mb-4 text-sm">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-100 text-green-800 px-4 py-3 rounded mb-4 text-sm">
              {success}
            </div>
          )}

          {step === 'email' && (
            <form onSubmit={handleEmailSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-900">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@wappil.com"
                  required
                  className="w-full h-11 px-4 bg-white border border-gray-300 rounded text-gray-900 focus:border-gray-400 focus:ring-0 outline-none transition-all text-sm"
                />
                <p className="text-xs text-gray-500">Must be a wappil.com email address</p>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#2563eb] text-white h-10 rounded font-semibold hover:bg-[#1d4ed8] transition-colors mt-4 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
              >
                {isLoading ? 'Sending...' : 'Send Reset Code'}
              </button>

              <div className="text-center mt-4">
                <p className="text-xs text-gray-600">
                  Remember your password?{" "}
                  <Link href="/login" className="text-gray-900 hover:underline font-semibold">
                    Sign in
                  </Link>
                </p>
              </div>
            </form>
          )}

          {step === 'code' && (
            <form onSubmit={handleCodeSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-900">
                  Verification Code
                </label>
                <input
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  placeholder="000000"
                  maxLength={6}
                  required
                  className="w-full h-11 px-4 bg-white border border-gray-300 rounded text-gray-900 focus:border-gray-400 focus:ring-0 outline-none transition-all text-sm text-center tracking-widest"
                />
                <p className="text-xs text-gray-500">Check your email for the 6-digit code</p>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#2563eb] text-white h-10 rounded font-semibold hover:bg-[#1d4ed8] transition-colors mt-4 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
              >
                {isLoading ? 'Verifying...' : 'Verify Code'}
              </button>

              <button
                type="button"
                onClick={() => setStep('email')}
                className="w-full text-[#2563eb] text-sm font-semibold hover:underline"
              >
                Use different email
              </button>
            </form>
          )}

          {step === 'password' && (
            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-900">
                  New Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full h-11 px-4 bg-white border border-gray-300 rounded text-gray-900 focus:border-gray-400 focus:ring-0 outline-none transition-all text-sm"
                />
                <p className="text-xs text-gray-500">
                  At least 8 characters, 1 uppercase, 1 number, 1 special character
                </p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-900">
                  Confirm Password
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full h-11 px-4 bg-white border border-gray-300 rounded text-gray-900 focus:border-gray-400 focus:ring-0 outline-none transition-all text-sm"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#2563eb] text-white h-10 rounded font-semibold hover:bg-[#1d4ed8] transition-colors mt-4 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
              >
                {isLoading ? 'Resetting...' : 'Reset Password'}
              </button>
            </form>
          )}
        </div>
      </div>

      {/* Footer — Black background for auth pages */}
      <footer className="py-8 text-center bg-black relative z-10 border-t border-white/10" style={{ fontFamily: '"IBM Plex Sans", sans-serif' }}>
        <div className="container mx-auto px-4 flex flex-col items-center gap-6">
          <Image 
            src="/BRAND891.png" 
            alt="WIPPEL" 
            width={88} 
            height={25} 
            style={{ opacity: 0.8 }} 
            quality={100}
          />
          <div className="flex justify-center gap-6 text-sm">
            <Link href="/terms" className="text-white hover:text-white/80 font-bold underline underline-offset-4 tracking-tight">Read Terms & Conditions</Link>
            <Link href="/privacy" className="text-white/70 hover:text-white transition-colors">Privacy Policy</Link>
          </div>
          <p className="text-xs text-white/40 font-medium tracking-wide uppercase">© {new Date().getFullYear()} WIPPEL. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
