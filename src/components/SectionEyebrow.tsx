interface SectionEyebrowProps {
  number: string;
  label: string;
}

export function SectionEyebrow({ number, label }: SectionEyebrowProps) {
  return (
    <div className="inline-flex items-center gap-2.5">
      <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-[var(--accent)] text-[0.8125rem] font-bold text-[var(--accent-ink)] tabular-nums shrink-0">
        {number}
      </span>
      <span className="inline-flex items-center rounded-full border border-[var(--border)] bg-[var(--surface)] px-3.5 py-1 text-[0.8125rem] font-semibold text-[var(--ink)] whitespace-nowrap">
        {label}
      </span>
    </div>
  );
}
