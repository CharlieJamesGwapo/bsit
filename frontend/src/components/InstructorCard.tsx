import type { Instructor } from "../types";

interface Props {
  instructor: Instructor;
}

export default function InstructorCard({ instructor }: Props) {
  return (
    <div className="group bg-white rounded-2xl overflow-hidden border border-navy/[0.04] card-hover">
      {/* Photo area */}
      <div className="relative bg-gradient-to-br from-navy via-navy-light to-[#0c1f3a] pt-8 pb-12 px-6 text-center">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-4 right-4 w-20 h-20 rounded-full bg-teal/[0.06] blur-[40px]" />
          <div className="absolute bottom-4 left-4 w-16 h-16 rounded-full bg-gold/[0.06] blur-[30px]" />
        </div>
        <div className="relative w-24 h-24 mx-auto rounded-full overflow-hidden border-3 border-gold/25 group-hover:border-gold/50 transition-colors duration-300 shadow-[0_0_30px_rgba(201,168,76,0.1)]">
          <img
            src={`/images/${instructor.photo}`}
            alt={instructor.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
      </div>

      {/* Info */}
      <div className="px-5 pb-5 -mt-4 relative">
        <div className="bg-white rounded-xl border border-navy/[0.04] p-4 text-center shadow-sm">
          <h3 className="font-heading font-bold text-navy text-base mb-1">{instructor.name}</h3>
          <p className="font-display text-teal text-xs font-semibold mb-1">{instructor.position}</p>
          <p className="font-display text-navy/35 text-[11px]">{instructor.specialization}</p>
        </div>
      </div>
    </div>
  );
}
