import { Check } from 'lucide-react';
import { SERVICES } from '../data/studioContent';
import { RollButton } from './RollButton';
import { SectionEyebrow } from './SectionEyebrow';

interface ServicesSectionProps {
  onSelectService: (serviceValue: string) => void;
}

export function ServicesSection({ onSelectService }: ServicesSectionProps) {
  const [primaryService, refreshService, careService] = SERVICES;

  const handleChoose = (serviceValue: string) => {
    onSelectService(serviceValue);
    const contactEl = document.getElementById('contact');
    if (contactEl) {
      contactEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="services" className="scroll-mt-24 sm:scroll-mt-28 py-20 sm:py-28 lg:py-32">
      <div className="mx-auto w-full max-w-[1440px] px-5 sm:px-8 lg:px-12">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div className="max-w-[700px]">
            <SectionEyebrow number="3" label="Capabilities" />
            <h2 className="mt-5 text-[clamp(1.85rem,4vw,3.25rem)] font-bold leading-[1.09] tracking-[-0.035em] text-[var(--ink)] [text-wrap:balance]">
              Websites shaped around the way you work.
            </h2>
          </div>
          <p className="max-w-[42ch] text-[0.9625rem] leading-[1.65] text-[var(--muted)]">
            Every engagement is scoped cleanly from strategy through launch—without agency handoffs or bloated retainers.
          </p>
        </div>

        {/* Asymmetric Bento Grid */}
        <div className="mt-12 sm:mt-16 grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* Primary flagship capability — 7 columns */}
          <article className="lg:col-span-7 flex flex-col justify-between rounded-[24px] border border-[var(--border)] bg-[var(--surface)] p-7 sm:p-9 transition-colors duration-200 hover:border-[var(--accent)]">
            <div>
              <div className="flex items-center justify-between gap-4 text-[0.8125rem] font-medium text-[var(--muted)]">
                <span className="font-bold text-[var(--accent)] tabular-nums">
                  {primaryService.index}. Flagship Engagement
                </span>
                <span>Typical timeline · {primaryService.timeline}</span>
              </div>

              <h3 className="mt-4 text-[1.65rem] sm:text-[1.95rem] font-bold tracking-[-0.03em] text-[var(--ink)]">
                {primaryService.title}
              </h3>

              <p className="mt-3 max-w-[56ch] text-[1rem] leading-[1.68] text-[var(--muted)]">
                {primaryService.summary}
              </p>

              <ul className="mt-7 grid grid-cols-1 gap-3 sm:grid-cols-2 border-t border-[var(--border)] pt-6">
                {primaryService.deliverables.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-2.5 text-[0.9rem] leading-[1.5] text-[var(--ink)]"
                  >
                    <Check
                      className="mt-1 h-4 w-4 shrink-0 text-[var(--accent)]"
                      aria-hidden="true"
                    />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-8 flex flex-wrap items-center justify-between gap-4 pt-2">
              <span className="text-[0.875rem] font-medium text-[var(--muted)]">
                {primaryService.outcome}
              </span>
              <RollButton
                label={primaryService.ctaLabel}
                variant="primary"
                size="md"
                onClick={() => handleChoose(primaryService.serviceValue)}
              />
            </div>
          </article>

          {/* Refresh capability — 5 columns */}
          <article className="lg:col-span-5 flex flex-col justify-between rounded-[24px] border border-[var(--border)] bg-[var(--surface)] p-7 sm:p-9 transition-colors duration-200 hover:border-[var(--accent)]">
            <div>
              <div className="flex items-center justify-between gap-4 text-[0.8125rem] font-medium text-[var(--muted)]">
                <span className="font-bold text-[var(--accent)] tabular-nums">
                  {refreshService.index}. Rapid Elevation
                </span>
                <span>{refreshService.timeline}</span>
              </div>

              <h3 className="mt-4 text-[1.55rem] sm:text-[1.75rem] font-bold tracking-[-0.03em] text-[var(--ink)]">
                {refreshService.title}
              </h3>

              <p className="mt-3 text-[0.9625rem] leading-[1.68] text-[var(--muted)]">
                {refreshService.summary}
              </p>

              <ul className="mt-6 space-y-3 border-t border-[var(--border)] pt-6">
                {refreshService.deliverables.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-2.5 text-[0.9rem] leading-[1.5] text-[var(--ink)]"
                  >
                    <Check
                      className="mt-1 h-4 w-4 shrink-0 text-[var(--accent)]"
                      aria-hidden="true"
                    />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-8">
              <RollButton
                label={refreshService.ctaLabel}
                variant="surface"
                size="md"
                onClick={() => handleChoose(refreshService.serviceValue)}
              />
            </div>
          </article>

          {/* Ongoing Care capability — Full 12-column editorial band */}
          <article className="lg:col-span-12 rounded-[24px] border border-[var(--border)] bg-[var(--surface)] p-7 sm:p-9 transition-colors duration-200 hover:border-[var(--accent)]">
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-center">
              <div className="lg:col-span-5">
                <div className="flex items-center gap-3 text-[0.8125rem] font-medium text-[var(--muted)]">
                  <span className="font-bold text-[var(--accent)] tabular-nums">
                    {careService.index}. Continuous Momentum
                  </span>
                  <span aria-hidden="true">·</span>
                  <span>{careService.timeline}</span>
                </div>
                <h3 className="mt-3 text-[1.5rem] sm:text-[1.75rem] font-bold tracking-[-0.03em] text-[var(--ink)]">
                  {careService.title}
                </h3>
                <p className="mt-2.5 text-[0.9625rem] leading-[1.65] text-[var(--muted)]">
                  {careService.summary}
                </p>
              </div>

              <ul className="lg:col-span-4 space-y-2.5">
                {careService.deliverables.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-2.5 text-[0.9rem] leading-[1.5] text-[var(--ink)]"
                  >
                    <Check
                      className="mt-1 h-4 w-4 shrink-0 text-[var(--accent)]"
                      aria-hidden="true"
                    />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>

              <div className="lg:col-span-3 flex lg:justify-end">
                <RollButton
                  label={careService.ctaLabel}
                  variant="surface"
                  size="md"
                  onClick={() => handleChoose(careService.serviceValue)}
                />
              </div>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
