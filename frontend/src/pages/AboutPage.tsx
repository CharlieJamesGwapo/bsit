import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import SectionHeader from "../components/SectionHeader";
import type { CollegeInfo } from "../types";

function useInView(ref: React.RefObject<HTMLElement | null>) {
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setInView(true); obs.disconnect(); } },
      { threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [ref]);
  return inView;
}

function ObjectiveIcon({ index }: { index: number }) {
  const paths = [
    "M13 10V3L4 14h7v7l9-11h-7z",
    "M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z",
    "M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3",
    "M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z",
    "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z",
    "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253",
  ];
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={paths[index]} />
    </svg>
  );
}

const objectiveTitles = ["Career Success", "Communication", "Ethics", "Innovation", "Teamwork", "Lifelong Learning"];

export default function AboutPage() {
  const [info, setInfo] = useState<CollegeInfo | null>(null);
  const [loaded, setLoaded] = useState(false);

  const statsRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<HTMLElement>(null);
  const objectivesRef = useRef<HTMLElement>(null);
  const ctaRef = useRef<HTMLElement>(null);

  const statsVisible = useInView(statsRef);
  const cardsVisible = useInView(cardsRef);
  const objectivesVisible = useInView(objectivesRef);
  const ctaVisible = useInView(ctaRef);

  useEffect(() => {
    fetch("/api/info")
      .then((r) => r.json())
      .then(setInfo)
      .catch(() => {});
    requestAnimationFrame(() => setTimeout(() => setLoaded(true), 50));
  }, []);

  if (!info) return (
    <div className="pt-32 pb-20 text-center">
      <div className="w-8 h-8 border-2 border-teal/30 border-t-teal rounded-full animate-spin mx-auto mb-3" />
      <p className="text-navy/30 text-sm font-display">Loading...</p>
    </div>
  );

  const yearsActive = new Date().getFullYear() - info.established;

  return (
    <div>
      {/* HERO */}
      <section className="relative pt-32 pb-24 bg-navy overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#050c18] via-navy to-navy-light" />
        <div className="absolute top-[15%] right-[5%] w-80 h-80 rounded-full bg-teal/[0.04] blur-[120px]" />
        <div className="absolute bottom-[10%] left-[10%] w-60 h-60 rounded-full bg-gold/[0.04] blur-[100px]" />

        <div className="relative max-w-5xl mx-auto px-5">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className={`mb-5 transition-all duration-500 ease-out ${loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-teal/15 bg-teal/[0.06]">
                  <svg className="w-3.5 h-3.5 text-teal" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  <span className="font-display text-teal text-[11px] font-semibold tracking-[0.1em] uppercase">About Us</span>
                </div>
              </div>

              <h1 className={`font-heading text-[40px] md:text-5xl lg:text-[56px] font-black text-white leading-[1.05] tracking-tight mb-5 transition-all duration-600 delay-100 ease-out ${loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
                College of <span className="text-gold">Information Technology</span>
              </h1>

              <p className={`text-white/45 text-sm leading-relaxed max-w-md mb-7 transition-all duration-500 delay-200 ease-out ${loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
                Empowering future IT professionals through innovation, collaboration, and technology-driven education since {info.established}.
              </p>

              <div className={`flex items-center gap-3 transition-all duration-500 delay-300 ease-out ${loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
                <Link to="/contact" className="cursor-pointer inline-flex items-center gap-2 px-5 py-2.5 bg-teal hover:bg-teal-dark text-white font-display font-semibold rounded-xl text-sm active:scale-[0.97]">Get in Touch</Link>
                <Link to="/events" className="cursor-pointer inline-flex items-center gap-1.5 text-white/50 hover:text-gold font-display text-sm font-medium">
                  View Events <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                </Link>
              </div>
            </div>

            {/* Info card */}
            <div className={`transition-all duration-700 delay-200 ease-out ${loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
              <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-6 md:p-7">
                <div className="flex items-center gap-4 mb-5 pb-5 border-b border-white/[0.05]">
                  <img src="/images/logo.jpg" alt="CIT" className="w-12 h-12 rounded-xl border border-gold/20" />
                  <div>
                    <h3 className="font-display text-white font-bold text-sm">{info.name}</h3>
                    <p className="font-display text-white/30 text-xs mt-0.5">{info.institution}</p>
                  </div>
                </div>
                <div className="space-y-3.5">
                  {[
                    { path: "M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z", label: "Location", value: info.address },
                    { path: "M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z", label: "Phone", value: info.phone },
                    { path: "M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9", label: "Website", value: info.website },
                    { path: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z", label: "Established", value: String(info.established) },
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg bg-white/[0.04] flex items-center justify-center flex-shrink-0 mt-0.5">
                        <svg className="w-4 h-4 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={item.path} /></svg>
                      </div>
                      <div>
                        <p className="font-display text-white/25 text-[10px] uppercase tracking-wider">{item.label}</p>
                        <p className="font-display text-white/70 text-sm">{item.value}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section ref={statsRef} className="py-10 bg-navy-light border-y border-white/[0.04]">
        <div className="max-w-5xl mx-auto px-5">
          <div className={`grid grid-cols-2 md:grid-cols-4 gap-6 transition-all duration-600 ease-out ${statsVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
            {[
              { value: `${yearsActive}+`, label: "Years of Excellence" },
              { value: "6", label: "Program Objectives" },
              { value: "7", label: "IT Days Events" },
              { value: "3", label: "Event Categories" },
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <p className="font-display text-3xl md:text-4xl font-bold text-gold">{stat.value}</p>
                <p className="font-display text-white/30 text-[11px] uppercase tracking-wider mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* VISION / MISSION / VALUES */}
      <section ref={cardsRef} className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-5">
          <SectionHeader title="Who We Are" subtitle="Our guiding principles" light />
          <div className={`grid grid-cols-1 lg:grid-cols-3 gap-6 transition-all duration-600 ease-out ${cardsVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
            {/* Vision */}
            <div className="group bg-surface rounded-2xl p-7 border border-navy/[0.04] hover:border-teal/20 transition-all duration-300 card-hover">
              <div className="w-12 h-12 rounded-xl bg-teal/10 flex items-center justify-center mb-5 group-hover:bg-teal/15 transition-colors">
                <svg className="w-6 h-6 text-teal" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
              <h3 className="font-heading text-xl font-bold text-navy mb-3">Vision</h3>
              <p className="text-navy/45 text-[14px] leading-[1.75]">{info.vision}</p>
            </div>

            {/* Mission */}
            <div className="group bg-surface rounded-2xl p-7 border border-navy/[0.04] hover:border-gold/20 transition-all duration-300 card-hover">
              <div className="w-12 h-12 rounded-xl bg-gold/10 flex items-center justify-center mb-5 group-hover:bg-gold/15 transition-colors">
                <svg className="w-6 h-6 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h3 className="font-heading text-xl font-bold text-navy mb-3">Mission</h3>
              <p className="text-navy/45 text-[14px] leading-[1.75]">{info.mission}</p>
            </div>

            {/* Core Values */}
            <div className="group bg-surface rounded-2xl p-7 border border-navy/[0.04] hover:border-teal/20 transition-all duration-300 card-hover">
              <div className="w-12 h-12 rounded-xl bg-teal/10 flex items-center justify-center mb-5 group-hover:bg-teal/15 transition-colors">
                <svg className="w-6 h-6 text-teal" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h3 className="font-heading text-xl font-bold text-navy mb-3">Core Values</h3>
              <p className="text-navy/45 text-[14px] leading-[1.75]">{info.coreValues}</p>
            </div>
          </div>
        </div>
      </section>

      {/* OBJECTIVES */}
      <section ref={objectivesRef} className="py-24 bg-surface">
        <div className="max-w-6xl mx-auto px-5">
          <SectionHeader title="Program Objectives" subtitle="What we strive to achieve" light />
          <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 transition-all duration-600 ease-out ${objectivesVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
            {info.objectives.map((obj, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 border border-navy/[0.04] card-hover">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-teal/10 flex items-center justify-center text-teal flex-shrink-0">
                    <ObjectiveIcon index={i} />
                  </div>
                  <h3 className="font-display font-bold text-navy text-sm">{objectiveTitles[i]}</h3>
                </div>
                <p className="text-navy/40 text-[13px] leading-relaxed">{obj}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section ref={ctaRef} className="py-20 bg-navy relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[#050c18] via-navy to-[#0c1f3a]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full bg-teal/[0.03] blur-[120px]" />
        <div className={`relative max-w-3xl mx-auto px-5 text-center transition-all duration-600 ease-out ${ctaVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-white mb-4">Ready for IT Days <span className="text-gold">2026</span>?</h2>
          <p className="text-white/40 text-sm max-w-md mx-auto mb-8 leading-relaxed">Join us April 17–18 for two days of competition, creativity, and collaboration.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/events" className="cursor-pointer group inline-flex items-center justify-center gap-2 px-7 py-3 bg-teal hover:bg-teal-dark text-white font-display font-semibold rounded-xl text-sm active:scale-[0.97]">
              View Events <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
            </Link>
            <Link to="/contact" className="cursor-pointer inline-flex items-center justify-center px-7 py-3 border border-white/12 hover:border-white/25 text-white/60 hover:text-white font-display font-semibold rounded-xl text-sm active:scale-[0.97]">Contact Us</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
