"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { 
  Download, 
  Linkedin, 
  Mail, 
  Phone, 
  Award, 
  Printer, 
  Globe, 
  Link as LinkIcon, 
  Bolt, 
  Leaf,
  ArrowUpRight,
  MapPin,
  Calendar,
  User
} from "lucide-react";
import { useTranslation } from "../context";

interface CVData {
  Name: string;
  Title: string;
  BirthDate: string;
  Nationality: string;
  Address: string;
  Location: string;
  Phone: string;
  Email: string;
  Contact: Record<string, string>;
  Skills: string[];
  Languages: string[];
  Links: string[];
  Profile: string[];
  WorkExperience: any[];
  Projects: any[];
  Certifications: any[];
  Education: any[];
  Volunteering: any[];
}

export default function CV() {
  const { t } = useTranslation();
  const [cv, setCv] = useState<CVData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/cv")
      .then(res => res.json())
      .then(data => {
        setCv(data);
        setLoading(false);
      })
      .catch(() => {
        // Fallback mock data
        setCv({
          Name: "WIPPEL",
          Title: "Web Platforms · Startup Solutions",
          BirthDate: "1990",
          Nationality: "Algerian",
          Address: "Algeria",
          Location: "Algeria",
          Phone: "+213 000 000 000",
          Email: "contact@wippel.com",
          Contact: {
            LinkedIn: "https://linkedin.com",
            Company: "https://linkedin.com/company/wippel",
            CVWebsite: "https://eollinea.me"
          },
          Skills: ["Next.js", "React", "Go", "Gin", "Appwrite", "Cloudinary", "UI/UX", "Scalable Systems"],
          Languages: ["English (Professional)", "French (Professional)", "Arabic (Native)"],
          Links: ["https://github.com/wippel"],
          Profile: ["From idea to production-ready web platforms. Fast, secure, and scalable websites and applications."],
          WorkExperience: [
            {
              Title: "Lead Developer",
              Period: "2020 - Present",
              Company: "WIPPEL",
              Details: ["Leading web platform development for startups.", "Building scalable backends with Go and Gin.", "Modern frontends with Next.js and React."]
            }
          ],
          Projects: [],
          Certifications: [],
          Education: [],
          Volunteering: []
        });
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="text-center py-20">Loading CV...</div>;
  if (!cv) return <div className="text-center py-20">CV not found.</div>;

  return (
    <section className="cv-page py-10 bg-gray-50 min-h-screen">
      <div className="container">
        <article className="cv-paper bg-white shadow-xl border border-gray-200 overflow-hidden" style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <header className="cv-head p-8 border-b border-gray-100 flex flex-col md:flex-row justify-between gap-8 bg-white">
            <div className="cv-head-left flex-1">
              <div className="cv-profile-pic mb-4">
                <Image 
                  className="cv-profile-img border-2 border-black" 
                  src="/images/profile-pic.png" 
                  alt={cv.Name} 
                  width={84} 
                  height={84} 
                  priority
                />
              </div>
              <h1 className="cv-name text-3xl font-black mb-1">{cv.Name}</h1>
              <div className="cv-role text-xl font-bold text-brand-600 mb-3">{cv.Title}</div>
              <div className="cv-sub text-sm font-bold text-gray-500 uppercase tracking-wider">
                BIRTH-DATE: {cv.BirthDate} / {cv.Nationality} · {cv.Address}
              </div>
            </div>
            <div className="cv-head-right flex flex-col gap-2 min-w-[200px]">
              <a className="btn btn-primary w-full justify-start gap-2" href="/download/resume.pdf" target="_blank">
                <Download size={16} /> Download Resume
              </a>
              <div className="grid grid-cols-1 gap-1 mt-2">
                <ContactLink href={cv.Contact.LinkedIn} icon={<Linkedin size={14} />} label="LinkedIn" />
                <ContactLink href={cv.Contact.Company} icon={<Linkedin size={14} />} label="Company" />
                <ContactLink href={`mailto:${cv.Email}`} icon={<Mail size={14} />} label="Email" />
                <ContactLink href={`tel:${cv.Phone}`} icon={<Phone size={14} />} label="Call" />
                <ContactLink href="/certificates" icon={<Award size={14} />} label="Certificates" />
                <button className="cv-contact-link flex items-center gap-2 p-2 hover:bg-gray-50 font-bold text-sm" onClick={() => window.print()}>
                  <Printer size={14} /> Print
                </button>
              </div>
            </div>
          </header>

          <div className="cv-columns flex flex-col md:flex-row">
            <aside className="cv-left w-full md:w-1/3 p-8 bg-gray-50 border-r border-gray-100">
              <CVBlock title="Contact">
                <div className="cv-mini flex flex-col gap-2 mb-6">
                  <MiniRow label="Location" value={cv.Location} />
                  <MiniRow label="Address" value={cv.Address} />
                  <MiniRow label="Phone" value={cv.Phone} />
                  <MiniRow label="Email" value={cv.Email} />
                </div>
                <div className="cv-links flex flex-col gap-2">
                  <SidebarLink href={cv.Contact.CVWebsite} icon={<Globe size={14} />} label="eollinea.me" />
                  <SidebarLink href={cv.Contact.CVCareer} icon={<LinkIcon size={14} />} label="cv-carrer" />
                  <SidebarLink href={cv.Contact.Pulse} icon={<Bolt size={14} />} label="pulse-in" />
                  <SidebarLink href={cv.Contact.Ielivate} icon={<Leaf size={14} />} label="ielivate" />
                </div>
              </CVBlock>

              <CVBlock title="Core Skills">
                <ul className="cv-bullets list-disc list-inside font-bold text-sm text-gray-700 flex flex-col gap-1">
                  {cv.Skills.map(skill => <li key={skill}>{skill}</li>)}
                </ul>
              </CVBlock>

              <CVBlock title="Languages">
                <ul className="cv-bullets list-disc list-inside font-bold text-sm text-gray-700 flex flex-col gap-1">
                  {cv.Languages.map(lang => <li key={lang}>{lang}</li>)}
                </ul>
              </CVBlock>
            </aside>

            <main className="cv-right w-full md:w-2/3 p-8">
              <CVBlock title="Professional Summary">
                {cv.Profile.map((p, i) => <p key={i} className="cv-p text-gray-700 leading-relaxed font-bold mb-4">{p}</p>)}
              </CVBlock>

              <CVBlock title="Work Experience">
                {cv.WorkExperience.map((exp, i) => (
                  <div key={i} className="cv-entry mb-6 last:mb-0">
                    <div className="cv-entry-top flex justify-between items-baseline mb-1">
                      <div className="cv-entry-title text-lg font-black">{exp.Title}</div>
                      <div className="cv-entry-meta text-sm font-bold text-gray-400">{exp.Period}</div>
                    </div>
                    <div className="cv-entry-sub font-black text-brand-600 mb-2 uppercase text-sm tracking-tight">{exp.Company}</div>
                    <ul className="cv-bullets list-disc list-inside text-sm text-gray-700 font-bold flex flex-col gap-1">
                      {exp.Details.map((detail: string, j: number) => <li key={j}>{detail}</li>)}
                    </ul>
                  </div>
                ))}
              </CVBlock>

              {cv.Projects.length > 0 && (
                <CVBlock title="Personal Projects">
                  {cv.Projects.map((proj, i) => (
                    <div key={i} className="cv-entry mb-6 last:mb-0">
                      <div className="cv-entry-top flex justify-between items-baseline mb-1">
                        <div className="cv-entry-title text-lg font-black">{proj.Title}</div>
                        <div className="cv-entry-meta text-sm font-bold text-gray-400">{proj.Period}</div>
                      </div>
                      <div className="cv-entry-sub font-bold text-gray-500 mb-2">{proj.AssociatedWith}</div>
                      <ul className="cv-bullets list-disc list-inside text-sm text-gray-700 font-bold flex flex-col gap-1">
                        {proj.Details.map((detail: string, j: number) => <li key={j}>{detail}</li>)}
                      </ul>
                    </div>
                  ))}
                </CVBlock>
              )}
            </main>
          </div>
        </article>
      </div>
    </section>
  );
}

function CVBlock({ title, children }: { title: string, children: React.ReactNode }) {
  return (
    <section className="cv-block mb-8 last:mb-0">
      <h2 className="cv-h2 text-xs font-black uppercase tracking-widest text-gray-400 mb-4 border-b border-gray-100 pb-2">{title}</h2>
      {children}
    </section>
  );
}

function MiniRow({ label, value }: { label: string, value: string }) {
  return (
    <div className="cv-mini-row flex justify-between gap-4 text-xs">
      <span className="cv-mini-k font-black text-gray-400 uppercase">{label}</span>
      <span className="cv-mini-v font-black text-gray-800 text-right">{value}</span>
    </div>
  );
}

function ContactLink({ href, icon, label }: { href: string, icon: React.ReactNode, label: string }) {
  if (!href) return null;
  return (
    <a className="cv-contact-link flex items-center gap-2 p-2 hover:bg-gray-50 font-bold text-sm" href={href} target="_blank" rel="noopener noreferrer">
      {icon} {label}
    </a>
  );
}

function SidebarLink({ href, icon, label }: { href: string, icon: React.ReactNode, label: string }) {
  if (!href) return null;
  return (
    <a className="cv-link flex items-center gap-2 text-sm font-black text-brand-600 hover:underline" href={href} target="_blank" rel="noopener noreferrer">
      {icon} {label}
    </a>
  );
}
