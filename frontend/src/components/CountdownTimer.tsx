import { useCountdown } from "../hooks/useCountdown";

interface Props {
  date: string;
  startTime: string;
  endTime: string;
  compact?: boolean;
}

export default function CountdownTimer({ date, startTime, endTime, compact = false }: Props) {
  const { days, hours, minutes, seconds, status } = useCountdown(date, startTime, endTime);

  if (status === "completed") {
    return (
      <div className={`inline-flex items-center gap-1.5 ${compact ? "text-xs" : "text-sm"} text-accent font-display font-medium`}>
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
        Completed
      </div>
    );
  }

  if (status === "happening") {
    return (
      <div className={`animate-gold-pulse inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gold/10 border border-gold/20 ${compact ? "text-xs" : "text-sm"}`}>
        <span className="w-2 h-2 rounded-full bg-gold animate-pulse-dot" />
        <span className="text-gold font-display font-semibold">Live Now</span>
      </div>
    );
  }

  if (compact) {
    return (
      <div className="inline-flex items-center gap-1 font-mono text-[11px] text-white/50 tabular-nums">
        {days > 0 && <span className="text-gold font-semibold">{days}d</span>}
        <span>{String(hours).padStart(2, "0")}h</span>
        <span>{String(minutes).padStart(2, "0")}m</span>
        <span>{String(seconds).padStart(2, "0")}s</span>
      </div>
    );
  }

  const units = [
    { label: "Days", value: days },
    { label: "Hrs", value: hours },
    { label: "Min", value: minutes },
    { label: "Sec", value: seconds },
  ];

  return (
    <div className="flex gap-2 justify-center">
      {units.map((unit) => (
        <div key={unit.label} className="flex flex-col items-center bg-white/[0.04] backdrop-blur-sm rounded-xl px-3.5 py-2.5 min-w-[58px] border border-white/[0.06]">
          <span className="text-xl font-mono font-bold text-gold tabular-nums leading-none">{String(unit.value).padStart(2, "0")}</span>
          <span className="text-[9px] text-white/30 uppercase tracking-[0.15em] mt-1 font-display">{unit.label}</span>
        </div>
      ))}
    </div>
  );
}
