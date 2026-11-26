import { BadgeCheck } from 'lucide-react';
import type { ThemeMode } from '../utils/studioLogic';
import { HeroShaderCanvas } from './HeroShaderCanvas';
import { RollButton } from './RollButton';

interface HeroProps {
  theme: ThemeMode;
}

export function Hero({ theme }: HeroProps) {
  return (
    <section
      id="top"
      className="relative flex min-h-[100svh] w-full flex-col justify-end overflow-hidden pt-28 pb-12 sm:pb-16 lg:pb-20"
    >
      <HeroShaderCanvas theme={theme} />

      <div className="relative z-10 mx-auto w-full max-w-[1440px] px-5 sm:px-8 lg:px-12">
        <div className="max-w-[1040px]">
          {/* Studio badge with purple dot */}
          <div className="inline-flex items-center gap-2.5 rounded-full border border-[var(--border)] bg-[var(--surface)]/85 px-4 py-1.5 backdrop-blur-md">
            <span
              aria-hidden="true"
              className="h-2 w-2 rounded-full bg-[var(--accent)]"
            />
            <span className="text-[0.875rem] font-semibold tracking-[-0.01em] text-[var(--ink)]">
              WebVibe Studio
            </span>
          </div>

          {/* Fluid H1 */}
          <h1 className="mt-6 text-[clamp(1.75rem,7vw,4.2rem)] font-bold leading-[1.08] tracking-[-0.03em] text-[var(--ink)] [text-wrap:balance]">
            We craft digital experiences for brands ready to dominate their category online.
          </h1>

          {/* CTA Row: Purple pill CTA + Certified Partner featured trust badge */}
          <div className="mt-8 sm:mt-10 flex flex-wrap items-center gap-4 sm:gap-6">
            <RollButton
              label="Let’s talk about your project"
              href="#contact"
              size="lg"
            />

            <div
              className="inline-flex items-center gap-3 rounded-full border border-[var(--border)] bg-[var(--surface)]/90 px-4 py-2.5 backdrop-blur-md"
              aria-label="Certified Partner studio recognition"
            >
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[var(--accent-soft)] text-[var(--accent)] shrink-0">
                <BadgeCheck className="h-4 w-4" aria-hidden="true" />
              </span>
              <div className="leading-tight">
                <p className="text-[0.8125rem] font-bold text-[var(--ink)]">
                  Certified Partner
                </p>
                <p className="text-[0.75rem] text-[var(--muted)]">
                  Design &amp; Engineering Excellence
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Full-width editorial anchor strip aligned with floating header */}
        <div className="mt-10 sm:mt-14 flex w-full flex-wrap items-center justify-between gap-4 border-t border-[var(--border)]/80 pt-5 text-[0.8125rem] text-[var(--muted)]">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <span>Boutique Web Design &amp; Development</span>
            <span aria-hidden="true">·</span>
            <span>Strategy, Identity &amp; High-Conversion Engineering</span>
          </div>
          <a
            href="#work"
            className="font-semibold text-[var(--ink)] transition-colors hover:text-[var(--accent)] whitespace-nowrap"
          >
            Explore selected work ↓
          </a>
        </div>
      </div>
    </section>
  );
}
