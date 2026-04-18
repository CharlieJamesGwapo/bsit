import { Link } from "react-router-dom";
import CountdownTimer from "./CountdownTimer";
import type { Event } from "../types";

const categoryDotColors: Record<string, string> = {
  academic: "bg-teal",
  sports: "bg-gold",
  cultural: "bg-purple-400",
};

const categoryTextColors: Record<string, string> = {
  academic: "text-teal",
  sports: "text-gold",
  cultural: "text-purple-400",
};

interface Props {
  events: Event[];
}

export default function Timeline({ events }: Props) {
  const sorted = [...events].sort((a, b) => a.startTime.localeCompare(b.startTime));

  return (
    <div className="relative">
      {/* Vertical line */}
      <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-white/10 -translate-x-1/2" />

      <div className="space-y-10">
        {sorted.map((event, i) => {
          const isLeft = i % 2 === 0;
          return (
            <div key={event.id} className={`relative flex items-start gap-8 ${isLeft ? "md:flex-row" : "md:flex-row-reverse"}`}>
              {/* Timeline dot */}
              <div className="absolute left-4 md:left-1/2 -translate-x-1/2 z-10">
                <div className={`w-3.5 h-3.5 rounded-full ${categoryDotColors[event.category]} border-2 border-navy ring-4 ring-navy`} />
              </div>

              {/* Content card */}
              <div className={`ml-12 md:ml-0 md:w-[calc(50%-2rem)] ${isLeft ? "md:pr-8" : "md:pl-8"}`}>
                <Link
                  to={`/events/${event.id}`}
                  className="group block bg-navy-lighter rounded-xl overflow-hidden border border-white/5 hover:border-teal/20 transition-all duration-300 hover:-translate-y-0.5"
                >
                  <div className="flex flex-col sm:flex-row">
                    <div className="sm:w-28 sm:h-28 flex-shrink-0">
                      <img src={`/images/${event.image}`} alt={event.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="p-4 flex-1">
                      <span className={`text-[10px] font-bold uppercase tracking-wider ${categoryTextColors[event.category]}`}>
                        {event.category}
                      </span>
                      <h3 className="font-heading font-bold text-white text-base mt-0.5 group-hover:text-teal transition-colors">
                        {event.name}
                      </h3>
                      <p className="text-white/40 text-xs mt-1">
                        {event.startTime}{event.endTime ? ` - ${event.endTime}` : ""} &middot; {event.venue}
                      </p>
                      <div className="mt-2">
                        <CountdownTimer date={event.date} startTime={event.startTime} endTime={event.endTime} compact />
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
