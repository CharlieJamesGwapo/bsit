import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => setMenuOpen(false), [location]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock body scroll when menu open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  const navLinks = [
    { to: "/", label: "Home", icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" },
    { to: "/about", label: "About", icon: "M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" },
    { to: "/events", label: "Events", icon: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" },
    { to: "/instructors", label: "Instructors", icon: "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" },
    { to: "/contact", label: "Contact", icon: "M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" },
  ];

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "bg-navy/95 backdrop-blur-xl shadow-lg border-b border-white/[0.04]" : "bg-navy/80 backdrop-blur-md"}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-[60px]">
            <Link to="/" className="flex items-center gap-2.5 cursor-pointer group">
              <img src="/images/logo.jpg" alt="CIT Logo" className="h-8 w-8 rounded-full border border-gold/20 group-hover:border-gold/40 transition-colors" />
              <span className="text-white font-display font-bold text-sm hidden sm:block tracking-tight">CIT — MOIST</span>
            </Link>

            {/* Desktop */}
            <div className="hidden md:flex items-center gap-0.5">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`cursor-pointer relative px-3.5 py-2 rounded-lg text-[13px] font-display font-medium transition-all duration-200 ${
                    location.pathname === link.to
                      ? "text-gold"
                      : "text-white/50 hover:text-white/90 hover:bg-white/[0.04]"
                  }`}
                >
                  {link.label}
                  {location.pathname === link.to && (
                    <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-4 h-[2px] bg-gold rounded-full" />
                  )}
                </Link>
              ))}
            </div>

            {/* Mobile toggle */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden cursor-pointer w-10 h-10 flex items-center justify-center rounded-xl text-white/70 hover:bg-white/[0.05] transition-colors"
              aria-label="Toggle menu"
            >
              <div className="w-5 h-4 flex flex-col justify-between relative">
                <span className={`block h-[1.5px] bg-current rounded-full transition-all duration-300 origin-center ${menuOpen ? "rotate-45 translate-y-[7px]" : ""}`} />
                <span className={`block h-[1.5px] bg-current rounded-full transition-all duration-200 ${menuOpen ? "opacity-0 scale-x-0" : ""}`} />
                <span className={`block h-[1.5px] bg-current rounded-full transition-all duration-300 origin-center ${menuOpen ? "-rotate-45 -translate-y-[7px]" : ""}`} />
              </div>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile full-screen overlay */}
      <div className={`md:hidden fixed inset-0 z-40 transition-all duration-300 ${menuOpen ? "visible" : "invisible"}`}>
        {/* Backdrop */}
        <div className={`absolute inset-0 bg-navy/95 backdrop-blur-xl transition-opacity duration-300 ${menuOpen ? "opacity-100" : "opacity-0"}`} />

        {/* Menu content */}
        <div className={`relative h-full flex flex-col justify-center px-8 transition-all duration-400 ${menuOpen ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
          <div className="space-y-2">
            {navLinks.map((link, i) => (
              <Link
                key={link.to}
                to={link.to}
                className={`cursor-pointer flex items-center gap-4 py-4 px-4 rounded-2xl transition-all duration-200 ${
                  location.pathname === link.to
                    ? "bg-gold/[0.08] text-gold"
                    : "text-white/60 hover:text-white hover:bg-white/[0.04]"
                }`}
                style={{ transitionDelay: menuOpen ? `${i * 50}ms` : "0ms" }}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${location.pathname === link.to ? "bg-gold/10" : "bg-white/[0.04]"}`}>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={link.icon} />
                  </svg>
                </div>
                <span className="font-display text-lg font-semibold">{link.label}</span>
              </Link>
            ))}
          </div>

          {/* Bottom info */}
          <div className="mt-12 flex items-center gap-3 px-4">
            <img src="/images/logo.jpg" alt="CIT" className="w-8 h-8 rounded-full border border-gold/15" />
            <div>
              <p className="font-display text-white/30 text-xs font-medium">College of Information Technology</p>
              <p className="font-display text-white/15 text-[10px]">IT Days 2026 — April 17-18</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
