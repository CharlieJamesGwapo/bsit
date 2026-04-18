import { Link } from "react-router-dom";
import CountdownTimer from "./CountdownTimer";
import type { Event } from "../types";
import { img } from "../lib/api";

const categoryStyles: Record<string, { badge: string; dot: string }> = {
  academic: { badge: "bg-teal/10 text-teal border-teal/15", dot: "bg-teal" },
  sports: { badge: "bg-gold/10 text-gold border-gold/15", dot: "bg-gold" },
  cultural: { badge: "bg-purple-400/10 text-purple-400 border-purple-400/15", dot: "bg-purple-400" },
};

interface Props {
  event: Event;
}

export default function EventCard({ event }: Props) {
  const style = categoryStyles[event.category] || categoryStyles.academic;

  return (
    <Link
      to={`/events/${event.id}`}
      className="cursor-pointer group block bg-white rounded-2xl overflow-hidden border border-navy/[0.06] card-hover active:scale-[0.98] transition-transform"
    >
      <div className="relative aspect-[16/10] sm:aspect-[16/9] overflow-hidden">
        <img
          src={img(event.image)}
          alt={event.name}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-500 ease-out"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-navy/50 via-transparent to-transparent" />
        <div className="absolute top-3 left-3">
          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-display font-semibold border backdrop-blur-md ${style.badge}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${style.dot}`} />
            {event.category.charAt(0).toUpperCase() + event.category.slice(1)}
          </span>
        </div>
      </div>

      <div className="p-4 sm:p-5">
        <h3 className="font-heading text-base sm:text-lg font-bold text-navy mb-2 group-hover:text-teal transition-colors duration-200 leading-snug">
          {event.name}
        </h3>
        <div className="flex flex-wrap gap-x-3 gap-y-1 text-[11px] text-navy/40 mb-3 font-display">
          <span className="inline-flex items-center gap-1">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
            {new Date(event.date + "T00:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric" })}
          </span>
          <span className="inline-flex items-center gap-1">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            {event.startTime}{event.endTime ? `–${event.endTime}` : ""}
          </span>
          <span className="inline-flex items-center gap-1">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
            {event.venue}
          </span>
        </div>
        <div className="pt-3 border-t border-navy/[0.04] flex items-center justify-between">
          <CountdownTimer date={event.date} startTime={event.startTime} endTime={event.endTime} compact />
          <svg className="w-4 h-4 text-navy/15 group-hover:text-teal transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
        </div>
      </div>
    </Link>
  );
}
