import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import CountdownTimer from "../components/CountdownTimer";
import type { Event } from "../types";

const categoryStyles: Record<string, string> = {
  academic: "bg-teal/10 text-teal border-teal/20",
  sports: "bg-gold/10 text-gold border-gold/20",
  cultural: "bg-purple-500/10 text-purple-400 border-purple-500/20",
};

export default function EventDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    fetch(`/api/events/${id}`)
      .then((r) => { if (!r.ok) throw new Error("Not found"); return r.json(); })
      .then(setEvent)
      .catch(() => setEvent(null))
      .finally(() => setLoading(false));
    requestAnimationFrame(() => setTimeout(() => setLoaded(true), 50));
  }, [id]);

  if (loading) return (
    <div className="pt-32 pb-20 text-center">
      <div className="w-8 h-8 border-2 border-teal/30 border-t-teal rounded-full animate-spin mx-auto mb-3" />
      <p className="text-navy/30 text-sm font-display">Loading event...</p>
    </div>
  );

  if (!event) return (
    <div className="pt-32 pb-20 text-center">
      <svg className="w-16 h-16 text-navy/10 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
      <h1 className="font-heading text-2xl font-bold text-navy mb-3">Event Not Found</h1>
      <Link to="/events" className="cursor-pointer text-teal font-display text-sm font-semibold hover:text-teal-dark">Back to Events</Link>
    </div>
  );

  const formattedDate = new Date(event.date + "T00:00:00").toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" });

  return (
    <div>
      {/* Hero */}
      <section className="relative pt-28 pb-16 bg-navy overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#050c18] via-navy to-navy-light" />
        <div className="absolute top-[20%] right-[5%] w-72 h-72 rounded-full bg-teal/[0.04] blur-[100px]" />

        <div className="relative max-w-6xl mx-auto px-5">
          <Link to="/events" className={`cursor-pointer inline-flex items-center gap-2 text-white/30 hover:text-teal font-display text-sm mb-8 transition-all duration-500 ${loaded ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4"}`}>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            Back to Events
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
            {/* Poster */}
            <div className={`rounded-2xl overflow-hidden border border-white/[0.08] shadow-2xl transition-all duration-700 ${loaded ? "opacity-100 scale-100" : "opacity-0 scale-95"}`}>
              <img src={`/images/${event.image}`} alt={event.name} className="w-full h-auto" />
            </div>

            {/* Details */}
            <div className={`transition-all duration-600 delay-200 ease-out ${loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-[11px] font-display font-semibold border mb-5 ${categoryStyles[event.category]}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${event.category === "academic" ? "bg-teal" : event.category === "sports" ? "bg-gold" : "bg-purple-400"}`} />
                {event.category.charAt(0).toUpperCase() + event.category.slice(1)}
              </span>

              <h1 className="font-heading text-3xl md:text-[40px] font-bold text-white mb-4 leading-tight tracking-tight">{event.name}</h1>
              <p className="text-white/45 text-sm leading-relaxed mb-8">{event.description}</p>

              {/* Meta */}
              <div className="space-y-3 mb-8">
                {[
                  { icon: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z", text: formattedDate },
                  { icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z", text: `${event.startTime}${event.endTime ? ` – ${event.endTime}` : ""}` },
                  { icon: "M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z", text: event.venue },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-white/[0.04] flex items-center justify-center flex-shrink-0">
                      <svg className="w-4 h-4 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={item.icon} /></svg>
                    </div>
                    <span className="text-white/55 text-sm font-display">{item.text}</span>
                  </div>
                ))}
              </div>

              {/* Countdown */}
              <div className="bg-white/[0.04] border border-white/[0.07] rounded-2xl p-5">
                <p className="text-white/25 text-[10px] uppercase tracking-[0.15em] mb-3 font-display font-semibold">Event Status</p>
                <CountdownTimer date={event.date} startTime={event.startTime} endTime={event.endTime} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mechanics */}
      {event.mechanics.length > 0 && (
        <section className="py-20 bg-surface">
          <div className="max-w-3xl mx-auto px-5">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-xl bg-gold/10 flex items-center justify-center">
                <svg className="w-5 h-5 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>
              </div>
              <h2 className="font-heading text-2xl font-bold text-navy">Mechanics & Rules</h2>
            </div>
            <div className="space-y-3">
              {event.mechanics.map((rule, i) => (
                <div key={i} className="flex gap-4 items-start bg-white rounded-xl p-5 border border-navy/[0.04] card-hover">
                  <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-teal/10 flex items-center justify-center">
                    <span className="text-teal font-display font-bold text-xs">{i + 1}</span>
                  </div>
                  <p className="text-navy/55 text-sm leading-relaxed">{rule}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
