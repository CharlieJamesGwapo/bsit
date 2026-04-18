import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-[#050c18] text-white pt-16 pb-8">
      <div className="max-w-6xl mx-auto px-5">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 mb-12">
          {/* Brand — 5 cols */}
          <div className="md:col-span-5">
            <div className="flex items-center gap-3 mb-4">
              <img src="/images/logo.jpg" alt="CIT Logo" className="h-10 w-10 rounded-xl border border-gold/15" />
              <div>
                <p className="font-display font-bold text-sm">College of Information Technology</p>
                <p className="text-[11px] text-white/25 font-display">MOIST Inc.</p>
              </div>
            </div>
            <p className="text-[13px] text-white/25 leading-relaxed max-w-xs mb-5">
              Connecting Through Technology, Inspiring Innovation and Collaboration — IT Days 2026
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-gold/10 bg-gold/[0.04]">
              <span className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse" />
              <span className="font-display text-gold/70 text-[10px] font-semibold tracking-[0.1em] uppercase">April 17–18, 2026</span>
            </div>
          </div>

          {/* Links — 3 cols */}
          <div className="md:col-span-3">
            <h3 className="text-[11px] font-display font-bold text-white/30 uppercase tracking-[0.15em] mb-4">Quick Links</h3>
            <div className="space-y-2.5">
              {[
                { to: "/", label: "Home" },
                { to: "/about", label: "About" },
                { to: "/events", label: "Events" },
                { to: "/instructors", label: "Instructors" },
                { to: "/contact", label: "Contact" },
              ].map((link) => (
                <Link key={link.to} to={link.to} className="cursor-pointer flex items-center gap-1.5 text-[13px] text-white/35 hover:text-teal transition-colors font-display">
                  <svg className="w-3 h-3 text-white/15" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Contact — 4 cols */}
          <div className="md:col-span-4">
            <h3 className="text-[11px] font-display font-bold text-white/30 uppercase tracking-[0.15em] mb-4">Contact</h3>
            <div className="space-y-3">
              {[
                { icon: "M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z", text: "Sta. Cruz, Cogon, Balingasag, Misamis Oriental" },
                { icon: "M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z", text: "09974994766" },
                { icon: "M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3", text: "moist.ph" },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-2.5">
                  <svg className="w-4 h-4 text-teal/60 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={item.icon} /></svg>
                  <span className="text-[13px] text-white/35 font-display">{item.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Divider + Copyright */}
        <div className="border-t border-white/[0.04] pt-6 flex flex-col sm:flex-row justify-between items-center gap-3">
          <p className="text-[11px] text-white/15 font-display">&copy; 2026 College of Information Technology — MOIST Inc. All rights reserved.</p>
          <p className="text-[11px] text-white/10 font-display">IT Days 2026</p>
        </div>
      </div>
    </footer>
  );
}
