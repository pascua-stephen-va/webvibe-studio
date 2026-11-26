# WebVibe Studio

A boutique web design and development agency website built with React, TypeScript, Vite, and Tailwind CSS. Features a custom WebGL fluted-glass shader hero, editorial case study modals, interactive service and process sections, local time awareness, dark/light theme persistence, and a validated enquiry & call-booking workflow.

## Highlights

- **Interactive WebGL Fluted-Glass Hero** — Smooth pointer-reactive shader canvas with CSS fallback and reduced-motion support.
- **Light & Dark Theme System** — Persistent theme preference with flicker-free initialization before first paint.
- **Editorial Case Studies & Studio Modal** — Detailed project breakdowns, metrics, and deliverables with direct project-inquiry prefill.
- **Services, Process & Contact** — Structured service tracks, four-phase delivery workflow, real-time local studio clock, validated enquiry form, and discovery call scheduling.
- **GitHub Pages Ready** — Relative Vite asset base (`./`), `.nojekyll`, and an automated GitHub Actions build & deploy workflow.

## Tech Stack

- **Framework:** React 19 + TypeScript
- **Build Tool:** Vite 8
- **Styling:** Tailwind CSS 4
- **Motion & Icons:** Motion, Lucide React
- **Testing:** Node Test Runner (`node:test`) via `tsx`

## Getting Started

### Prerequisites

- Node.js 20 or 22+
- npm 10+

### Installation & Local Development

```bash
npm install --legacy-peer-deps
npm run dev
```

The development server runs at `http://localhost:3000`.

### Available Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the Vite dev server on port 3000 |
| `npm run build` | Bundle the production site into `./dist` |
| `npm run preview` | Preview the `./dist` production build locally |
| `npm run lint` | Run TypeScript type checking (`tsc --noEmit`) |
| `npm test` | Run unit tests for core studio utilities |

## Project Structure

```text
├── .github/workflows/
│   └── deploy.yml          # GitHub Pages CI/CD (build & deploy ./dist)
├── public/
│   ├── .nojekyll           # Ensures GitHub Pages serves Vite assets cleanly
│   └── assets/aistudio/    # Favicon and brand mark assets
├── src/
│   ├── assets/images/      # Studio and case study photography
│   ├── components/         # Modular UI sections and WebGL shader canvas
│   ├── data/               # Structured studio copy, case studies, services, process
│   ├── utils/              # Pure logic helpers and unit tests
│   ├── App.tsx             # Root layout and modal/theme state
│   └── index.css           # Tailwind CSS theme tokens and base styles
├── index.html
├── package.json
└── vite.config.ts
```

## Deployment (GitHub Pages)

This repository includes `.github/workflows/deploy.yml`, which automatically runs `npm install --legacy-peer-deps`, builds the site into `./dist`, and deploys it to GitHub Pages on every push to `main` (or manual dispatch).

To activate deployment on GitHub:

1. Open your repository **Settings → Pages**.
2. Under **Build and deployment**, set **Source** to **GitHub Actions**.
3. Push to the `main` branch or run the **Deploy to GitHub Pages** workflow from the **Actions** tab.
