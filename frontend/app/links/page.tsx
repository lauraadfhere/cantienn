"use client";

import Link from "next/link";
import { Linkedin, Globe, ExternalLink, Mail, MessageSquare, Twitter, Github, Instagram } from "lucide-react";

export default function Links() {
  const socialLinks = [
    {
      name: "LinkedIn",
      href: "https://linkedin.com/in/belhachemia-mohammed-i",
      icon: <Linkedin className="w-5 h-5" />,
      color: "bg-[#0077b5]",
      label: "Personal Profile"
    },
    {
      name: "Company LinkedIn",
      href: "https://www.linkedin.com/company/eollinea-com/",
      icon: <Linkedin className="w-5 h-5" />,
      color: "bg-[#0077b5]",
      label: "Eollinea Official"
    },
    {
      name: "Github",
      href: "https://github.com/ibrahim-mohammed-fr",
      icon: <Github className="w-5 h-5" />,
      color: "bg-[#333]",
      label: "Code & Projects"
    }
  ];

  const webLinks = [
    {
      name: "Eollinea.me",
      href: "https://eollinea.me",
      icon: <Globe className="w-5 h-5" />,
      desc: "Official Portfolio & Agency Website"
    },
    {
      name: "Pulse-In.com",
      href: "https://pulse-in.com",
      icon: <Globe className="w-5 h-5" />,
      desc: "AI & IoT Solutions Platform"
    },
    {
      name: "Ielivate.com",
      href: "https://ielivate.com",
      icon: <Globe className="w-5 h-5" />,
      desc: "Educational Technology Hub"
    }
  ];

  return (
    <div className="bg-surface-50 min-h-screen py-20 flex flex-col items-center">
      <div className="container max-w-[600px] space-y-12">
        <header className="text-center space-y-4">
          <div className="w-24 h-24 bg-accent-500 rounded-[32px] mx-auto flex items-center justify-center shadow-xl shadow-accent-500/20 border border-white/20">
            <span className="text-4xl font-black text-ink">W</span>
          </div>
          <div className="space-y-2">
            <h1 className="text-3xl font-black text-ink tracking-tight">WIPPEL Connect</h1>
            <p className="text-base font-bold text-muted uppercase tracking-widest">Profiles & Websites</p>
          </div>
        </header>

        <div className="space-y-10">
          <section className="space-y-4">
            <h2 className="text-[11px] font-black text-muted uppercase tracking-[0.2em] px-4">Social Profiles</h2>
            <div className="grid gap-3">
              {socialLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white border border-black/10 p-5 rounded-3xl flex items-center justify-between group hover:shadow-xl hover:-translate-y-1 transition-all"
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 ${link.color} text-white rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                      {link.icon}
                    </div>
                    <div>
                      <div className="text-base font-black text-ink">{link.name}</div>
                      <div className="text-xs font-bold text-muted uppercase tracking-wider">{link.label}</div>
                    </div>
                  </div>
                  <ExternalLink className="w-4 h-4 text-muted opacity-0 group-hover:opacity-100 transition-opacity" />
                </a>
              ))}
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-[11px] font-black text-muted uppercase tracking-[0.2em] px-4">Our Ecosystem</h2>
            <div className="grid gap-3">
              {webLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white border border-black/10 p-5 rounded-3xl flex items-center justify-between group hover:shadow-xl hover:-translate-y-1 transition-all"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-surface-50 text-ink rounded-2xl flex items-center justify-center border border-black/5 group-hover:bg-brand-600 group-hover:text-white transition-all">
                      {link.icon}
                    </div>
                    <div>
                      <div className="text-base font-black text-ink">{link.name}</div>
                      <div className="text-xs font-bold text-muted">{link.desc}</div>
                    </div>
                  </div>
                  <ExternalLink className="w-4 h-4 text-muted opacity-0 group-hover:opacity-100 transition-opacity" />
                </a>
              ))}
            </div>
          </section>

          <footer className="pt-8 text-center space-y-8">
            <div className="flex justify-center gap-4">
              <Link
                href="/contact"
                className="bg-black text-accent-500 px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-widest flex items-center gap-3 hover:bg-brand-600 hover:text-white transition-all shadow-xl"
              >
                <Mail className="w-4 h-4" />
                Get in Touch
              </Link>
            </div>
            <p className="text-[10px] font-black text-muted uppercase tracking-widest">© 2026 WIPPEL · ALL RIGHTS RESERVED</p>
          </footer>
        </div>
      </div>
    </div>
  );
}