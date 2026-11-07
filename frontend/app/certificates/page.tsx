"use client";

import { useState } from "react";
import Link from "next/link";
import { FileText, Download, ExternalLink, Award, ChevronRight, Search } from "lucide-react";

const certifications = [
  {
    Title: "CDE Certification Completion (2026)",
    Organization: "CDE (https://cde.nesda.dz/)",
    IssueDate: "2026",
    Slug: "cde-certification-completion-2026",
    PDF: "/static/certificates/cde-certification-completion.pdf"
  },
  {
    Title: "Certified Algerian Startup - KETTOBI",
    Organization: "UFC-Technical English Startup-2025 (ufc.dz)",
    IssueDate: "2025",
    Slug: "certified-algerian-startup-kettobi",
    PDF: ""
  },
  {
    Title: "Marketing Digital Certification (2024)",
    Organization: "Coursera Platform (coursera.org)",
    IssueDate: "2024",
    Slug: "marketing-digital-certification-2024",
    PDF: ""
  },
  {
    Title: "Label Project Innovate 2025",
    Organization: "Minister economic Algeria (startup.dz)",
    IssueDate: "2025",
    Slug: "label-project-innovate-2025",
    PDF: "/static/certificates/Label project innovant.pdf"
  },
  {
    Title: "Master's degree in Computer Science (2021)",
    Organization: "University of Mostaganem, MI Department",
    IssueDate: "2021",
    Slug: "master-s-degree-in-computer-science-2021",
    PDF: "/static/certificates/Master Computer Science.pdf"
  },
  {
    Title: "NESDA – Certificate of Completion",
    Organization: "NESDA",
    IssueDate: "2025",
    Slug: "nesda-certificate-of-completion",
    PDF: "/static/certificates/nesda-certificate-of-completion.pdf"
  },
  {
    Title: "EOL_Certificate",
    Organization: "Eollinea",
    IssueDate: "2025",
    Slug: "eol-certificate",
    PDF: "/static/certificates/EOL_Certificate.pdf"
  }
];

export default function Certificates() {
  const [selectedCert, setSelectedCert] = useState(certifications[0]);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredCerts = certifications.filter(cert => 
    cert.Title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    cert.Organization.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-surface-50 min-h-screen py-12 md:py-20">
      <div className="container max-w-[1200px] space-y-8">
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 bg-white p-8 rounded-[32px] border border-black/10 shadow-sm">
          <div className="space-y-2">
            <div className="flex items-center gap-3 text-brand-600">
              <Award className="w-8 h-8" />
              <h1 className="text-4xl font-black text-ink tracking-tight">Certifications</h1>
            </div>
            <p className="text-lg font-bold text-muted">A collection of my academic and professional achievements.</p>
          </div>
          <Link 
            href="/cv" 
            className="bg-black text-white px-8 py-3.5 rounded-2xl font-black text-sm uppercase tracking-widest flex items-center gap-3 hover:bg-brand-600 hover:-translate-y-1 transition-all shadow-lg"
          >
            <Download className="w-4 h-4" />
            Download CV
          </Link>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Sidebar */}
          <aside className="lg:col-span-4 space-y-6">
            <div className="bg-white p-6 rounded-[32px] border border-black/10 shadow-sm space-y-6">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                <input 
                  type="text" 
                  placeholder="Search certificates..."
                  className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-surface-50 border-none text-sm font-bold focus:ring-2 focus:ring-brand-600/20 transition-all"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <h2 className="text-[11px] font-black text-muted uppercase tracking-widest px-2">Achievement List</h2>
                <div className="space-y-1">
                  {filteredCerts.map((cert) => (
                    <button
                      key={cert.Slug}
                      onClick={() => setSelectedCert(cert)}
                      className={`w-full text-left p-4 rounded-2xl transition-all flex items-center justify-between group ${
                        selectedCert.Slug === cert.Slug 
                          ? "bg-brand-600 text-white shadow-lg shadow-brand-600/20" 
                          : "hover:bg-black/5 text-ink"
                      }`}
                    >
                      <div className="space-y-0.5">
                        <div className="text-[13px] font-black leading-tight">{cert.Title}</div>
                        <div className={`text-[10px] font-bold uppercase tracking-wider ${
                          selectedCert.Slug === cert.Slug ? "text-white/70" : "text-muted"
                        }`}>
                          {cert.IssueDate}
                        </div>
                      </div>
                      <ChevronRight className={`w-4 h-4 transition-transform ${
                        selectedCert.Slug === cert.Slug ? "translate-x-1" : "opacity-0 group-hover:opacity-100"
                      }`} />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="lg:col-span-8">
            <div className="bg-white p-8 md:p-12 rounded-[40px] border border-black/10 shadow-sm h-full flex flex-col gap-8">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-1.5">
                  <div className="inline-block px-3 py-1 bg-brand-50 rounded-full text-[10px] font-black text-brand-600 uppercase tracking-widest">
                    Credential Preview
                  </div>
                  <h2 className="text-2xl font-black text-ink leading-tight">{selectedCert.Title}</h2>
                  <p className="text-sm font-bold text-muted">{selectedCert.Organization}</p>
                </div>

                {selectedCert.PDF && (
                  <div className="flex gap-3">
                    <a 
                      href={selectedCert.PDF} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="p-3 bg-surface-50 rounded-xl text-ink hover:bg-black hover:text-white transition-all border border-black/5"
                    >
                      <ExternalLink className="w-5 h-5" />
                    </a>
                    <a 
                      href={selectedCert.PDF} 
                      download
                      className="p-3 bg-surface-50 rounded-xl text-ink hover:bg-black hover:text-white transition-all border border-black/5"
                    >
                      <Download className="w-5 h-5" />
                    </a>
                  </div>
                )}
              </div>

              {selectedCert.PDF ? (
                <div className="flex-grow min-h-[600px] bg-surface-50 rounded-[24px] overflow-hidden border border-black/5 relative">
                  <iframe 
                    src={selectedCert.PDF} 
                    className="w-full h-full absolute inset-0"
                    title={selectedCert.Title}
                  />
                </div>
              ) : (
                <div className="flex-grow min-h-[400px] bg-surface-50 rounded-[24px] border-2 border-dashed border-black/10 flex flex-col items-center justify-center text-center p-12 space-y-4">
                  <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-sm">
                    <FileText className="w-10 h-10 text-muted/30" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-black text-ink">Preview not available</h3>
                    <p className="text-sm font-bold text-muted max-w-[300px]">
                      The PDF document for this certification is currently being processed or not yet uploaded.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}