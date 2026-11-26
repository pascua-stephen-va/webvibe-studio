import studioDeskImg from '../assets/images/studio_desk_detail_1795712548376.jpg';
import studioWorkspaceImg from '../assets/images/studio_workspace_collab_1795712550687.jpg';
import groveGrainImg from '../assets/images/project_grove_grain_1795712550556.jpg';
import mayaReedImg from '../assets/images/project_maya_reed_1795712550753.jpg';

export interface NavItem {
  label: string;
  href: string;
}

export interface CaseStudyMetric {
  value: string;
  label: string;
}

export interface CaseStudy {
  id: string;
  title: string;
  category: string;
  year: string;
  awardNote?: string;
  shortDescription: string;
  ctaLabel: string;
  ctaVariant: 'light' | 'dark';
  ctaIcon: 'link' | 'arrow';
  aspectClass: string;
  imageSrc: string;
  imageAlt: string;
  liveUrlLabel: string;
  summary: string;
  challenge: string;
  solution: string;
  metrics: CaseStudyMetric[];
  deliverables: string[];
  serviceKey: string;
}

export interface ServiceItem {
  id: string;
  index: string;
  title: string;
  summary: string;
  outcome: string;
  deliverables: string[];
  ctaLabel: string;
  serviceValue: string;
  timeline: string;
}

export interface ProcessStep {
  number: string;
  phase: string;
  title: string;
  description: string;
  deliverable: string;
}

export const STUDIO_EMAIL = 'steve@webvi.be';

export const NAV_LINKS: NavItem[] = [
  { label: 'Services', href: '#services' },
  { label: 'Work', href: '#work' },
  { label: 'Process', href: '#process' },
  { label: 'Studio', href: '#studio' },
  { label: 'Contact', href: '#contact' },
];

export const STUDIO_PHOTOS = {
  desk: {
    src: studioDeskImg,
    alt: 'WebVibe Studio desk with typography grid wireframes, ceramic espresso cup, and sketchbook',
    caption: 'Editorial typography & grid systems crafted in-house',
  },
  workspace: {
    src: studioWorkspaceImg,
    alt: 'WebVibe Studio creative directors collaborating over website wireframes in a sunlit oak studio',
    caption: 'Direct senior collaboration from strategy through launch',
  },
};

export const CASE_STUDIES: CaseStudy[] = [
  {
    id: 'grove-and-grain',
    title: 'Grove & Grain',
    category: 'Artisanal Retail & Hospitality',
    year: '2025',
    awardNote: 'Winner of Site of the Month 2025',
    shortDescription:
      'Winner of Site of the Month 2025 — a tactile editorial storefront and pre-order experience crafted for an acclaimed neighborhood bakery and ceramics house.',
    ctaLabel: 'Learn more',
    ctaVariant: 'light',
    ctaIcon: 'link',
    aspectClass: 'aspect-[329/246]',
    imageSrc: groveGrainImg,
    imageAlt:
      'Grove & Grain artisan sourdough loaf and stoneware ceramics styled on warm walnut wood in morning light',
    liveUrlLabel: 'groveandgrain.co',
    summary:
      'Grove & Grain needed an online flagship that translated the warmth of their morning bakes and hand-thrown stoneware into a frictionless local pickup and nationwide drop experience.',
    challenge:
      'Their legacy template hid seasonal drops behind four menus and took over five seconds to load on mobile, causing 60% drop-off before checkout.',
    solution:
      'We designed a tactile editorial storefront with instant single-page bake-drop reservations, editorial storytelling, and sub-second page transitions.',
    metrics: [
      { value: '+184%', label: 'Online pre-orders in 90 days' },
      { value: '0.6s', label: 'Mobile largest contentful paint' },
      { value: '42%', label: 'Repeat weekly customer rate' },
    ],
    deliverables: [
      'Brand Direction & Art Direction',
      'Custom React Storefront Architecture',
      'Bake-Drop Reservation & Pickup Flow',
      'Performance & Local SEO Tuning',
    ],
    serviceKey: 'Website Design & Build',
  },
  {
    id: 'maya-reed-consulting',
    title: 'Maya Reed Consulting',
    category: 'Executive Strategic Advisory',
    year: '2025',
    shortDescription:
      'A conversion-focused advisory platform structured to qualify enterprise retainers, articulate methodology with calm authority, and turn executive visits into booked discovery calls.',
    ctaLabel: 'View case study',
    ctaVariant: 'dark',
    ctaIcon: 'arrow',
    aspectClass: 'aspect-square',
    imageSrc: mayaReedImg,
    imageAlt:
      'Maya Reed Consulting minimalist travertine advisory studio bathed in natural fluted-glass daylight',
    liveUrlLabel: 'mayareed.advisory',
    summary:
      'Independent transformation advisor Maya Reed needed a flagship digital presence that commanded enterprise credibility while filtering for senior decision-makers.',
    challenge:
      'Prospects arrived via LinkedIn and keynote referrals but lacked clear engagement tiers or a guided way to book qualified advisory calls.',
    solution:
      'We reframed her positioning around concrete engagement tracks, interactive case briefs, and an integrated qualification-first scheduling flow.',
    metrics: [
      { value: '+210%', label: 'Qualified discovery calls in 4 months' },
      { value: '4.8%', label: 'Visitor-to-booking conversion rate' },
      { value: '3.2x', label: 'Average retainer deal size' },
    ],
    deliverables: [
      'Positioning & Conversion Copy Architecture',
      'Editorial Design System (Light & Dark)',
      'Interactive Engagement Scope Calculator',
      'CRM & Calendar Qualification Funnel',
    ],
    serviceKey: 'Website Design & Build',
  },
];

export const SERVICES: ServiceItem[] = [
  {
    id: 'design-build',
    index: '01',
    title: 'Website Design & Build',
    summary:
      'Flagship marketing sites, storefronts, and digital platforms crafted from first principles—engineered for speed, search visibility, and measurable conversion.',
    outcome: 'Built to position your brand as the clear category leader.',
    deliverables: [
      'Positioning, information architecture & wireframe prototypes',
      'Custom responsive visual system with purposeful micro-interactions',
      'Production React / modern web engineering & CMS handoff',
      'Core Web Vitals optimization & technical SEO foundation',
    ],
    ctaLabel: 'Plan a new website',
    serviceValue: 'Website Design & Build',
    timeline: '4–6 weeks',
  },
  {
    id: 'refresh',
    index: '02',
    title: 'Website Refresh',
    summary:
      'Transform a dated or underperforming site without starting from zero. We sharpen typography, streamline mobile journeys, and unblock conversion friction.',
    outcome: 'Immediate uplift in brand perception and enquiry rate.',
    deliverables: [
      'UX & conversion audit of existing pages',
      'Visual modernization & responsive layout polish',
      'Sharper headlines, hierarchy & enquiry calls-to-action',
    ],
    ctaLabel: 'Talk about a refresh',
    serviceValue: 'Website Refresh',
    timeline: '2–3 weeks',
  },
  {
    id: 'care',
    index: '03',
    title: 'Ongoing Website Care',
    summary:
      'A senior design and engineering partner on retainer—handling iterative landing pages, performance monitoring, backups, and swift content updates.',
    outcome: 'Your digital flagship stays sharp long after launch day.',
    deliverables: [
      'Dedicated monthly design & development hours',
      'Proactive uptime, speed checks & security updates',
      'Direct async Slack/email access with 24-hour turnaround',
    ],
    ctaLabel: 'Explore ongoing care',
    serviceValue: 'Ongoing Website Care',
    timeline: 'Monthly retainer',
  },
];

export const PROCESS_STEPS: ProcessStep[] = [
  {
    number: '01',
    phase: 'Discover',
    title: 'Strategy & Positioning',
    description:
      'We align on your commercial goals, audience psychology, and competitive landscape before opening a single design canvas.',
    deliverable: 'Creative brief & sitemap',
  },
  {
    number: '02',
    phase: 'Plan',
    title: 'Direction & Fixed Scope',
    description:
      'You receive a clear written timeline, visual mood direction, and fixed transparent pricing with zero agency surprises.',
    deliverable: 'Wireframes & fixed quote',
  },
  {
    number: '03',
    phase: 'Create',
    title: 'Design & Engineering',
    description:
      'We craft interactive prototypes and production code in tight weekly loops—reviewing live URLs across desktop and mobile.',
    deliverable: 'Live staging site',
  },
  {
    number: '04',
    phase: 'Launch',
    title: 'Go Live & Momentum',
    description:
      'Rigorous QA, analytics, SEO checks, and smooth DNS deployment followed by walkthrough guides and ongoing support.',
    deliverable: 'Production launch & care',
  },
];

export const STUDIO_PROFILE = {
  location: 'Based in the Philippines · Collaborating worldwide',
  founded: 'Independent Boutique Studio',
  philosophy:
    'We partner with a focused roster of founders and teams each quarter so every project gets senior craft—never passed down to junior tiers or generic templates.',
  principles: [
    {
      title: 'Direct Senior Collaboration',
      detail:
        'Work directly with the strategist, designer, and engineer shaping your site from kickoff to launch.',
    },
    {
      title: 'Conversion-First Craft',
      detail:
        'Visual restraint, crisp typography, and purposeful micro-interactions designed to make the next step effortless.',
    },
    {
      title: 'Sub-Second Engineering',
      detail:
        'Clean semantic markup, accessible controls, and lightweight media engineered for instant mobile loads.',
    },
    {
      title: 'Async-Friendly Across Time Zones',
      detail:
        'Structured weekly Loom walkthroughs, shared live previews, and responsive communication across North America, Europe, and APAC.',
    },
  ],
};
