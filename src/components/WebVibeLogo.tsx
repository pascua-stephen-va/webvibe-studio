interface WebVibeLogoProps {
  compact?: boolean;
  className?: string;
}

export function WebVibeLogo({ compact = false, className = '' }: WebVibeLogoProps) {
  return (
    <span className={`inline-flex items-center gap-2.5 whitespace-nowrap shrink-0 ${className}`}>
      <img
        src={`${import.meta.env.BASE_URL}assets/aistudio/webvibe-mark-transparent_25f702f9.png`}
        alt=""
        aria-hidden="true"
        referrerPolicy="no-referrer"
        className="h-8 w-8 object-contain shrink-0"
      />
      {!compact && (
        <span
          className="font-['Plus_Jakarta_Sans'] text-[1.0625rem] font-extrabold tracking-[-0.03em] text-[var(--ink)]"
        >
          Web<span className="text-[var(--accent)]">Vibe</span>
        </span>
      )}
    </span>
  );
}
