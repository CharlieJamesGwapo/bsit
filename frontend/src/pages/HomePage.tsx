import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import HeroSection from "../components/HeroSection";
import SectionHeader from "../components/SectionHeader";
import EventCard from "../components/EventCard";
import InstructorCard from "../components/InstructorCard";
import type { Event, Instructor, CollegeInfo } from "../types";
import { api } from "../lib/api";

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

// SVG icons for objectives (no emojis per UI/UX Pro Max)
const objectives = [
  {
    icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>,
    title: "Career Success",
    text: "Pursue a successful career in the field of Information Technology.",
  },
  {
    icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>,
    title: "Communication",
    text: "Demonstrate effective communication skills.",
  },
  {
    icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" /></svg>,
    title: "Ethics & Responsibility",
    text: "Demonstrate professional and ethical responsibilities towards the environment and society.",
  },
  {
    icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>,
    title: "Innovation",
    text: "Implement computing solutions for real-world problems leading to new innovations.",
  },
  {
    icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>,
    title: "Teamwork",
    text: "Work effectively as individuals or as a member of a team.",
  },
  {
    icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>,
    title: "Lifelong Learning",
    text: "Engage in life-long learning to enhance career positions in IT industries.",
  },
];

export default function HomePage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [instructors, setInstructors] = useState<Instructor[]>([]);
  const [info, setInfo] = useState<CollegeInfo | null>(null);

  const aboutRef = useRef<HTMLElement>(null);
  const objectivesRef = useRef<HTMLElement>(null);
  const eventsRef = useRef<HTMLElement>(null);
  const instructorsRef = useRef<HTMLElement>(null);
  const contactRef = useRef<HTMLElement>(null);

  const aboutVisible = useInView(aboutRef);
  const objectivesVisible = useInView(objectivesRef);
  const eventsVisible = useInView(eventsRef);
  const instructorsVisible = useInView(instructorsRef);
  const contactVisible = useInView(contactRef);

  useEffect(() => {
    fetch(api("/api/events")).then((r) => r.json()).then(setEvents).catch(() => {});
    fetch(api("/api/instructors")).then((r) => r.json()).then(setInstructors).catch(() => {});
    fetch(api("/api/info")).then((r) => r.json()).then(setInfo).catch(() => {});
  }, []);

  const upcomingEvents = [...events]
    .sort((a, b) => new Date(`${a.date}T${a.startTime}:00`).getTime() - new Date(`${b.date}T${b.startTime}:00`).getTime())
    .slice(0, 4);

  // Group events by day
  const day1Events = events.filter((e) => e.date === "2026-04-17");
  const day2Events = events.filter((e) => e.date === "2026-04-18");

  return (
    <div>
      <HeroSection />

      {/* Schedule Overview Banner */}
      <section className="py-16 bg-navy-light border-t border-white/[0.04]">
        <div className="max-w-6xl mx-auto px-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Day 1 */}
            <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-6 hover:border-teal/20 transition-colors duration-300">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-teal/10 flex items-center justify-center">
                  <span className="font-display text-teal font-bold text-sm">01</span>
                </div>
                <div>
                  <h3 className="font-display text-white font-bold text-sm">Day 1 — April 17</h3>
                  <p className="font-display text-white/30 text-[11px]">{day1Events.length} events scheduled</p>
                </div>
              </div>
              <div className="space-y-2">
                {day1Events.slice(0, 3).map((e) => (
                  <Link key={e.id} to={`/events/${e.id}`} className="cursor-pointer flex items-center gap-2 text-white/40 hover:text-gold text-xs font-display transition-colors">
                    <svg className="w-3 h-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    <span className="text-white/25 w-10 flex-shrink-0">{e.startTime}</span>
                    <span className="truncate">{e.name}</span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Day 2 */}
            <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-6 hover:border-gold/20 transition-colors duration-300">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-gold/10 flex items-center justify-center">
                  <span className="font-display text-gold font-bold text-sm">02</span>
                </div>
                <div>
                  <h3 className="font-display text-white font-bold text-sm">Day 2 — April 18</h3>
                  <p className="font-display text-white/30 text-[11px]">{day2Events.length} events scheduled</p>
                </div>
              </div>
              <div className="space-y-2">
                {day2Events.slice(0, 3).map((e) => (
                  <Link key={e.id} to={`/events/${e.id}`} className="cursor-pointer flex items-center gap-2 text-white/40 hover:text-gold text-xs font-display transition-colors">
                    <svg className="w-3 h-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    <span className="text-white/25 w-10 flex-shrink-0">{e.startTime}</span>
                    <span className="truncate">{e.name}</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          <div className="text-center mt-6">
            <Link to="/events" className="cursor-pointer inline-flex items-center gap-1.5 text-teal hover:text-teal-dark font-display text-xs font-semibold">
              View full schedule
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
            </Link>
          </div>
        </div>
      </section>

      {/* About Preview */}
      <section ref={aboutRef} className={`py-24 bg-white transition-all duration-500 ease-out ${aboutVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
        <div className="max-w-3xl mx-auto px-5 text-center">
          <SectionHeader title="About Us" subtitle="College of Information Technology" light />
          <p className="text-navy/50 text-[15px] leading-[1.8] mb-8">
            {info?.vision}
          </p>
          <Link to="/about" className="cursor-pointer inline-flex items-center gap-2 px-6 py-2.5 border-2 border-teal text-teal hover:bg-teal hover:text-white font-display font-semibold rounded-xl text-sm active:scale-[0.97]">
            Learn More
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
          </Link>
        </div>
      </section>

      {/* Program Objectives */}
      <section ref={objectivesRef} className={`py-24 bg-surface transition-all duration-500 ease-out ${objectivesVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
        <div className="max-w-6xl mx-auto px-5">
          <SectionHeader title="Program Objectives" subtitle="What we strive to achieve" light />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {objectives.map((obj, i) => (
              <div
                key={i}
                className={`bg-white rounded-2xl p-6 border border-navy/[0.04] card-hover cursor-default ${objectivesVisible ? "animate-fade-in-up" : "opacity-0"} stagger-${i + 1}`}
              >
                <div className="w-11 h-11 rounded-xl bg-teal/8 flex items-center justify-center text-teal mb-4">
                  {obj.icon}
                </div>
                <h3 className="font-display font-bold text-navy text-sm mb-2">{obj.title}</h3>
                <p className="text-navy/40 text-[13px] leading-relaxed">{obj.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Upcoming Events */}
      <section ref={eventsRef} className={`py-24 bg-white transition-all duration-500 ease-out ${eventsVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
        <div className="max-w-6xl mx-auto px-5">
          <SectionHeader title="Upcoming Events" subtitle="IT Days 2026 — April 17 & 18" light />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {upcomingEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
          <div className="text-center mt-12">
            <Link to="/events" className="cursor-pointer inline-flex items-center gap-2 px-7 py-3 bg-teal hover:bg-teal-dark text-white font-display font-semibold rounded-xl text-sm hover:shadow-[0_8px_32px_rgba(0,165,165,0.2)] active:scale-[0.97]">
              View All Events
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Instructors Preview */}
      <section ref={instructorsRef} className={`py-24 bg-navy transition-all duration-500 ease-out ${instructorsVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
        <div className="max-w-6xl mx-auto px-5">
          <SectionHeader title="Our Instructors" subtitle="Meet the faculty" />
          {instructors.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {instructors.map((instructor) => (
                <InstructorCard key={instructor.id} instructor={instructor} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="w-16 h-16 rounded-2xl bg-white/[0.04] flex items-center justify-center mx-auto mb-5">
                <svg className="w-8 h-8 text-white/20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
              </div>
              <p className="text-white/30 text-sm font-display font-medium">Coming Soon</p>
              <p className="text-white/15 text-xs mt-1.5">Instructor profiles will be available shortly.</p>
            </div>
          )}
        </div>
      </section>

      {/* Contact Snippet */}
      <section ref={contactRef} className={`py-24 bg-surface transition-all duration-500 ease-out ${contactVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
        <div className="max-w-3xl mx-auto px-5 text-center">
          <SectionHeader title="Get In Touch" light />
          <div className="flex flex-col sm:flex-row justify-center gap-6 mb-8 text-navy/40 text-sm">
            <div className="flex items-center gap-2 justify-center">
              <svg className="w-4 h-4 text-teal" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
              <span className="font-display">Balingasag, Misamis Oriental</span>
            </div>
            <div className="flex items-center gap-2 justify-center">
              <svg className="w-4 h-4 text-teal" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
              <span className="font-display">09974994766</span>
            </div>
          </div>
          <Link to="/contact" className="cursor-pointer inline-flex items-center gap-2 px-7 py-3 bg-teal hover:bg-teal-dark text-white font-display font-semibold rounded-xl text-sm hover:shadow-[0_8px_32px_rgba(0,165,165,0.2)] active:scale-[0.97]">
            Contact Us
          </Link>
        </div>
      </section>
    </div>
  );
}
