interface Props {
  title: string;
  subtitle?: string;
  light?: boolean;
}

export default function SectionHeader({ title, subtitle, light = false }: Props) {
  return (
    <div className="text-center mb-14">
      <h2 className={`font-heading text-3xl md:text-[40px] font-bold mb-3 leading-tight tracking-tight ${light ? "text-navy" : "text-white"}`}>
        {title}
      </h2>
      <div className="w-12 h-[3px] bg-gradient-to-r from-gold to-gold-light rounded-full mx-auto mb-4" />
      {subtitle && (
        <p className={`text-sm font-display ${light ? "text-navy/40" : "text-white/40"}`}>{subtitle}</p>
      )}
    </div>
  );
}
