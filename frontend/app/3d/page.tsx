import Link from "next/link";
import { Check, ArrowRight, Printer, Box, Layers, FileText, ClipboardList, Mail, Sparkles } from "lucide-react";

export default function ThreeD() {
  const packages = [
    {
      name: "Basic 3D",
      price: "15,000 DZD",
      tag: "3D print",
      badge: "3D",
      icon: <Box className="w-6 h-6" />,
      sub: "Perfect for simple parts and student prototypes.",
      features: [
        "3D printing included",
        "3D files included (STL/OBJ)",
        "Quick review before printing",
      ],
      color: "bg-amber-50 text-amber-600"
    },
    {
      name: "Standard 3D",
      price: "30,000 DZD",
      tag: "3D print + files",
      badge: "Popular",
      icon: <Layers className="w-6 h-6" />,
      sub: "More iterations and complete 3D deliverables.",
      features: [
        "3D printing included",
        "3D files included (STL/OBJ)",
        "2 revision iterations",
        "Student guidance for assembly/use",
      ],
      featured: true,
      color: "bg-blue-50 text-blue-600"
    },
    {
      name: "Premium 3D",
      price: "50,000 DZD",
      tag: "Conception + report",
      badge: "Premium",
      icon: <Sparkles className="w-6 h-6" />,
      sub: "Premium package including conception, full 3D files, and full report.",
      features: [
        "3D printing included",
        "Full 3D files (STL/OBJ) + source",
        "Conception and modeling included",
        "Full report included",
      ],
      color: "bg-emerald-50 text-emerald-600"
    },
  ];

  return (
    <div className="bg-[#0a0a0a] min-h-screen">
      <section className="bg-brand-600 text-white py-16 md:py-24 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -mr-48 -mt-48 blur-3xl"></div>
        <div className="container text-center space-y-6 relative z-10">
          <div className="inline-block px-3 py-1 bg-white/20 rounded text-[10px] font-black uppercase tracking-widest backdrop-blur-md border border-white/10">
            Advanced Prototyping
          </div>
          <h1 className="text-4xl md:text-6xl font-black leading-tight tracking-tighter max-w-4xl mx-auto">
            3D Printing & <br />
            <span className="text-black/90">Digital Conception</span>
          </h1>
          <p className="text-lg font-bold opacity-70 max-w-2xl mx-auto leading-relaxed">
            Professional 3D printing services and concept design for students and startups, with complete 3D files and clear deliverables.
          </p>
          <div className="flex flex-wrap justify-center gap-4 pt-4">
            <Link href="/contact" className="bg-black text-white px-8 py-3.5 rounded-lg font-black text-sm uppercase tracking-widest flex items-center gap-3 shadow-xl shadow-black/10 hover:brightness-110 active:scale-95 transition-all">
              <ClipboardList className="w-4 h-4" />
              Start a Project
            </Link>
            <Link href="/contact" className="bg-white/10 backdrop-blur-md border border-white/20 px-8 py-3.5 rounded-lg font-black text-sm uppercase tracking-widest flex items-center gap-3 hover:bg-white/20 active:scale-95 transition-all shadow-sm">
              <Mail className="w-4 h-4" />
              Contact Us
            </Link>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container">
          <div className="mb-12 space-y-3 text-center md:text-left">
            <h2 className="text-3xl font-black text-white tracking-tighter">Prototyping Packages</h2>
            <p className="text-base font-bold text-white/40 max-w-xl leading-relaxed">
              Choose the level that matches your project timeline and required deliverables. We handle everything from CAD to final print.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {packages.map((pkg) => (
              <div
                key={pkg.name}
                className={`bg-[#111111] border p-8 flex flex-col gap-6 rounded-xl shadow-2xl transition-all duration-500 group relative overflow-hidden ${
                  pkg.featured ? "border-brand-600 ring-4 ring-brand-600/5" : "border-white/5"
                }`}
              >
                {pkg.featured && (
                  <div className="absolute top-0 right-0 bg-brand-600 text-white px-4 py-1 rounded-bl-lg text-[9px] font-black uppercase tracking-widest">
                    Featured
                  </div>
                )}
                <div className="space-y-4">
                  <div className={`w-10 h-10 ${pkg.color} rounded-lg flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform`}>
                    {pkg.icon}
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xl font-black text-white leading-tight">{pkg.name}</h3>
                      <div className="text-[8px] font-black text-brand-600 uppercase tracking-widest bg-brand-600/10 px-1.5 py-0.5 rounded border border-brand-600/20">
                        {pkg.badge}
                      </div>
                    </div>
                    <div className="text-2xl font-black text-brand-600 tracking-tight">{pkg.price}</div>
                    <div className="text-[9px] font-black text-white/20 uppercase tracking-widest">{pkg.tag}</div>
                  </div>
                  <p className="text-xs font-bold text-white/40 leading-relaxed">
                    {pkg.sub}
                  </p>
                </div>

                <ul className="space-y-3 flex-grow pt-6 border-t border-white/5">
                  {pkg.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2.5 text-xs font-bold text-white/60 leading-snug">
                      <div className="w-4 h-4 bg-emerald-500/10 rounded-full flex items-center justify-center flex-shrink-0 border border-emerald-500/20">
                        <Check className="w-2.5 h-2.5 text-emerald-500" />
                      </div>
                      {feature}
                    </li>
                  ))}
                </ul>

                <Link
                  href="/contact"
                  className={`block w-full text-center py-3 rounded-lg font-black text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${
                    pkg.featured ? "bg-brand-600 text-white hover:bg-brand-700 shadow-lg shadow-brand-600/20" : "bg-white text-black hover:bg-white/90"
                  }`}
                >
                  Order Now
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            ))}
          </div>

          <div className="mt-16 bg-[#111111] border border-white/5 p-8 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-brand-600/5 rounded-full -mr-32 -mt-32 blur-3xl opacity-50"></div>
            <div className="space-y-2 relative z-10 text-center md:text-left">
              <h3 className="text-xl font-black text-white tracking-tight">Need other services?</h3>
              <p className="text-sm font-bold text-white/40 max-w-lg">Explore our full range of web development and digital solutions designed for modern businesses.</p>
            </div>
            <Link href="/services" className="bg-white/5 border border-white/10 px-8 py-3.5 rounded-lg font-black text-xs uppercase tracking-widest hover:bg-white/10 active:scale-95 transition-all flex items-center gap-3 shadow-sm relative z-10">
              <Layers className="w-4 h-4" />
              All Services
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
