import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import type { Event } from "../types";
import { api } from "../lib/api";

export default function HeroSection() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    fetch(api("/api/events")).then((r) => r.json()).then(setEvents).catch(() => {});
    requestAnimationFrame(() => setTimeout(() => setLoaded(true), 50));
  }, []);

  useEffect(() => {
    function update() {
      const target = new Date("2026-04-17T08:00:00");
      const now = new Date();
      const diff = Math.max(0, target.getTime() - now.getTime());
      setCountdown({
        days: Math.floor(diff / 86400000),
        hours: Math.floor((diff % 86400000) / 3600000),
        minutes: Math.floor((diff % 3600000) / 60000),
        seconds: Math.floor((diff % 60000) / 1000),
      });
    }
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <section className="relative min-h-[100dvh] flex items-center overflow-hidden bg-navy">
      <div className="absolute inset-0 bg-gradient-to-br from-[#050c18] via-navy to-[#0c1f3a]" />

      {/* Decorative */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[10%] left-[15%] w-[400px] h-[400px] rounded-full bg-gold/[0.04] blur-[150px]" />
        <div className="absolute bottom-[10%] right-[10%] w-[350px] h-[350px] rounded-full bg-teal/[0.05] blur-[130px]" />
        {/* Subtle radial from center */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-white/[0.008] blur-[1px]" />
      </div>

      <div className="relative z-10 w-full max-w-6xl mx-auto px-5 py-24">
        {/* Top: Logo + Badge centered */}
        <div className="text-center mb-10">
          <div className={`inline-block mb-5 transition-all duration-700 ease-out ${loaded ? "opacity-100 scale-100" : "opacity-0 scale-90"}`}>
            <div className="animate-float">
              <img
                src="/images/logo.jpg"
                alt="College of Information Technology"
                className="w-20 h-20 md:w-24 md:h-24 rounded-full mx-auto border-3 border-gold/30 shadow-[0_0_50px_rgba(201,168,76,0.12)]"
              />
            </div>
          </div>
          <div className={`transition-all duration-500 delay-150 ease-out ${loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-gold/20 bg-gold/[0.06] mb-3">
              <span className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse" />
              <span className="font-display text-gold text-[11px] font-semibold tracking-[0.12em] uppercase">April 17–18, 2026</span>
            </div>
          </div>
          <p className={`font-display text-white/35 text-[11px] tracking-[0.25em] uppercase transition-all duration-500 delay-200 ease-out ${loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
            Misamis Oriental Institute of Science & Technology
          </p>
        </div>

        {/* Main: 2-column */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 lg:gap-14 items-start">

          {/* Left — 3 cols */}
          <div className="lg:col-span-3">
            {/* Title */}
            <div className={`mb-6 transition-all duration-700 delay-300 ease-out ${loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
              <h1 className="font-heading text-[48px] md:text-[64px] lg:text-[72px] font-black text-white leading-[0.95] tracking-tight">
                IT Days
              </h1>
              <h1 className="font-display text-[48px] md:text-[64px] lg:text-[72px] font-bold text-gold leading-[0.95] tracking-tight">
                2026
              </h1>
            </div>

            {/* Theme */}
            <p className={`text-white/40 text-sm md:text-[15px] max-w-md leading-relaxed mb-8 transition-all duration-600 delay-400 ease-out ${loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"}`}>
              <span className="italic font-heading">&ldquo;Connecting Through Technology, Inspiring Innovation and Collaboration&rdquo;</span>
            </p>

            {/* Stats */}
            <div className={`flex gap-8 mb-8 transition-all duration-500 delay-500 ease-out ${loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
              {[
                { value: events.length || 7, label: "Events" },
                { value: 2, label: "Days" },
                { value: 3, label: "Categories" },
              ].map((s, i) => (
                <div key={i} className="text-center">
                  <p className="font-display text-2xl md:text-3xl font-bold text-white">{s.value}</p>
                  <p className="font-display text-[10px] text-white/25 uppercase tracking-wider mt-0.5">{s.label}</p>
                </div>
              ))}
            </div>

            {/* CTAs */}
            <div className={`flex flex-col sm:flex-row gap-3 transition-all duration-500 delay-600 ease-out ${loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
              <Link to="/events" className="group cursor-pointer inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-teal hover:bg-teal-dark text-white font-display font-semibold rounded-xl text-sm hover:shadow-[0_8px_30px_rgba(0,165,165,0.25)] active:scale-[0.97]">
                Explore Events
                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
              </Link>
              <Link to="/about" className="cursor-pointer inline-flex items-center justify-center px-7 py-3.5 border border-white/12 hover:border-white/25 text-white/60 hover:text-white font-display font-semibold rounded-xl text-sm active:scale-[0.97]">
                About CIT
              </Link>
            </div>
          </div>

          {/* Right — 2 cols: Countdown + Events */}
          <div className={`lg:col-span-2 space-y-4 transition-all duration-700 delay-400 ease-out ${loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
            {/* Countdown */}
            <div className="bg-white/[0.04] border border-white/[0.07] rounded-2xl p-5 backdrop-blur-sm">
              <div className="flex items-center gap-2 mb-4">
                <svg className="w-4 h-4 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                <span className="font-display text-[11px] text-white/35 uppercase tracking-[0.15em] font-medium">Event Starts In</span>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { value: countdown.days, label: "Days" },
                  { value: countdown.hours, label: "Hrs" },
                  { value: countdown.minutes, label: "Min" },
                  { value: countdown.seconds, label: "Sec" },
                ].map((u) => (
                  <div key={u.label} className="text-center bg-navy/50 rounded-xl py-3 border border-white/[0.04]">
                    <span className="block font-mono text-xl md:text-2xl font-bold text-gold tabular-nums leading-none">{String(u.value).padStart(2, "0")}</span>
                    <span className="block text-[8px] text-white/20 uppercase tracking-[0.15em] mt-1.5 font-display">{u.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Featured events */}
            <div className="bg-white/[0.04] border border-white/[0.07] rounded-2xl p-5 backdrop-blur-sm">
              <p className="font-display text-[10px] text-white/30 uppercase tracking-[0.15em] font-medium mb-3">Featured Events</p>
              <div className="space-y-1">
                {events.slice(0, 4).map((event) => (
                  <Link
                    key={event.id}
                    to={`/events/${event.id}`}
                    className="cursor-pointer group flex items-center gap-3 p-2 rounded-xl hover:bg-white/[0.04] transition-colors duration-200"
                  >
                    <img src={`/images/${event.image}`} alt={event.name} className="w-9 h-9 rounded-lg object-cover flex-shrink-0 border border-white/[0.06]" />
                    <div className="flex-1 min-w-0">
                      <p className="font-display text-white/80 text-[13px] font-medium truncate group-hover:text-gold transition-colors">{event.name}</p>
                      <p className="font-display text-white/20 text-[10px]">
                        {new Date(event.date + "T00:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric" })} &middot; {event.startTime}
                      </p>
                    </div>
                    <svg className="w-3.5 h-3.5 text-white/10 group-hover:text-gold/40 transition-colors flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                  </Link>
                ))}
              </div>
              <Link to="/events" className="cursor-pointer flex items-center justify-center gap-1.5 mt-3 pt-3 border-t border-white/[0.05] text-teal hover:text-teal-dark font-display text-[11px] font-semibold">
                View all events
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-navy to-transparent pointer-events-none" />
    </section>
  );
}
