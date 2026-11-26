import { useEffect, useState } from 'react';
import { AboutSection } from './components/AboutSection';
import { CaseStudiesSection } from './components/CaseStudiesSection';
import { ContactSection } from './components/ContactSection';
import { DetailModal } from './components/DetailModal';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { ProcessSection } from './components/ProcessSection';
import { ServicesSection } from './components/ServicesSection';
import type { CaseStudy } from './data/studioContent';
import { getNextTheme, resolveInitialTheme, type ThemeMode } from './utils/studioLogic';

const THEME_STORAGE_KEY = 'webvibe-studio-theme';

function readInitialTheme(): ThemeMode {
  if (typeof window === 'undefined') return 'light';
  try {
    const saved = window.localStorage.getItem(THEME_STORAGE_KEY);
    return resolveInitialTheme(saved, false);
  } catch {
    return 'light';
  }
}

export default function App() {
  const [theme, setTheme] = useState<ThemeMode>(readInitialTheme);
  const [activeCaseStudy, setActiveCaseStudy] = useState<CaseStudy | null>(null);
  const [studioModalOpen, setStudioModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState('Website Design & Build');

  useEffect(() => {
    const root = document.documentElement;
    root.dataset.theme = theme;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    const metaTheme = document.querySelector('meta[name="theme-color"]');
    if (metaTheme) {
      metaTheme.setAttribute('content', theme === 'dark' ? '#080D20' : '#F7F8FC');
    }
    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, theme);
    } catch {
      // Ignore storage errors in restricted environments
    }
  }, [theme]);

  const handleToggleTheme = () => {
    setTheme((prev) => getNextTheme(prev));
  };

  const handleStartSimilarProject = (serviceValue: string) => {
    setSelectedService(serviceValue);
    setActiveCaseStudy(null);
    setStudioModalOpen(false);
    window.setTimeout(() => {
      document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
    }, 60);
  };

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--ink)]">
      <Header theme={theme} onToggleTheme={handleToggleTheme} />

      <main>
        <Hero theme={theme} />
        <AboutSection onOpenStudioModal={() => setStudioModalOpen(true)} />
        <CaseStudiesSection onSelectCaseStudy={(study) => setActiveCaseStudy(study)} />
        <ServicesSection onSelectService={(service) => setSelectedService(service)} />
        <ProcessSection />
        <ContactSection preselectedService={selectedService} />
      </main>

      <Footer />

      <DetailModal
        caseStudy={activeCaseStudy}
        studioOpen={studioModalOpen}
        onClose={() => {
          setActiveCaseStudy(null);
          setStudioModalOpen(false);
        }}
        onStartSimilarProject={handleStartSimilarProject}
      />
    </div>
  );
}
