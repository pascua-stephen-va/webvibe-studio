import { useCallback, useEffect, useState } from 'react';
import { MapPin, Menu, Moon, Sun, X } from 'lucide-react';
import { NAV_LINKS } from '../data/studioContent';
import {
  formatLocalStudioTime,
  parseReverseGeocodeCity,
  type LocalStudioClock,
  type ReverseGeocodePayload,
  type ThemeMode,
} from '../utils/studioLogic';
import { RollButton } from './RollButton';
import { WebVibeLogo } from './WebVibeLogo';

interface HeaderProps {
  theme: ThemeMode;
  onToggleTheme: () => void;
}

const CITY_CACHE_KEY = 'webvibe-studio-precise-city';

async function reverseGeocodeCoords(lat: number, lon: number): Promise<string | null> {
  try {
    const res = await fetch(
      `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${encodeURIComponent(
        lat
      )}&longitude=${encodeURIComponent(lon)}&localityLanguage=en`
    );
    if (res.ok) {
      const data = (await res.json()) as ReverseGeocodePayload;
      const parsed = parseReverseGeocodeCity(data);
      if (parsed) return parsed;
    }
  } catch {
    // Try Nominatim fallback below
  }

  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${encodeURIComponent(
        lat
      )}&lon=${encodeURIComponent(lon)}&zoom=10`
    );
    if (res.ok) {
      const data = (await res.json()) as ReverseGeocodePayload;
      return parseReverseGeocodeCity(data);
    }
  } catch {
    return null;
  }
  return null;
}

async function fetchIpFallbackCity(): Promise<string | null> {
  try {
    const res = await fetch('https://ipwho.is/');
    if (!res.ok) return null;
    const data = (await res.json()) as ReverseGeocodePayload & {
      success?: boolean;
      region?: string;
      country?: string;
    };
    if (data.success === false) return null;
    return parseReverseGeocodeCity({
      city: data.city,
      principalSubdivision: data.region,
      countryName: data.country,
    });
  } catch {
    return null;
  }
}

export function Header({ theme, onToggleTheme }: HeaderProps) {
  const [preciseCity, setPreciseCity] = useState<string | null>(() => {
    try {
      return window.sessionStorage.getItem(CITY_CACHE_KEY);
    } catch {
      return null;
    }
  });
  const [locating, setLocating] = useState(false);
  const [clock, setClock] = useState<LocalStudioClock>(() =>
    formatLocalStudioTime(new Date(), undefined, preciseCity)
  );
  const [drawerOpen, setDrawerOpen] = useState(false);

  const saveResolvedCity = useCallback((city: string) => {
    setPreciseCity(city);
    try {
      window.sessionStorage.setItem(CITY_CACHE_KEY, city);
    } catch {
      // Ignore storage errors
    }
  }, []);

  const resolvePreciseLocation = useCallback(async () => {
    setLocating(true);
    const applyIpFallback = async () => {
      const ipCity = await fetchIpFallbackCity();
      if (ipCity) saveResolvedCity(ipCity);
      setLocating(false);
    };

    if (typeof navigator === 'undefined' || !('geolocation' in navigator)) {
      await applyIpFallback();
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        const resolved = await reverseGeocodeCoords(latitude, longitude);
        if (resolved) {
          saveResolvedCity(resolved);
          setLocating(false);
        } else {
          await applyIpFallback();
        }
      },
      async () => {
        await applyIpFallback();
      },
      {
        enableHighAccuracy: true,
        timeout: 8000,
        maximumAge: 1000 * 60 * 15,
      }
    );
  }, [saveResolvedCity]);

  useEffect(() => {
    if (!preciseCity) {
      void resolvePreciseLocation();
    }
  }, [preciseCity, resolvePreciseLocation]);

  useEffect(() => {
    const updateClock = () =>
      setClock(formatLocalStudioTime(new Date(), undefined, preciseCity));
    updateClock();
    const timer = window.setInterval(updateClock, 1000);
    return () => window.clearInterval(timer);
  }, [preciseCity]);

  useEffect(() => {
    if (!drawerOpen) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setDrawerOpen(false);
    };
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [drawerOpen]);

  return (
    <>
      <header className="fixed inset-x-0 top-3 sm:top-4 z-50 px-3 sm:px-6 pointer-events-none">
        <div
          className="pointer-events-auto mx-auto flex h-[56px] sm:h-[62px] w-full max-w-[1440px] items-center justify-between gap-4 rounded-full border border-[var(--border)] bg-[var(--nav-glass)] pl-2.5 pr-2 sm:pl-3.5 sm:pr-2.5 backdrop-blur-xl transition-colors duration-200"
          style={{ boxShadow: 'var(--shadow-nav)' }}
        >
          {/* Left: Wave/pulse logo + Navigation links */}
          <div className="flex items-center gap-6 xl:gap-8 min-w-0">
            <a
              href="#top"
              aria-label="WebVibe Studio home"
              className="rounded-full focus-visible:outline-offset-4"
            >
              <WebVibeLogo />
            </a>

            <nav
              aria-label="Main navigation"
              className="hidden lg:flex items-center gap-6 text-[0.875rem] font-medium text-[var(--muted)]"
            >
              {NAV_LINKS.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="relative py-1 whitespace-nowrap shrink-0 transition-colors duration-150 hover:text-[var(--ink)] after:absolute after:inset-x-0 after:bottom-0 after:h-[1.5px] after:origin-left after:scale-x-0 after:bg-[var(--accent)] after:transition-transform after:duration-200 hover:after:scale-x-100"
                >
                  {item.label}
                </a>
              ))}
            </nav>
          </div>

          {/* Right: Dynamic 12-hour clock with precise location, theme toggle, primary CTA */}
          <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
            <button
              type="button"
              onClick={() => void resolvePreciseLocation()}
              data-testid="header-local-clock"
              title="Refresh precise location"
              aria-label={`Local time ${clock.fullLabel}. Click to refresh precise location`}
              className="hidden xl:inline-flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-[0.8125rem] font-medium text-[var(--muted)] tabular-nums whitespace-nowrap transition-colors hover:text-[var(--ink)] cursor-pointer"
            >
              <MapPin
                className={`h-3.5 w-3.5 text-[var(--accent)] shrink-0 ${locating ? 'opacity-50' : ''}`}
                aria-hidden="true"
              />
              <span>
                {clock.time} · {preciseCity ? clock.city : locating ? 'Locating…' : clock.city}
              </span>
            </button>

            <button
              type="button"
              onClick={onToggleTheme}
              aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
              title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--surface)] text-[var(--ink)] transition-colors duration-200 hover:border-[var(--accent)] hover:text-[var(--accent)] cursor-pointer shrink-0"
            >
              {theme === 'dark' ? (
                <Sun className="h-[18px] w-[18px]" aria-hidden="true" />
              ) : (
                <Moon className="h-[18px] w-[18px]" aria-hidden="true" />
              )}
            </button>

            <div className="hidden sm:block">
              <RollButton label="Start a project" href="#contact" size="sm" />
            </div>

            <button
              type="button"
              onClick={() => setDrawerOpen((prev) => !prev)}
              aria-label={drawerOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={drawerOpen}
              aria-controls="mobile-bottom-drawer"
              className="inline-flex lg:hidden h-10 w-10 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--surface)] text-[var(--ink)] transition-colors duration-200 hover:border-[var(--accent)] cursor-pointer shrink-0"
            >
              {drawerOpen ? (
                <X className="h-5 w-5" aria-hidden="true" />
              ) : (
                <Menu className="h-5 w-5" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Bottom Slide-Up Drawer */}
      <div
        id="mobile-bottom-drawer"
        role="dialog"
        aria-modal="true"
        aria-label="Mobile navigation menu"
        aria-hidden={!drawerOpen}
        onClick={(e) => {
          if (e.target === e.currentTarget) setDrawerOpen(false);
        }}
        className={`fixed inset-0 z-50 flex items-end justify-center bg-[#080D20]/60 p-3 backdrop-blur-sm transition-opacity duration-200 lg:hidden ${
          drawerOpen
            ? 'opacity-100 pointer-events-auto'
            : 'opacity-0 pointer-events-none'
        }`}
      >
        <div
          className={`w-full max-w-[540px] rounded-[28px] border border-[var(--border)] bg-[var(--surface)] p-6 transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
            drawerOpen ? 'translate-y-0' : 'translate-y-12'
          }`}
          style={{ boxShadow: 'var(--shadow-card)' }}
        >
          <div className="mx-auto mb-5 h-1 w-10 rounded-full bg-[var(--border)]" />

          <div className="flex items-center justify-between pb-4 border-b border-[var(--border)]">
            <WebVibeLogo />
            <button
              type="button"
              onClick={() => setDrawerOpen(false)}
              aria-label="Close navigation menu"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--bg)] text-[var(--ink)] cursor-pointer"
            >
              <X className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>

          <div className="mt-4 flex items-center justify-between gap-2 text-[0.8125rem] text-[var(--muted)]">
            <span className="font-medium text-[var(--ink)]">Local time</span>
            <span className="tabular-nums font-medium">
              {clock.time} · {preciseCity ? clock.city : locating ? 'Locating…' : clock.city}
            </span>
          </div>

          <nav aria-label="Mobile navigation" className="mt-4 flex flex-col">
            {NAV_LINKS.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setDrawerOpen(false)}
                className="flex items-center justify-between border-b border-[var(--border)] py-3.5 font-['Plus_Jakarta_Sans'] text-[1.25rem] font-bold text-[var(--ink)] transition-colors hover:text-[var(--accent)]"
              >
                <span>{item.label}</span>
                <span className="text-sm text-[var(--muted)]" aria-hidden="true">
                  ↗
                </span>
              </a>
            ))}
          </nav>

          <div className="mt-6">
            <RollButton
              label="Start a project"
              href="#contact"
              size="lg"
              className="w-full"
              onClick={() => setDrawerOpen(false)}
            />
          </div>
        </div>
      </div>
    </>
  );
}
