"use client";

import Link from "next/link";
import { CreditCard, RotateCcw, ShieldCheck, Handshake, ChevronLeft, Mail, Home } from "lucide-react";

export default function Policies() {
  const policies = [
    {
      title: "Payment Policy",
      icon: <CreditCard className="w-8 h-8 text-emerald-600" />,
      content: (
        <>
          <p>We aim to make the payment process as smooth as possible for our clients. Our standard payment structure for web development projects is as follows:</p>
          <ul className="list-disc pl-6 mt-6 space-y-4">
            <li><strong>Deposit:</strong> A 50% upfront deposit is required to initiate any project. This secures your spot in our development queue.</li>
            <li><strong>Milestones:</strong> For larger projects, payments may be divided into specific milestones (e.g., Design Approval, Beta Launch).</li>
            <li><strong>Final Payment:</strong> The remaining balance is due upon project completion and before the final transfer of ownership or deployment to your production environment.</li>
            <li><strong>Methods:</strong> We accept payments via Bank Transfer, Wise, and local payment methods (DZD).</li>
          </ul>
        </>
      )
    },
    {
      title: "Refund Policy",
      icon: <RotateCcw className="w-8 h-8 text-emerald-600" />,
      content: (
        <>
          <p>We strive for 100% client satisfaction. However, due to the nature of custom digital services, our refund policy is as follows:</p>
          <ul className="list-disc pl-6 mt-6 space-y-4">
            <li><strong>Before Work Starts:</strong> If you cancel before any development or design work has begun, you are eligible for a full refund of your deposit (minus any transaction fees).</li>
            <li><strong>During Development:</strong> If a project is cancelled during the development phase, the deposit is non-refundable to cover the time and resources already allocated.</li>
            <li><strong>After Completion:</strong> Once a project is completed and delivered, no refunds will be issued.</li>
            <li><strong>3D Printing:</strong> For 3D printing services, once the printing process has started, refunds are not available. If a print arrives damaged, we will offer a free reprint.</li>
          </ul>
        </>
      )
    },
    {
      title: "Service Level Agreement (SLA)",
      icon: <ShieldCheck className="w-8 h-8 text-emerald-600" />,
      content: (
        <>
          <p>We commit to delivering high-quality, bug-free web platforms. All projects include:</p>
          <ul className="list-disc pl-6 mt-6 space-y-4">
            <li><strong>Support:</strong> 30 days of free technical support after deployment for any bugs or issues related to the initial scope.</li>
            <li><strong>Revisions:</strong> Each package includes a specific number of revision rounds as defined in your quote.</li>
            <li><strong>Communication:</strong> We respond to all client inquiries within 24 hours during business days.</li>
          </ul>
        </>
      )
    },
    {
      title: "Intellectual Property",
      icon: <Handshake className="w-8 h-8 text-emerald-600" />,
      content: (
        <p className="mt-4">
          Upon receipt of full payment, you own the full rights to the custom code, designs, and content created specifically for your project. We reserve the right to display the completed work in our portfolio unless a Non-Disclosure Agreement (NDA) is signed.
        </p>
      )
    }
  ];

  return (
    <div className="bg-surface-50 min-h-screen py-12 md:py-24">
      <div className="container max-w-[900px] space-y-12">
        <header className="space-y-4 text-center md:text-left">
          <Link 
            href="/" 
            className="inline-flex items-center gap-2 text-sm font-black text-muted hover:text-ink transition-colors uppercase tracking-widest"
          >
            <ChevronLeft className="w-4 h-4" />
            Back to Home
          </Link>
          <h1 className="text-4xl md:text-5xl font-black text-ink tracking-tight">Policies & Terms</h1>
          <p className="text-lg font-bold text-muted max-w-2xl leading-relaxed">
            Transparency and trust are at the core of our business. Please review our service policies below.
          </p>
        </header>

        <div className="bg-white p-8 md:p-16 rounded-[40px] border border-black/10 shadow-sm space-y-16">
          <div className="space-y-20">
            {policies.map((policy) => (
              <section key={policy.title} className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-emerald-50 rounded-[20px] flex items-center justify-center border border-emerald-100 shadow-sm">
                    {policy.icon}
                  </div>
                  <h2 className="text-2xl md:text-3xl font-black text-ink tracking-tight">{policy.title}</h2>
                </div>
                <div className="text-base md:text-lg font-bold text-muted leading-relaxed">
                  {policy.content}
                </div>
              </section>
            ))}
          </div>

          <div className="pt-16 border-t border-black/5 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="space-y-1 text-center md:text-left">
              <p className="text-sm font-black text-muted uppercase tracking-widest">Last updated</p>
              <p className="text-base font-bold text-ink">April 2, 2026</p>
            </div>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link 
                href="/contact" 
                className="bg-brand-600 text-white px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-widest flex items-center gap-3 hover:bg-brand-700 hover:-translate-y-1 transition-all shadow-lg shadow-brand-600/20"
              >
                <Mail className="w-5 h-5" />
                Have Questions?
              </Link>
              <Link 
                href="/" 
                className="bg-surface-50 border border-black/10 text-ink px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-widest flex items-center gap-3 hover:bg-black hover:text-white hover:-translate-y-1 transition-all shadow-sm"
              >
                <Home className="w-5 h-5" />
                Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}