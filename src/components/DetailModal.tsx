import { useEffect } from 'react';
import { Check, MapPin, X } from 'lucide-react';
import { STUDIO_PROFILE, type CaseStudy } from '../data/studioContent';
import { RollButton } from './RollButton';

interface DetailModalProps {
  caseStudy: CaseStudy | null;
  studioOpen: boolean;
  onClose: () => void;
  onStartSimilarProject: (serviceValue: string) => void;
}

export function DetailModal({
  caseStudy,
  studioOpen,
  onClose,
  onStartSimilarProject,
}: DetailModalProps) {
  const isOpen = Boolean(caseStudy) || studioOpen;

  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', handleKey);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={caseStudy ? `${caseStudy.title} case study` : 'About WebVibe Studio'}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#080D20]/65 p-4 sm:p-6 backdrop-blur-sm"
    >
      <div
        className="relative max-h-[90vh] w-full max-w-[820px] overflow-y-auto rounded-[28px] border border-[var(--border)] bg-[var(--surface)] p-6 sm:p-9"
        style={{ boxShadow: 'var(--shadow-card)' }}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close modal"
          className="absolute right-5 top-5 inline-flex h-10 w-10 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--bg)] text-[var(--ink)] transition-colors hover:border-[var(--accent)] hover:text-[var(--accent)] cursor-pointer"
        >
          <X className="h-5 w-5" aria-hidden="true" />
        </button>

        {caseStudy ? (
          <div>
            <div className="flex flex-wrap items-center gap-2 text-[0.8125rem] font-medium text-[var(--muted)] pr-12">
              <span className="text-[var(--accent)] font-semibold">Case Study</span>
              <span aria-hidden="true">·</span>
              <span>{caseStudy.category}</span>
              <span aria-hidden="true">·</span>
              <span className="tabular-nums">{caseStudy.year}</span>
              {caseStudy.awardNote && (
                <>
                  <span aria-hidden="true">·</span>
                  <span className="font-semibold text-[var(--ink)]">{caseStudy.awardNote}</span>
                </>
              )}
            </div>

            <h3 className="mt-3 text-[1.85rem] sm:text-[2.25rem] font-bold tracking-[-0.035em] text-[var(--ink)]">
              {caseStudy.title}
            </h3>

            <p className="mt-3 max-w-[64ch] text-[1rem] leading-[1.65] text-[var(--muted)]">
              {caseStudy.summary}
            </p>

            <div className="mt-6 overflow-hidden rounded-[20px] border border-[var(--border)] bg-[var(--surface-subtle)] aspect-[16/9]">
              <img
                src={caseStudy.imageSrc}
                alt={caseStudy.imageAlt}
                referrerPolicy="no-referrer"
                className="h-full w-full object-cover"
              />
            </div>

            <div className="mt-6 grid grid-cols-1 gap-4 rounded-[20px] border border-[var(--border)] bg-[var(--bg)] p-5 sm:grid-cols-3">
              {caseStudy.metrics.map((metric) => (
                <div key={metric.label}>
                  <p className="font-['Plus_Jakarta_Sans'] text-[1.65rem] font-bold tracking-[-0.03em] text-[var(--accent)] tabular-nums">
                    {metric.value}
                  </p>
                  <p className="mt-1 text-[0.8125rem] leading-[1.45] text-[var(--muted)]">
                    {metric.label}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-7 grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <h4 className="text-[0.9375rem] font-bold text-[var(--ink)]">
                  The Challenge
                </h4>
                <p className="mt-2 text-[0.925rem] leading-[1.65] text-[var(--muted)]">
                  {caseStudy.challenge}
                </p>
              </div>
              <div>
                <h4 className="text-[0.9375rem] font-bold text-[var(--ink)]">
                  Our Approach
                </h4>
                <p className="mt-2 text-[0.925rem] leading-[1.65] text-[var(--muted)]">
                  {caseStudy.solution}
                </p>
              </div>
            </div>

            <div className="mt-7 border-t border-[var(--border)] pt-6">
              <h4 className="text-[0.875rem] font-bold text-[var(--ink)]">
                Key Deliverables
              </h4>
              <ul className="mt-3 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                {caseStudy.deliverables.map((item) => (
                  <li
                    key={item}
                    className="flex items-center gap-2 text-[0.875rem] text-[var(--muted)]"
                  >
                    <Check
                      className="h-4 w-4 shrink-0 text-[var(--accent)]"
                      aria-hidden="true"
                    />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-[var(--border)] pt-6">
              <span className="text-[0.875rem] text-[var(--muted)]">
                {caseStudy.liveUrlLabel}
              </span>
              <RollButton
                label="Start a similar project"
                variant="primary"
                size="md"
                onClick={() => onStartSimilarProject(caseStudy.serviceKey)}
              />
            </div>
          </div>
        ) : (
          <div>
            <div className="flex items-center gap-2 text-[0.8125rem] font-medium text-[var(--muted)] pr-12">
              <span className="font-semibold text-[var(--accent)]">WebVibe Studio</span>
              <span aria-hidden="true">·</span>
              <span>{STUDIO_PROFILE.founded}</span>
            </div>

            <h3 className="mt-3 text-[1.85rem] sm:text-[2.25rem] font-bold tracking-[-0.035em] text-[var(--ink)]">
              Senior craft without agency overhead.
            </h3>

            <p className="mt-3 max-w-[62ch] text-[1rem] leading-[1.68] text-[var(--muted)]">
              {STUDIO_PROFILE.philosophy}
            </p>

            <div className="mt-5 inline-flex items-center gap-2 text-[0.875rem] font-medium text-[var(--ink)]">
              <MapPin className="h-4 w-4 text-[var(--accent)]" aria-hidden="true" />
              <span>{STUDIO_PROFILE.location}</span>
            </div>

            <div className="mt-7 grid grid-cols-1 gap-4 sm:grid-cols-2">
              {STUDIO_PROFILE.principles.map((principle) => (
                <div
                  key={principle.title}
                  className="rounded-[18px] border border-[var(--border)] bg-[var(--bg)] p-5"
                >
                  <h4 className="text-[1rem] font-bold text-[var(--ink)]">
                    {principle.title}
                  </h4>
                  <p className="mt-1.5 text-[0.875rem] leading-[1.6] text-[var(--muted)]">
                    {principle.detail}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-[var(--border)] pt-6">
              <span className="text-[0.875rem] text-[var(--muted)]">
                Direct 1-on-1 discovery calls · Worldwide remote
              </span>
              <RollButton
                label="Book a discovery chat"
                variant="primary"
                size="md"
                onClick={() => onStartSimilarProject('Website Design & Build')}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
