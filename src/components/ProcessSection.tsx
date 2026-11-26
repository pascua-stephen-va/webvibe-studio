import { PROCESS_STEPS } from '../data/studioContent';
import { SectionEyebrow } from './SectionEyebrow';

export function ProcessSection() {
  return (
    <section
      id="process"
      className="scroll-mt-24 sm:scroll-mt-28 border-t border-[var(--border)] bg-[var(--surface)] py-20 sm:py-28 lg:py-32"
    >
      <div className="mx-auto w-full max-w-[1440px] px-5 sm:px-8 lg:px-12">
        <div className="max-w-[760px]">
          <SectionEyebrow number="4" label="How we work" />
          <h2 className="mt-5 text-[clamp(1.85rem,4vw,3.25rem)] font-bold leading-[1.09] tracking-[-0.035em] text-[var(--ink)] [text-wrap:balance]">
            Simple from first chat to launch day.
          </h2>
          <p className="mt-4 max-w-[54ch] text-[1rem] leading-[1.68] text-[var(--muted)]">
            A clear, senior-led four-stage cadence designed for effortless remote collaboration across every time zone.
          </p>
        </div>

        <ol className="mt-12 sm:mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-10">
          {PROCESS_STEPS.map((step) => (
            <li
              key={step.number}
              className="flex flex-col justify-between border-t border-[var(--border)] pt-6"
            >
              <div>
                <div className="flex items-center justify-between text-[0.8125rem] font-semibold">
                  <span className="font-['Plus_Jakarta_Sans'] text-[1.75rem] font-bold text-[var(--accent)] tabular-nums">
                    {step.number}
                  </span>
                  <span className="text-[var(--muted)]">{step.phase}</span>
                </div>
                <h3 className="mt-5 text-[1.25rem] font-bold tracking-[-0.025em] text-[var(--ink)]">
                  {step.title}
                </h3>
                <p className="mt-2.5 text-[0.9375rem] leading-[1.65] text-[var(--muted)]">
                  {step.description}
                </p>
              </div>
              <p className="mt-6 text-[0.8125rem] font-semibold text-[var(--ink)]">
                Deliverable · <span className="font-normal text-[var(--muted)]">{step.deliverable}</span>
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
