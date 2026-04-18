import { useEffect, useState, useRef } from "react";
import Timeline from "../components/Timeline";
import EventCard from "../components/EventCard";
import type { Event } from "../types";

type CategoryFilter = "all" | "academic" | "sports" | "cultural";

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

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [activeDay, setActiveDay] = useState<"2026-04-17" | "2026-04-18">("2026-04-17");
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>("all");
  const [viewMode, setViewMode] = useState<"timeline" | "grid">("grid");
  const [loaded, setLoaded] = useState(false);
  const gridRef = useRef<HTMLElement>(null);
  const gridVisible = useInView(gridRef);

  useEffect(() => {
    fetch("/api/events").then((r) => r.json()).then(setEvents).catch(() => {});
    requestAnimationFrame(() => setTimeout(() => setLoaded(true), 50));
  }, []);

  const filteredEvents = events.filter((e) => {
    if (e.date !== activeDay) return false;
    if (categoryFilter !== "all" && e.category !== categoryFilter) return false;
    return true;
  });

  const days = [
    { date: "2026-04-17" as const, label: "Day 1 — Apr 17" },
    { date: "2026-04-18" as const, label: "Day 2 — Apr 18" },
  ];

  const categories: { value: CategoryFilter; label: string }[] = [
    { value: "all", label: "All" },
    { value: "academic", label: "Academic" },
    { value: "sports", label: "Sports" },
    { value: "cultural", label: "Cultural" },
  ];

  const day1Count = events.filter((e) => e.date === "2026-04-17").length;
  const day2Count = events.filter((e) => e.date === "2026-04-18").length;

  return (
    <div>
      {/* Hero */}
      <section className="relative pt-32 pb-20 bg-navy overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#050c18] via-navy to-navy-light" />
        <div className="absolute bottom-[10%] left-[8%] w-60 h-60 rounded-full bg-teal/[0.04] blur-[100px]" />
        <div className="absolute top-[15%] right-[5%] w-72 h-72 rounded-full bg-gold/[0.04] blur-[100px]" />

        <div className="relative max-w-5xl mx-auto px-5">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div>
              <div className={`mb-5 transition-all duration-500 ease-out ${loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-teal/15 bg-teal/[0.06]">
                  <svg className="w-3.5 h-3.5 text-teal" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                  <span className="font-display text-teal text-[11px] font-semibold tracking-[0.1em] uppercase">Schedule</span>
                </div>
              </div>
              <h1 className={`font-heading text-[40px] md:text-5xl lg:text-[56px] font-black text-white leading-[1.05] tracking-tight mb-4 transition-all duration-600 delay-100 ease-out ${loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
                IT Days <span className="text-gold">Events</span>
              </h1>
              <p className={`text-white/45 text-sm leading-relaxed max-w-md mb-6 transition-all duration-500 delay-200 ease-out ${loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
                Two days of competition, creativity, and collaboration. Academic contests, sports, and cultural performances.
              </p>
            </div>

            {/* Stats cards */}
            <div className={`grid grid-cols-2 gap-3 transition-all duration-700 delay-200 ease-out ${loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
              <div className="bg-white/[0.04] border border-white/[0.07] rounded-2xl p-5 text-center">
                <p className="font-display text-3xl font-bold text-gold">{day1Count}</p>
                <p className="font-display text-white/30 text-[10px] uppercase tracking-wider mt-1">Day 1 Events</p>
                <p className="font-display text-white/20 text-[10px] mt-0.5">April 17</p>
              </div>
              <div className="bg-white/[0.04] border border-white/[0.07] rounded-2xl p-5 text-center">
                <p className="font-display text-3xl font-bold text-gold">{day2Count}</p>
                <p className="font-display text-white/30 text-[10px] uppercase tracking-wider mt-1">Day 2 Events</p>
                <p className="font-display text-white/20 text-[10px] mt-0.5">April 18</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Controls */}
      <section className="bg-navy-light border-b border-white/[0.04] sticky top-[60px] z-40">
        <div className="max-w-6xl mx-auto px-5">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 py-3">
            <div className="flex gap-1.5">
              {days.map((day) => (
                <button
                  key={day.date}
                  onClick={() => setActiveDay(day.date)}
                  className={`cursor-pointer px-5 py-2 rounded-xl font-display font-semibold text-xs transition-all active:scale-[0.97] ${
                    activeDay === day.date
                      ? "bg-gold text-navy shadow-[0_4px_12px_rgba(201,168,76,0.2)]"
                      : "bg-white/[0.04] text-white/40 hover:bg-white/[0.08] hover:text-white/60"
                  }`}
                >
                  {day.label}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <div className="flex gap-1">
                {categories.map((cat) => (
                  <button
                    key={cat.value}
                    onClick={() => setCategoryFilter(cat.value)}
                    className={`cursor-pointer px-3 py-1.5 rounded-lg text-[11px] font-display font-semibold transition-all ${
                      categoryFilter === cat.value
                        ? "bg-white/10 text-white"
                        : "text-white/25 hover:text-white/45 hover:bg-white/[0.04]"
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
              <div className="w-px h-5 bg-white/[0.06]" />
              <div className="flex bg-white/[0.04] rounded-lg p-0.5">
                {(["timeline", "grid"] as const).map((mode) => (
                  <button
                    key={mode}
                    onClick={() => setViewMode(mode)}
                    className={`cursor-pointer px-3 py-1.5 rounded-md text-[11px] font-display font-medium transition-all ${viewMode === mode ? "bg-white/10 text-white" : "text-white/25"}`}
                  >
                    {mode === "timeline" ? "Timeline" : "Grid"}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Events */}
      <section ref={gridRef} className={`py-16 min-h-[50vh] ${viewMode === "timeline" ? "bg-navy" : "bg-surface"}`}>
        <div className="max-w-6xl mx-auto px-5">
          {filteredEvents.length === 0 ? (
            <div className="text-center py-20">
              <svg className={`w-12 h-12 mx-auto mb-4 ${viewMode === "timeline" ? "text-white/10" : "text-navy/10"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
              <p className={`text-sm font-display ${viewMode === "timeline" ? "text-white/25" : "text-navy/25"}`}>No events match your filter.</p>
            </div>
          ) : viewMode === "timeline" ? (
            <Timeline events={filteredEvents} />
          ) : (
            <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 transition-all duration-500 ${gridVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
              {filteredEvents.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
