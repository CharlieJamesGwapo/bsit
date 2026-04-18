import { useState, useRef, useEffect } from "react";
import ContactForm from "../components/ContactForm";
import { img } from "../lib/api";

function useInView(ref: React.RefObject<HTMLElement | null>) {
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setInView(true); obs.disconnect(); } }, { threshold: 0.1 });
    obs.observe(el);
    return () => obs.disconnect();
  }, [ref]);
  return inView;
}

export default function ContactPage() {
  const [loaded, setLoaded] = useState(false);
  const formRef = useRef<HTMLElement>(null);
  const formVisible = useInView(formRef);

  useEffect(() => {
    requestAnimationFrame(() => setTimeout(() => setLoaded(true), 50));
  }, []);

  return (
    <div>
      {/* Hero */}
      <section className="relative pt-32 pb-20 bg-navy overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#050c18] via-navy to-navy-light" />
        <div className="absolute bottom-[10%] right-[10%] w-60 h-60 rounded-full bg-teal/[0.04] blur-[100px]" />
        <div className="absolute top-[20%] left-[5%] w-72 h-72 rounded-full bg-gold/[0.04] blur-[100px]" />

        <div className="relative max-w-5xl mx-auto px-5">
          <div className="max-w-2xl">
            <div className={`mb-5 transition-all duration-500 ease-out ${loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-teal/15 bg-teal/[0.06]">
                <svg className="w-3.5 h-3.5 text-teal" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                <span className="font-display text-teal text-[11px] font-semibold tracking-[0.1em] uppercase">Contact</span>
              </div>
            </div>
            <h1 className={`font-heading text-[40px] md:text-5xl lg:text-[56px] font-black text-white leading-[1.05] tracking-tight mb-4 transition-all duration-600 delay-100 ease-out ${loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
              Get in <span className="text-gold">Touch</span>
            </h1>
            <p className={`text-white/45 text-sm leading-relaxed max-w-md transition-all duration-500 delay-200 ease-out ${loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
              Have questions about our programs, events, or the College of Information Technology? We'd love to hear from you.
            </p>
          </div>
        </div>
      </section>

      {/* Content */}
      <section ref={formRef} className="py-20 bg-surface">
        <div className="max-w-5xl mx-auto px-5">
          <div className={`grid grid-cols-1 lg:grid-cols-5 gap-10 transition-all duration-600 ease-out ${formVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
            {/* Contact Info */}
            <div className="lg:col-span-2">
              <h2 className="font-heading text-xl font-bold text-navy mb-5">Contact Information</h2>

              <div className="space-y-4 mb-8">
                {[
                  { icon: "M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z", title: "Address", text: "Sta. Cruz, Cogon, Balingasag, Misamis Oriental" },
                  { icon: "M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z", title: "Phone", text: "09974994766" },
                  { icon: "M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9", title: "Website", text: "moist.ph" },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-teal/10 flex items-center justify-center flex-shrink-0">
                      <svg className="w-5 h-5 text-teal" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={item.icon} /></svg>
                    </div>
                    <div>
                      <h3 className="font-display font-semibold text-navy text-sm">{item.title}</h3>
                      <p className="text-navy/45 text-sm">{item.text}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Logo block */}
              <div className="pt-6 border-t border-navy/[0.06] flex items-center gap-3">
                <img src={img("logo.jpg")} alt="CIT Logo" className="w-11 h-11 rounded-xl border border-gold/20" />
                <div>
                  <p className="font-display font-bold text-navy text-sm">College of Information Technology</p>
                  <p className="text-navy/35 text-xs font-display">MOIST Inc. — Established 2014</p>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-3">
              <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-navy/[0.04]">
                <h2 className="font-heading text-xl font-bold text-navy mb-5">Send a Message</h2>
                <ContactForm />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
