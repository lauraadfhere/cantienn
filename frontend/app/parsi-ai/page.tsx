"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Send, ArrowRight, Sparkles, Lightbulb, Target, CheckCircle, AlertCircle } from "lucide-react";
import { useTranslation } from "../context";

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface ConsultationStep {
  id: string;
  title: string;
  completed: boolean;
  icon: React.ReactNode;
}

export default function ParsiAI() {
  const { t, lang } = useTranslation();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: t('parsiAI.welcome') || "Welcome to ParsiAI Engine! I'm your intelligent project consultant. I'll help you evaluate, refine, and perfect your project idea before submission. Tell me about your project idea, and I'll guide you through making the right decisions.",
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const [consultationSteps, setConsultationSteps] = useState<ConsultationStep[]>([
    { id: '1', title: t('parsiAI.step1'), completed: false, icon: <Lightbulb className="w-5 h-5" /> },
    { id: '2', title: t('parsiAI.step2'), completed: false, icon: <Target className="w-5 h-5" /> },
    { id: '3', title: t('parsiAI.step3'), completed: false, icon: <Sparkles className="w-5 h-5" /> },
    { id: '4', title: t('parsiAI.step4'), completed: false, icon: <CheckCircle className="w-5 h-5" /> },
  ]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const generateAIResponse = async (userMessage: string): Promise<string> => {
    try {
      const history = messages
        .filter(msg => msg.id !== '1')
        .map(msg => ({ role: msg.role, content: msg.content }));

      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage,
          history: history
        }),
      });

      const text = await response.text();
      let data: { success?: boolean; message?: string; error?: string } = {};
      try {
        data = text ? JSON.parse(text) : {};
      } catch {
        throw new Error(response.ok ? 'AI service returned an invalid response' : text || 'AI request failed');
      }

      if (!response.ok) {
        throw new Error(data.error || data.message || `AI request failed (${response.status})`);
      }

      if (data.success && data.message) {
        // Update consultation steps based on conversation progress
        const totalMessages = messages.length + 1;
        if (totalMessages >= 3) {
          setConsultationSteps(prev => {
            const updated = [...prev];
            updated[0].completed = true;
            return updated;
          });
        }
        if (totalMessages >= 5) {
          setConsultationSteps(prev => {
            const updated = [...prev];
            updated[1].completed = true;
            return updated;
          });
        }
        if (totalMessages >= 7) {
          setConsultationSteps(prev => {
            const updated = [...prev];
            updated[2].completed = true;
            return updated;
          });
        }
        if (totalMessages >= 9) {
          setConsultationSteps(prev => {
            const updated = [...prev];
            updated[3].completed = true;
            return updated;
          });
        }

        return data.message;
      } else {
        throw new Error(data.error || 'Failed to get AI response');
      }
    } catch (error) {
      console.error('AI Error:', error);
      return "I apologize, but I'm having trouble connecting to my AI service right now. Please try again in a moment. If this persists, please contact support.";
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    // Call real AI API
    const aiResponseText = await generateAIResponse(input);
    
    const aiResponse: Message = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: aiResponseText,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, aiResponse]);
    setIsTyping(false);
  };

  return (
    <>
      {/* Header Section - Same as Home */}
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
                  src="/images/logo2.png" 
                  alt="WIPPEL" 
                  width={240} 
                  height={68} 
                  style={{ width: 'auto', height: '68px', objectFit: 'contain' }} 
                  quality={100}
                />
              </Link>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '16px', fontWeight: 400, letterSpacing: '1.5px', textTransform: 'uppercase', color: 'rgba(255,255,255,0.85)', marginBottom: '4px' }}>
                {t('parsiAI.title')}
              </div>
              <div style={{ fontSize: '28px', fontWeight: 500, letterSpacing: '-0.5px', color: '#ffffff' }}>
                {t('parsiAI.subtitle')}
              </div>
            </div>
          </div>
          
          <div style={{ height: '1px', background: 'rgba(255,255,255,0.3)', marginBottom: '20px' }} />
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '28px', flexWrap: 'wrap', fontSize: '14px' }}>
              <Link href="/order" style={{ color: '#ffffff', textDecoration: 'none', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '8px', transition: 'all 300ms ease' }}>
                <Sparkles className="w-4 h-4" /> {t('home.cta.primary')}
                <ArrowRight className="w-4 h-4" style={{ transform: 'rotate(-45deg)' }} />
              </Link>
              <Link href="/services" style={{ color: '#ffffff', textDecoration: 'none', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '8px', transition: 'all 300ms ease' }}>
                <Target className="w-4 h-4" /> {t('home.cta.secondary')}
                <ArrowRight className="w-4 h-4" style={{ transform: 'rotate(-45deg)' }} />
              </Link>
            </div>
            <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.7)', fontWeight: 400 }}>
              {t('parsiAI.tagline')}
            </span>
          </div>
        </div>
      </section>

      {/* Main Chat Section */}
      <section style={{ 
        position: 'relative', 
        overflow: 'hidden', 
        background: '#000',
        backgroundImage: 'linear-gradient(to bottom, rgba(0,0,0,0.7), rgba(0,0,0,0.9)), url("/images/WALL.png")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        padding: '80px 0',
        minHeight: 'calc(100vh - 200px)'
      }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 50% 50%, transparent 0%, rgba(0,0,0,0.5) 100%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '80%', height: '60%', background: 'rgba(143, 0, 26, 0.08)', filter: 'blur(120px)', borderRadius: '50%', pointerEvents: 'none', opacity: 0.3 }} />

        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 40px', position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: '32px', alignItems: 'start' }}>
            
            {/* Sidebar - Consultation Steps */}
            <div style={{ 
              background: 'rgba(255, 255, 255, 0.95)', 
              backdropFilter: 'blur(20px)', 
              borderRadius: '16px', 
              padding: '24px',
              boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
              position: 'sticky',
              top: '24px'
            }}>
              <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#111', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Sparkles className="w-5 h-5" style={{ color: '#8F001A' }} />
                {t('parsiAI.process')}
              </h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {consultationSteps.map((step, index) => (
                  <div 
                    key={step.id}
                    style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '12px', 
                      padding: '12px',
                      borderRadius: '8px',
                      background: step.completed ? 'rgba(143, 0, 26, 0.08)' : 'rgba(0,0,0,0.03)',
                      border: step.completed ? '1px solid rgba(143, 0, 26, 0.2)' : '1px solid rgba(0,0,0,0.08)',
                      transition: 'all 300ms ease'
                    }}
                  >
                    <div style={{ 
                      width: '32px', 
                      height: '32px', 
                      borderRadius: '8px', 
                      background: step.completed ? '#8F001A' : 'rgba(0,0,0,0.1)',
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      color: step.completed ? '#fff' : '#666'
                    }}>
                      {step.completed ? <CheckCircle className="w-4 h-4" /> : step.icon}
                    </div>
                    <div>
                      <div style={{ fontSize: '13px', fontWeight: 700, color: step.completed ? '#8F001A' : '#333' }}>
                        {step.title}
                      </div>
                      <div style={{ fontSize: '11px', color: '#666' }}>
                        {step.completed ? t('parsiAI.completed') : `Step ${index + 1}`}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ marginTop: '24px', padding: '16px', background: 'rgba(143, 0, 26, 0.05)', borderRadius: '8px', border: '1px solid rgba(143, 0, 26, 0.1)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <Lightbulb className="w-4 h-4" style={{ color: '#8F001A' }} />
                  <span style={{ fontSize: '12px', fontWeight: 700, color: '#8F001A' }}>{t('parsiAI.proTip')}</span>
                </div>
                <p style={{ fontSize: '12px', color: '#555', lineHeight: '1.5', margin: 0 }}>
                  {t('parsiAI.proTipText')}
                </p>
              </div>
            </div>

            {/* Chat Interface */}
            <div style={{ 
              background: 'rgba(255, 255, 255, 0.98)', 
              backdropFilter: 'blur(30px)', 
              borderRadius: '20px', 
              boxShadow: '0 40px 100px -15px rgba(0,0,0,0.2)',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              height: '600px'
            }}>
              {/* Chat Header */}
              <div style={{ 
                padding: '20px 24px', 
                borderBottom: '1px solid rgba(0,0,0,0.08)',
                background: 'rgba(143, 0, 26, 0.02)',
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
              }}>
                <div style={{ 
                  width: '40px', 
                  height: '40px', 
                  borderRadius: '12px', 
                  background: 'linear-gradient(135deg, #8F001A 0%, #6b0014 100%)',
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center'
                }}>
                  <Sparkles className="w-5 h-5" style={{ color: '#fff' }} />
                </div>
                <div>
                  <div style={{ fontSize: '16px', fontWeight: 800, color: '#111' }}>{t('parsiAI.consultant')}</div>
                  <div style={{ fontSize: '12px', color: '#059669', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <span style={{ width: '6px', height: '6px', background: '#059669', borderRadius: '50%' }} />
                    {t('parsiAI.online')}
                  </div>
                </div>
              </div>

              {/* Messages Area */}
              <div style={{ 
                flex: 1, 
                overflowY: 'auto', 
                padding: '24px',
                display: 'flex',
                flexDirection: 'column',
                gap: '16px'
              }}>
                {messages.map((message) => (
                  <div
                    key={message.id}
                    style={{
                      display: 'flex',
                      gap: '12px',
                      alignItems: 'flex-start',
                      ...(message.role === 'user' ? { flexDirection: 'row-reverse' } : {})
                    }}
                  >
                    <div style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '10px',
                      background: message.role === 'user' ? '#111' : 'linear-gradient(135deg, #8F001A 0%, #6b0014 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}>
                      {message.role === 'user' ? (
                        <span style={{ fontSize: '14px', fontWeight: 700, color: '#fff' }}>U</span>
                      ) : (
                        <Sparkles className="w-4 h-4" style={{ color: '#fff' }} />
                      )}
                    </div>
                    <div style={{
                      maxWidth: '70%',
                      padding: '14px 18px',
                      borderRadius: '12px',
                      background: message.role === 'user' ? '#111' : 'rgba(143, 0, 26, 0.08)',
                      color: message.role === 'user' ? '#fff' : '#111',
                      fontSize: '14px',
                      lineHeight: '1.6',
                      whiteSpace: 'pre-wrap',
                      ...(message.role === 'user' ? { borderBottomRightRadius: '4px' } : { borderBottomLeftRadius: '4px' })
                    }}>
                      {message.content}
                    </div>
                  </div>
                ))}
                
                {isTyping && (
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                    <div style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '10px',
                      background: 'linear-gradient(135deg, #8F001A 0%, #6b0014 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <Sparkles className="w-4 h-4" style={{ color: '#fff' }} />
                    </div>
                    <div style={{
                      padding: '14px 18px',
                      borderRadius: '12px',
                      background: 'rgba(143, 0, 26, 0.08)',
                      display: 'flex',
                      gap: '4px',
                      alignItems: 'center'
                    }}>
                      <span style={{ 
                        width: '8px', 
                        height: '8px', 
                        background: '#8F001A', 
                        borderRadius: '50%',
                        animation: 'bounce 1.4s infinite ease-in-out both'
                      }} />
                      <span style={{ 
                        width: '8px', 
                        height: '8px', 
                        background: '#8F001A', 
                        borderRadius: '50%',
                        animation: 'bounce 1.4s infinite ease-in-out both',
                        animationDelay: '0.16s'
                      }} />
                      <span style={{ 
                        width: '8px', 
                        height: '8px', 
                        background: '#8F001A', 
                        borderRadius: '50%',
                        animation: 'bounce 1.4s infinite ease-in-out both',
                        animationDelay: '0.32s'
                      }} />
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <form 
                onSubmit={handleSendMessage}
                style={{ 
                  padding: '20px 24px', 
                  borderTop: '1px solid rgba(0,0,0,0.08)',
                  background: 'rgba(255,255,255,0.5)',
                  display: 'flex',
                  gap: '12px',
                  alignItems: 'center'
                }}
              >
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={t('parsiAI.placeholder')}
                  style={{
                    flex: 1,
                    padding: '14px 18px',
                    borderRadius: '10px',
                    border: '2px solid rgba(0,0,0,0.1)',
                    background: '#fff',
                    fontSize: '14px',
                    outline: 'none',
                    transition: 'border-color 200ms ease'
                  }}
                  onFocus={(e) => e.currentTarget.style.borderColor = '#8F001A'}
                  onBlur={(e) => e.currentTarget.style.borderColor = 'rgba(0,0,0,0.1)'}
                />
                <button
                  type="submit"
                  disabled={!input.trim() || isTyping}
                  style={{
                    width: '50px',
                    height: '50px',
                    borderRadius: '10px',
                    background: input.trim() && !isTyping ? '#8F001A' : 'rgba(0,0,0,0.1)',
                    border: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: input.trim() && !isTyping ? 'pointer' : 'not-allowed',
                    transition: 'all 200ms ease'
                  }}
                >
                  <Send className="w-5 h-5" style={{ color: input.trim() && !isTyping ? '#fff' : '#666' }} />
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        background: '#ffffff',
        borderTop: '1px solid rgba(0, 0, 0, 0.08)',
        padding: '60px 40px',
        textAlign: 'center'
      }}>
        <div style={{
          marginBottom: '32px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '12px'
        }}>
          <Image 
            src="/images/logo2.png" 
            alt="WIPPEL" 
            width={240} 
            height={68} 
            quality={100}
          />
          <p style={{
            fontSize: '13px',
            color: 'rgba(0, 0, 0, 0.65)',
            fontWeight: 500,
            margin: 0
          }}>
            {t('parsiAI.footer')}
          </p>
        </div>
        <p style={{
          fontSize: '14px',
          color: 'rgba(0, 0, 0, 0.7)',
          lineHeight: '1.8',
          maxWidth: '700px',
          margin: '0 auto'
        }}>
          {t('parsiAI.footerText')}
        </p>
      </footer>

      <style jsx global>{`
        @keyframes bounce {
          0%, 80%, 100% { transform: scale(0); }
          40% { transform: scale(1); }
        }
      `}</style>
    </>
  );
}
