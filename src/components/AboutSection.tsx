import { useState } from 'react';
import { STUDIO_PHOTOS } from '../data/studioContent';
import { RollButton } from './RollButton';
import { SectionEyebrow } from './SectionEyebrow';

interface AboutSectionProps {
  onOpenStudioModal: () => void;
}

function StudioImageFrame({
  src,
  alt,
  caption,
  aspectClass,
}: {
  src: string;
  alt: string;
  caption: string;
  aspectClass: string;
}) {
  const [failed, setFailed] = useState(false);

  return (
    <figure className="group">
      <div
        className={`relative overflow-hidden rounded-[22px] border border-[var(--border)] bg-[var(--surface-subtle)] ${aspectClass}`}
      >
        {!failed ? (
          <img
            src={src}
            alt={alt}
            referrerPolicy="no-referrer"
            loading="lazy"
            onError={() => setFailed(true)}
            className="h-full w-full object-cover transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.03]"
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center bg-gradient-to-br from-[var(--surface-subtle)] to-[var(--accent-soft)] p-6 text-center">
            <span className="font-['Plus_Jakarta_Sans'] text-sm font-semibold text-[var(--ink)]">
              WebVibe Studio
            </span>
            <span className="mt-1 text-xs text-[var(--muted)]">{caption}</span>
          </div>
        )}
      </div>
      <figcaption className="mt-3 text-[0.8125rem] text-[var(--muted)]">
        {caption}
      </figcaption>
    </figure>
  );
}

export function AboutSection({ onOpenStudioModal }: AboutSectionProps) {
  return (
    <section id="studio" className="scroll-mt-24 sm:scroll-mt-28 py-20 sm:py-28 lg:py-32">
      <div className="mx-auto w-full max-w-[1440px] px-5 sm:px-8 lg:px-12">
        <div className="max-w-[820px]">
          <SectionEyebrow number="1" label="Introducing WebVibe" />
          <h2 className="mt-5 text-[clamp(1.85rem,4vw,3.35rem)] font-bold leading-[1.09] tracking-[-0.035em] text-[var(--ink)] [text-wrap:balance]">
            Strategy-led creatives, delivering results in digital and beyond.
          </h2>
        </div>

        {/* Asymmetric 3-column desktop layout */}
        <div className="mt-12 sm:mt-16 grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-start lg:gap-10">
          {/* Left: Small studio photo */}
          <div className="lg:col-span-3 lg:pt-8">
            <StudioImageFrame
              src={STUDIO_PHOTOS.desk.src}
              alt={STUDIO_PHOTOS.desk.alt}
              caption={STUDIO_PHOTOS.desk.caption}
              aspectClass="aspect-[4/3]"
            />
          </div>

          {/* Center: Descriptive copy & About our studio CTA */}
          <div className="lg:col-span-4 flex flex-col justify-between gap-6 lg:px-2 lg:pt-4">
            <div className="space-y-4 text-[1rem] leading-[1.7] text-[var(--muted)]">
              <p className="text-[1.125rem] font-medium leading-[1.55] text-[var(--ink)]">
                We partner directly with ambitious founders, studios, and growing teams to build websites that earn instant authority and convert decisively.
              </p>
              <p>
                No account-manager layers, no bloated agency retainers, and no cookie-cutter templates. Every typography scale, interaction detail, and page architecture is shaped around how your customers actually decide.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-6 border-y border-[var(--border)] py-5">
              <div>
                <p className="font-['Plus_Jakarta_Sans'] text-[1.65rem] font-bold tracking-[-0.03em] text-[var(--ink)] tabular-nums">
                  40+
                </p>
                <p className="mt-0.5 text-[0.8125rem] text-[var(--muted)]">
                  Digital launches across 9 countries
                </p>
              </div>
              <div>
                <p className="font-['Plus_Jakarta_Sans'] text-[1.65rem] font-bold tracking-[-0.03em] text-[var(--ink)] tabular-nums">
                  &lt; 1.0s
                </p>
                <p className="mt-0.5 text-[0.8125rem] text-[var(--muted)]">
                  Median mobile load speed target
                </p>
              </div>
            </div>

            <div>
              <RollButton
                label="About our studio"
                variant="surface"
                size="md"
                onClick={onOpenStudioModal}
              />
            </div>
          </div>

          {/* Right: Large collaborative studio workspace photo */}
          <div className="lg:col-span-5">
            <StudioImageFrame
              src={STUDIO_PHOTOS.workspace.src}
              alt={STUDIO_PHOTOS.workspace.alt}
              caption={STUDIO_PHOTOS.workspace.caption}
              aspectClass="aspect-[4/3] lg:aspect-[5/4]"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
