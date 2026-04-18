import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import InstructorCard from "../components/InstructorCard";
import SectionHeader from "../components/SectionHeader";
import type { Instructor } from "../types";

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

export default function InstructorsPage() {
  const [instructors, setInstructors] = useState<Instructor[]>([]);
  const [loading, setLoading] = useState(true);
  const [loaded, setLoaded] = useState(false);

  const gridRef = useRef<HTMLElement>(null);
  const ctaRef = useRef<HTMLElement>(null);
  const gridVisible = useInView(gridRef);
  const ctaVisible = useInView(ctaRef);

  useEffect(() => {
    fetch("/api/instructors")
      .then((r) => r.json())
      .then(setInstructors)
      .catch(() => {})
      .finally(() => setLoading(false));
    requestAnimationFrame(() => setTimeout(() => setLoaded(true), 50));
  }, []);

  return (
    <div>
      {/* Hero */}
      <section className="relative pt-32 pb-20 bg-navy overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#050c18] via-navy to-navy-light" />
        <div className="absolute top-[20%] left-[8%] w-60 h-60 rounded-full bg-gold/[0.04] blur-[100px]" />
        <div className="absolute bottom-[10%] right-[10%] w-72 h-72 rounded-full bg-teal/[0.04] blur-[100px]" />

        <div className="relative max-w-5xl mx-auto px-5">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left */}
            <div>
              <div className={`mb-5 transition-all duration-500 ease-out ${loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-gold/15 bg-gold/[0.06]">
                  <svg className="w-3.5 h-3.5 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                  <span className="font-display text-gold text-[11px] font-semibold tracking-[0.1em] uppercase">Faculty</span>
                </div>
              </div>

              <h1 className={`font-heading text-[40px] md:text-5xl lg:text-[56px] font-black text-white leading-[1.05] tracking-tight mb-4 transition-all duration-600 delay-100 ease-out ${loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
                Our <span className="text-gold">Instructors</span>
              </h1>

              <p className={`text-white/45 text-sm leading-relaxed max-w-lg mb-6 transition-all duration-500 delay-200 ease-out ${loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
                Meet the dedicated faculty of the College of Information Technology who guide and inspire our students every day.
              </p>

              <div className={`flex items-center gap-4 transition-all duration-500 delay-300 ease-out ${loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-white/[0.04] flex items-center justify-center">
                    <svg className="w-4 h-4 text-teal" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                  </div>
                  <div>
                    <p className="font-display text-white font-bold text-lg">{instructors.length}</p>
                    <p className="font-display text-white/25 text-[10px] uppercase tracking-wider">Faculty Members</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right — decorative card */}
            <div className={`hidden lg:block transition-all duration-700 delay-200 ease-out ${loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
              <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-7">
                <div className="flex items-center gap-3 mb-5">
                  <svg className="w-5 h-5 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                  <h3 className="font-display text-white/60 text-sm font-semibold">College of Information Technology</h3>
                </div>
                <p className="text-white/30 text-sm leading-relaxed mb-5">
                  Our instructors bring real-world experience and academic excellence to every class, preparing students for successful careers in IT.
                </p>
                <div className="flex -space-x-2">
                  {instructors.slice(0, 4).map((inst) => (
                    <img key={inst.id} src={`/images/${inst.photo}`} alt={inst.name} className="w-9 h-9 rounded-full border-2 border-navy object-cover" />
                  ))}
                  {instructors.length > 4 && (
                    <div className="w-9 h-9 rounded-full border-2 border-navy bg-gold/20 flex items-center justify-center">
                      <span className="font-display text-gold text-[10px] font-bold">+{instructors.length - 4}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Faculty Grid */}
      <section ref={gridRef} className="py-20 bg-surface">
        <div className="max-w-6xl mx-auto px-5">
          <SectionHeader title="Meet the Faculty" subtitle="The people behind your education" light />

          {loading ? (
            <div className="text-center py-16">
              <div className="w-8 h-8 border-2 border-teal/30 border-t-teal rounded-full animate-spin mx-auto mb-3" />
              <p className="text-navy/30 text-sm font-display">Loading instructors...</p>
            </div>
          ) : instructors.length > 0 ? (
            <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 transition-all duration-600 ease-out ${gridVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
              {instructors.map((instructor) => (
                <InstructorCard key={instructor.id} instructor={instructor} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-navy/30 text-sm">No instructors found.</p>
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section ref={ctaRef} className="py-20 bg-navy relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[#050c18] via-navy to-[#0c1f3a]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full bg-gold/[0.03] blur-[120px]" />
        <div className={`relative max-w-3xl mx-auto px-5 text-center transition-all duration-600 ease-out ${ctaVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-white mb-4">Interested in <span className="text-gold">Teaching</span>?</h2>
          <p className="text-white/40 text-sm max-w-md mx-auto mb-8 leading-relaxed">
            We're always looking for passionate educators to join the College of Information Technology.
          </p>
          <Link to="/contact" className="cursor-pointer group inline-flex items-center justify-center gap-2 px-7 py-3 bg-teal hover:bg-teal-dark text-white font-display font-semibold rounded-xl text-sm active:scale-[0.97]">
            Contact Us
            <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
          </Link>
        </div>
      </section>
    </div>
  );
}
