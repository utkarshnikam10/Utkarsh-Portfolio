# NEXUS - Utkarsh's interactive portfolio

NEXUS is a production-ready Next.js portfolio experience. A compact procedural 3D world is the opening navigation, and the first scroll movement becomes a camera-led story before it resolves into a readable portfolio dossier.

It takes inspiration from the _principle_ behind high-craft interactive portfolios: spatial storytelling, clear case-study hierarchy, and purposeful motion. It does not reuse a third-party room, model, or source code.

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). To use a different port:

```bash
npm run dev -- -p 3001
```

## Checks

```bash
npm run typecheck
npm run lint
npm run build
```

## Experience map

1. **Arrival** - a procedural R3F landscape introduces Utkarsh and six clickable locations.
2. **World navigation** - each landmark has hover feedback, a camera transition, a focused content panel, keyboard-operable dock control, and visited state.
3. **Spatial scroll story** - when the visitor leaves the landing screen, scroll progresses the world camera through several deliberate compositions.
4. **Portfolio dossier** - About, selected work, capabilities, trajectory, and contact reveal in a hierarchy that remains usable without interacting with WebGL.

## Personalize before launch

The visual system and code are ready to deploy, but a portfolio must use real data. Replace the clearly marked demo case studies and temporary contact data in:

- `src/sections/PortfolioScroll.tsx` - project names, project descriptions, skills, experience, contact links.
- `src/constants/chapters.ts` - world chapter text, metrics, and destinations.
- `src/constants/site.ts` - canonical URL and email address.
- `src/app/layout.tsx` - metadata title and social preview settings.

For a complete launch, supply verified project case studies, resume/CV facts, GitHub, LinkedIn, preferred email, and final domain. Do not publish fictional outcomes or the placeholder email as if they are real.

## Architecture

```text
src/
  app/                 App Router entry points, metadata, global styles
  components/ui/       Shared UI primitives
  sections/            Interactive world and dossier sections
  hooks/               Lenis, media-query, world-state, and scroll lifecycle hooks
  constants/           Content and camera compositions
  types/               Strict TypeScript contracts
  three/components/    Procedural R3F primitives
  three/scenes/        Canvas and camera choreography
```

## Performance and accessibility

- The 3D scene is dynamically imported and uses procedural low-poly geometry rather than heavy GLTF assets.
- DPR is capped at `1.75`; camera movement and scroll updates avoid React re-renders on every frame.
- Scroll motion uses Lenis, camera choreography uses GSAP, and content reveals use Framer Motion.
- Buttons, landmarks, links, and focus states have semantic equivalents. Reduced motion shortens the cinematic parts.

## Deployment

This is Vercel-ready. Import the `nexus` directory as the project root, add the final domain to `src/constants/site.ts`, and deploy. No runtime environment variables are required for the current experience.
