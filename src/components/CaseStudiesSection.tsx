import { useState } from 'react';
import { ArrowRight, ExternalLink } from 'lucide-react';
import { CASE_STUDIES, type CaseStudy } from '../data/studioContent';
import { SectionEyebrow } from './SectionEyebrow';

interface CaseStudiesSectionProps {
  onSelectCaseStudy: (study: CaseStudy) => void;
}

function ProjectCard({
  study,
  onSelect,
}: {
  study: CaseStudy;
  onSelect: (study: CaseStudy) => void;
}) {
  const [failed, setFailed] = useState(false);

  const isLightPill = study.ctaVariant === 'light';
  const pillClasses = isLightPill
    ? 'bg-white text-[#111A33] shadow-[0_12px_30px_rgba(17,26,51,0.22)] hover:bg-[#F7F8FC]'
    : 'bg-[#080D20] text-[#F4F5FA] border border-white/15 shadow-[0_12px_30px_rgba(8,13,32,0.45)] hover:bg-[#111A33]';

  return (
    <article className="group flex flex-col">
      <div
        className={`relative w-full overflow-hidden rounded-[24px] border border-[var(--border)] bg-[var(--surface-subtle)] ${study.aspectClass}`}
      >
        {!failed ? (
          <img
            src={study.imageSrc}
            alt={study.imageAlt}
            referrerPolicy="no-referrer"
            loading="lazy"
            onError={() => setFailed(true)}
            className="h-full w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]"
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center bg-gradient-to-br from-[var(--surface-subtle)] to-[var(--accent-soft)] p-8 text-center">
            <span className="font-['Plus_Jakarta_Sans'] text-xl font-bold text-[var(--ink)]">
              {study.title}
            </span>
            <span className="mt-1 text-sm text-[var(--muted)]">{study.category}</span>
          </div>
        )}

        {/* Measured subtle scrim at bottom for contrast */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black/55 via-black/15 to-transparent"
        />

        {/* Expandable hover pill button */}
        <div className="absolute bottom-4 right-4 sm:bottom-5 sm:right-5 z-10">
          <button
            type="button"
            onClick={() => onSelect(study)}
            aria-label={`${study.ctaLabel} — ${study.title}`}
            className={`inline-flex h-11 min-w-11 items-center justify-center rounded-full px-4 sm:px-2.5 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] sm:group-hover:px-5 focus-visible:px-5 cursor-pointer ${pillClasses}`}
          >
            <span className="grid grid-cols-[1fr] sm:grid-cols-[0fr] sm:group-hover:grid-cols-[1fr] sm:group-focus-within:grid-cols-[1fr] transition-[grid-template-columns] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]">
              <span className="overflow-hidden whitespace-nowrap text-[0.875rem] font-semibold pr-2.5 sm:pr-0 sm:group-hover:pr-2.5 sm:group-focus-within:pr-2.5 transition-[padding] duration-300">
                {study.ctaLabel}
              </span>
            </span>
            <span
              aria-hidden="true"
              className="inline-flex h-6 w-6 items-center justify-center shrink-0"
            >
              {study.ctaIcon === 'link' ? (
                <ExternalLink className="h-4 w-4 transition-transform duration-300 group-hover:scale-110" />
              ) : (
                <ArrowRight className="h-4 w-4 -rotate-45 transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:rotate-0" />
              )}
            </span>
          </button>
        </div>
      </div>

      {/* Editorial project metadata & description */}
      <div className="mt-5 flex flex-col gap-2.5">
        <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-[0.8125rem] font-medium text-[var(--muted)]">
          <span>{study.category}</span>
          <span aria-hidden="true">·</span>
          <span className="tabular-nums">{study.year}</span>
          <span aria-hidden="true">·</span>
          <span className="text-[var(--accent)] font-semibold tabular-nums">
            {study.metrics[0]?.value} {study.metrics[0]?.label}
          </span>
        </div>

        <div className="flex items-baseline justify-between gap-4">
          <h3 className="text-[1.5rem] sm:text-[1.75rem] font-bold tracking-[-0.03em] text-[var(--ink)]">
            <button
              type="button"
              onClick={() => onSelect(study)}
              className="text-left transition-colors hover:text-[var(--accent)] cursor-pointer"
            >
              {study.title}
            </button>
          </h3>
          <span className="hidden sm:inline text-[0.8125rem] text-[var(--muted)]">
            {study.liveUrlLabel}
          </span>
        </div>

        <p className="max-w-[56ch] text-[0.9625rem] leading-[1.65] text-[var(--muted)]">
          {study.shortDescription}
        </p>
      </div>
    </article>
  );
}

export function CaseStudiesSection({ onSelectCaseStudy }: CaseStudiesSectionProps) {
  return (
    <section
      id="work"
      className="scroll-mt-24 sm:scroll-mt-28 border-y border-[var(--border)] bg-[var(--surface)] py-20 sm:py-28 lg:py-32"
    >
      <div className="mx-auto w-full max-w-[1440px] px-5 sm:px-8 lg:px-12">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <SectionEyebrow number="2" label="Featured client work" />
            <h2 className="mt-5 text-[clamp(1.85rem,4vw,3.35rem)] font-bold leading-[1.09] tracking-[-0.035em] text-[var(--ink)]">
              Our projects
            </h2>
          </div>
          <p className="max-w-[44ch] text-[0.9625rem] leading-[1.65] text-[var(--muted)]">
            Selected flagship sites engineered for distinctive brand storytelling, crisp speed, and measurable revenue impact.
          </p>
        </div>

        <div className="mt-12 sm:mt-16 grid grid-cols-1 gap-10 md:grid-cols-2 lg:gap-14 items-start">
          {CASE_STUDIES.map((study) => (
            <ProjectCard
              key={study.id}
              study={study}
              onSelect={onSelectCaseStudy}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
