import { NAV_LINKS, STUDIO_EMAIL } from '../data/studioContent';
import { WebVibeLogo } from './WebVibeLogo';

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-[var(--border)] bg-[var(--surface)] py-12 sm:py-14">
      <div className="mx-auto w-full max-w-[1440px] px-5 sm:px-8 lg:px-12">
        <div className="flex flex-col justify-between gap-8 md:flex-row md:items-center">
          <div className="flex flex-col gap-2">
            <a href="#top" aria-label="WebVibe Studio home" className="w-fit">
              <WebVibeLogo />
            </a>
            <p className="text-[0.875rem] text-[var(--muted)]">
              Boutique web design &amp; development studio ·{' '}
              <a
                href={`mailto:${STUDIO_EMAIL}`}
                className="font-medium text-[var(--ink)] hover:text-[var(--accent)] transition-colors"
              >
                {STUDIO_EMAIL}
              </a>
            </p>
          </div>

          <nav
            aria-label="Footer navigation"
            className="flex flex-wrap items-center gap-x-7 gap-y-3 text-[0.875rem] font-medium text-[var(--muted)]"
          >
            {NAV_LINKS.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="transition-colors hover:text-[var(--ink)] whitespace-nowrap"
              >
                {item.label}
              </a>
            ))}
          </nav>
        </div>

        <div className="mt-10 flex flex-col justify-between gap-4 border-t border-[var(--border)] pt-6 text-[0.8125rem] text-[var(--muted)] sm:flex-row sm:items-center">
          <p>© {year} WebVibe Studio. Crafted with precision for ambitious brands.</p>
          <a
            href="#top"
            className="w-fit font-semibold text-[var(--ink)] transition-colors hover:text-[var(--accent)]"
          >
            Back to top ↑
          </a>
        </div>
      </div>
    </footer>
  );
}
