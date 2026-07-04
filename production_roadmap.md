# PROJECT NEXUS: PRODUCTION ROADMAP & TECHNICAL IMPLEMENTATION PLAN

**Lead Technical Director & Staff Frontend Engineer Directive**  
**Target Architecture:** Next.js (App Router) + React Three Fiber (R3F) + Three.js + WebGL + Web Audio API + GSAP  
**Deployment Target:** Vercel Edge Network (SSG / ISR / Global CDN)

---

## 1. PROJECT ANALYSIS & ARCHITECTURAL OVERVIEW

Project Nexus is a high-fidelity, spatial interactive portfolio. It operates on a hybrid rendering model where a **WebGL Canvas** manages the 3D environmental states, lighting, physics, and positional sound, while a **semantic DOM layer** handles typography, accessibility, and direct user actions (e.g., input forms, resume downloads, external links).

```
                      [ USER / CLIENT BROWSER ]
                                  │
          ┌───────────────────────┴───────────────────────┐
          ▼                                               ▼
┌───────────────────┐                           ┌───────────────────┐
│     DOM LAYER     │                           │    WEBGL LAYER    │
│  (Next.js / React)│                           │  (Three.js / R3F) │
└─────────┬─────────┘                           └─────────┬─────────┘
          │                                               │
          │             ┌───────────────────┐             │
          └────────────>│   STATE MANAGER   │<────────────┘
                        │  (Zustand Store)  │
                        └─────────┬─────────┘
                                  ▼
                        ┌───────────────────┐
                        │   AUDIO ENGINE    │
                        │  (Web Audio API)  │
                        └───────────────────┘
```

### Core Architecture Specifications

- **Asset Pipeline:** Webpack / Vite GLTF pipeline utilizing Draco compression, mesh-quantization, and KTX2 texture encoding. All structural elements (basalt rock, concrete, travertine marble) are baked using lightmaps to minimize runtime shader recalculations and dynamic shadow overhead.
- **Rendering Loop:** React Three Fiber (R3F) scheduler managing a single requestAnimationFrame loop. Frame-rate budget is strictly locked to 16ms (60fps target) with dynamic resolution scaling based on CPU/GPU thermal and rendering performance.
- **Locomotion & Physics:** Avatar movement runs on a custom virtual camera rail controller with spring-arm collision bounds (via `@react-three/rapier` or a custom lightweight AABB mathematical collision model to avoid physics engine overhead).
- **Dynamic Guide (The Locus):** An autonomous, non-verbal guide entity whose motion is calculated using a cubic Hermite spline interpolation tracking exactly ten paces ahead of the avatar's position.
- **climax Alignment Engine:** The "Convergence of the Lattice" uses a matrix transformation logic where all 10,000 light beams (represented as a single buffered geometry to reduce draw calls) align their local coordinate matrices relative to the camera's viewport matrix to produce a clean, 2D vector blueprint line representation.

---

## 2. PRODUCTION MILESTONES & TIMELINE

This AAA web experience is scheduled across a **12-week development cycle** divided into **6 Bi-Weekly Sprints**.

```mermaid
gantt
    title Project Nexus Development Timeline
    dateFormat  YYYY-MM-DD
    section Core Infrastructure
    Sprint 1: Base Architecture & Engine Setup     :active, s1, 2026-07-06, 14d
    Sprint 2: Spatial Layout & Asset Pipeline      :s2, after s1, 14d
    section District & Mechanics
    Sprint 3: Interactivity, Physics & Guide (Locus):s3, after s2, 14d
    Sprint 4: District Integration & Audio Engine   :s4, after s3, 14d
    section Climax & Polish
    Sprint 5: Signature Moment & Visual Polish     :s5, after s4, 14d
    Sprint 6: Optimization, QA & Deployment        :s6, after s5, 14d
```

---

## 3. PRODUCTION ROADMAP (SPRINT-BY-SPRINT)

### Sprint 1: Core Engine & Boilerplate (Weeks 1-2)

- **Goals:** Establish the Next.js runtime environment, configure the WebGL renderer core, and set up state management.
- **Deliverables:**
  - Initialize Next.js project with Tailwind CSS (for DOM interface overlays) and TypeScript.
  - Set up Zustand store for globally shared interactive states (e.g., active district, camera settings, loading state).
  - Configure custom WebGL canvas wrapper with responsive aspect-ratio handling and baseline post-processing pipeline (Depth of Field, Bloom, Tone Mapping).
  - Implement basic asset preloader managing GLTF, texture, and audio queues.

### Sprint 2: Asset Pipeline & Geometry Foundations (Weeks 3-4)

- **Goals:** Integrate optimized structural models and set up the volumetric spatial layout.
- **Deliverables:**
  - Build standard asset optimization pipelines (Draco compression for 3D meshes, KTX2 conversion for textures).
  - Load low-poly collision models and high-poly visual meshes for the 6 districts.
  - Bake static diffuse lighting and ambient occlusion into lightmaps for the concrete Well, the glass Forge, the obsidian Lattice, the travertine Terrace, and the dark granite Root Vault.
  - Implement initial global camera rail tracking and isometric lock controls.

### Sprint 3: Interaction Mechanics & The Locus (Weeks 5-6)

- **Goals:** Build locomotion physics, interactive elements, and the Locus guide behavior.
- **Deliverables:**
  - Implement user avatar collision detection and camera spring-arm boundaries to prevent wall clipping.
  - Build the Locus guide logic: 10-pace pathing, 15-degree plate rotation in dark zones, and spot-light projection vector shaders.
  - Implement interactive physical nodes: sliding concrete bricks in the Well (5cm offset), deconstructing platforms in the Forge splitting on 3 axes, and Chronograph Stream floating plates.
  - Optimize interaction response times to ensure click-to-visual latency is sub-16ms.

### Sprint 4: Sound Design & Live Telemetry (Weeks 7-8)

- **Goals:** Integrate positional audio layers, dynamic audio filters, and live data API bindings.
- **Deliverables:**
  - Initialize the Web Audio API engine; load and synchronize ambient audio channels (30Hz base hum, wind, rain, fire).
  - Implement dynamic frequency attenuation: drop environmental audio by 12dB during code inspections, and restrict sounds inside enclosed concrete chambers.
  - Set up Next.js Route Handlers to fetch live telemetry: GitHub repository status, commit logs, and server uptime metrics.
  - Bind real-time API metrics to the Nexus Tree branch scaling (Trunk = tenure, Branches = mastery, Leaves = repository health).

### Sprint 5: The Signature Climax & Cinematic Transitions (Weeks 9-10)

- **Goals:** Orchestrate the "Convergence of the Lattice" alignment sequence and camera transitions.
- **Deliverables:**
  - Implement the Lattice of Systems Climax: lock navigation controls, dim choral audio to silence for 3s, trigger the low-frequency sub-bass pulse and pipe organ note.
  - Animate 10,000 skill-grid lines using GPU-instanced matrix transformations to snap to the alignment vector.
  - Develop the obsidian wall drop transition: rotate and slide wall models flat into floor plates in less than 1.0s.
  - Configure the District transitions using camera crane pans and zoom shifts (e.g., 3.5s slow interpolation curve for District 2 horizon reveal).

### Sprint 6: Optimization, Polish & Production Deploy (Weeks 11-12)

- **Goals:** Meet production performance budgets, perform browser compatibility testing, and launch.
- **Deliverables:**
  - Optimize draw calls by merging static geometries and utilizing instanced rendering for foliage, conduits, and light lines.
  - Implement fallback modes: dynamically disable heavy post-processing (volumetric light, high-sample bloom) on lower-end devices.
  - Verify SEO tags, OpenGraph previews, and performance indicators (First Contentful Paint < 0.8s, WebGL FPS steady at 60/30fps).
  - Deploy static assets to a Global CDN and launch the Next.js app on the Vercel Edge Network.

---

## 4. GITHUB MILESTONES & ISSUE TAXONOMY

We will structure the development cycle using **5 GitHub Milestones**. All tasks, bugs, and features will map to these milestones with specific issue labels.

### Milestone 1: Engine Foundation & Core Pipeline

- **Description:** Setup repository boilerplate, next-r3f-canvas, global state manager, and asset loading pipeline.
- **Estimated Completion:** End of Week 2

### Milestone 2: Spatial Architecture & Static Layouts

- **Description:** Optimize, load, and bake the 3D meshes, lightmaps, and static camera rails for all 6 zones.
- **Estimated Completion:** End of Week 4

### Milestone 3: Interactive Mechanics & Guide AI

- **Description:** Implement avatar locomotion, collision boundaries, interactive nodes, and the Locus guide companion behavior.
- **Estimated Completion:** End of Week 6

### Milestone 4: Audio Engine, Data Sync & Telemetry

- **Description:** Integrate Web Audio engine, dynamic sound filters, custom GLSL shaders, and live API data bindings for the Nexus Tree.
- **Estimated Completion:** End of Week 8

### Milestone 5: Climax Orchestration, QA & Vercel Launch

- **Description:** Program the Lattice alignment climax sequence, perform rendering performance optimizations, and deploy to Vercel.
- **Estimated Completion:** End of Week 12

### GitHub Label Schema

- `area/webgl`: WebGL, shaders, meshes, R3F, post-processing.
- `area/dom`: React component overlays, terminal screens, accessibility, inputs.
- `area/audio`: Web Audio API, dynamic mixing, spatial audio triggers.
- `type/performance`: Draco compression, draw call batching, memory leak resolution.
- `type/polish`: Volumetric adjustments, camera easing curves, particle parameters.

---

## 5. PRODUCTION FOLDER STRUCTURE

```
/project-nexus
├── .github/                   # CI/CD Workflows (PR validation, automatic deployment)
├── public/
│   ├── models/                # Optimized GLTF/GLB models (Draco compressed)
│   │   ├── locus.glb
│   │   ├── tree.glb
│   │   └── districts/         # District geometries & baked lightmaps
│   ├── textures/              # KTX2 compressed textures & environment maps
│   ├── audio/                 # Highly compressed OGG/MP3 spatialized audio files
│   └── fonts/                 # WOFF2 files (geometric sans-serif, architectural serif)
├── src/
│   ├── components/
│   │   ├── canvas/            # Three.js / React Three Fiber components
│   │   │   ├── Scene.tsx      # Main WebGL viewport & lighting
│   │   │   ├── Locus.tsx      # Guide entity mechanics & shaders
│   │   │   ├── NexusTree.tsx  # Dynamic growth & crystalline leaves
│   │   │   ├── Camera.tsx     # Custom camera manager & spring-arm rails
│   │   │   ├── PostProcess.tsx# Custom bloom, depth of field, & color grading
│   │   │   └── districts/     # District-specific static meshes & nodes
│   │   ├── dom/               # Standard HTML / React overlay UI
│   │   │   ├── Loader.tsx     # Initial immersive progress loader
│   │   │   ├── HUD.tsx        # In-world text readouts (diegetic overlay)
│   │   │   ├── Terminal.tsx   # Integrated contact forms & input fields
│   │   │   └── Overlay.tsx    # Edge-case fallback menus
│   ├── shaders/               # Custom GLSL Shaders
│   │   ├── crystalline/       # Foliage refraction shader (Index 1.54)
│   │   ├── lightLines/        # Lattice vector pulsing lines shader
│   │   └── mercury/           # Liquid mercury gravity inversion shader
│   ├── store/                 # State management
│   │   └── useStore.ts        # Zustand global configuration
│   ├── hooks/                 # Custom React hooks
│   │   ├── useAudio.ts        # Positional sound triggers & volume envelope controls
│   │   ├── useLocomotion.ts   # Keyboard, mouse, and touch interaction hooks
│   │   └── useTelemetry.ts    # Next.js API data fetcher
│   ├── styles/                # CSS configuration
│   │   └── globals.css        # Minimal styling base (Vanilla CSS-focused)
│   └── pages/ or app/         # Next.js App Router Structure
│       ├── layout.tsx         # Global page wrapper
│       ├── page.tsx           # Home canvas mount point
│       └── api/               # API route handlers for live metrics
```

---

## 6. IMPLEMENTATION PHASES

```
┌──────────────────────────────────────────────────────────────┐
│                  PHASE 1: THE CORE SANDBOX                   │
│   Setup Engine ──> Load Collision Mesh ──> Basic Navigation  │
└──────────────────────────────┬───────────────────────────────┘
                               │
                               ▼
┌──────────────────────────────────────────────────────────────┐
│                PHASE 2: MATERIAL & AESTHETICS                │
│  Bake Lightmaps ──> Dynamic Shaders ──> Preloader Pipeline   │
└──────────────────────────────┬───────────────────────────────┘
                               │
                               ▼
┌──────────────────────────────────────────────────────────────┐
│                 PHASE 3: INTERACTIVE BEHAVIORS               │
│   Locus Guide ──> Deconstructing Nodes ──> Audio Engine      │
└──────────────────────────────┬───────────────────────────────┘
                               │
                               ▼
┌──────────────────────────────────────────────────────────────┐
│                    PHASE 4: LIVE CONNECTIONS                 │
│  GitHub telemetry ──> Uptime data ──> Nexus Tree growth sync │
└──────────────────────────────┬───────────────────────────────┘
                               │
                               ▼
┌──────────────────────────────────────────────────────────────┐
│                   PHASE 5: CINEMATIC CLIMAX                  │
│    Lattice Snapping ──> Wall Collapse ──> Camera Transitions │
└──────────────────────────────┬───────────────────────────────┘
                               │
                               ▼
┌──────────────────────────────────────────────────────────────┐
│                  PHASE 6: HARVEST & LAUNCH                   │
│ Performance audits ──> Fallback systems ──> Vercel Deploy    │
└──────────────────────────────────────────────────────────────┘
```

---

## 7. TECHNICAL DEPENDENCIES & ASSET PIPELINE

### Software Dependencies

- **Next.js (v15+):** Production-ready App Router configuration.
- **Three.js (r160+):** Underpinning 3D WebGL library.
- **React Three Fiber (R3F):** React wrapper for declarative Three.js composition.
- **@react-three/drei:** Utility library (handles Draco loaders, camera paths, HTML overlays).
- **GSAP (GreenSock):** Smooth animations, timeline scrubbing, and camera transition curves.
- **Zustand:** Ultra-lightweight store for high-frequency state updates.
- **Howler.js:** Web Audio API wrapper ensuring cross-device support for dynamic mixing.

### Asset Pipeline Specifications

```
[ High-Poly Model ] ──> [ Blender / Houdini ] ──> [ Bake Lightmaps & AO ]
                                                         │
                                                         ▼
[ Optimized Web Model ] <── [ GLTF-Pack + Draco ] <── [ Export GLTF/GLB ]
         │
         ├──> KTX2 Basis Texture Compression (4x VRAM reduction)
         └──> GLTFjsx (Generates clean React structure components)
```

---

## 8. CRITICAL TECHNICAL RISKS & MITIGATION STRATEGIES

| Risk ID  | Technical Risk Description                                                                                                                                     | Severity     | Mitigation Strategy                                                                                                                                                                                                     |
| :------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------- | :----------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **R-01** | **VRAM Exhaustion (Mobile Devices):** High-resolution textures and uncompressed meshes crash iOS Safari or Android Chrome.                                     | **Critical** | Implement KTX2 texture compression, strict budget constraints (total assets < 25MB), and mesh-quantization. Dynamically switch off post-processing and light refraction shaders on mobile user agents.                  |
| **R-02** | **Flickering / Stuttering (Framerate Drop):** Dynamic shaders and 10,000 active nodes on the Lattice of Systems cause garbage collection or high CPU overhead. | **High**     | Pre-allocate arrays; compile custom shaders during the initial loading sequence. Merge static geometries using InstancedMesh. Use a single unified Zustand store for reactivity rather than deep React context changes. |
| **R-03** | **Audio Lag or Desynchronization:** Positional audio nodes desynced from visual cues, violating the 16ms interaction rule.                                     | **Medium**   | Pre-load sound buffers into Web Audio API node nodes. Use scheduled clock times (`audioContext.currentTime`) rather than relying on Javascript `setTimeout` for timed events.                                           |
| **R-04** | **API Rate Limits / Cold Starts:** Fetching live data from GitHub APIs on every page load stalls rendering.                                                    | **Low**      | Implement Next.js ISR (Incremental Static Regeneration) or Redis caching layers in Next.js Route Handlers. Cache API metrics locally; update background data asynchronously every 1 hour.                               |

---

## 9. MVP SCOPE VS. FUTURE PHASE FEATURE MATRIX

| Feature Area             | Minimal Viable Product (MVP)                                                              | Future Phase (Post-Launch)                                                                |
| :----------------------- | :---------------------------------------------------------------------------------------- | :---------------------------------------------------------------------------------------- |
| **Environmental Layout** | Complete 6-district circular layout with baked lighting, camera rails, and static meshes. | Dynamic real-time weather cycles (snow accumulation on surfaces).                         |
| **Guide (The Locus)**    | Locomotion pathing, plate rotation, and spotlight projection.                             | Full conversational AI bindings where Locus vocalizes responses via Text-to-Speech.       |
| **Data Visualization**   | Deconstruction Pedestals with static code snippets and pre-cached charts.                 | Live production environment log telemetry syncing with active metrics.                    |
| **Interactive Climax**   | Parallax alignment of Lattice vector lines, obsidian wall drop transition.                | Real-time code execution testing inside a retro-terminal sandbox environment.             |
| **User Collaboration**   | Downloadable dossiers, contact forms, and email triggers.                                 | Private multiplayer rooms where developers and recruiters review code side-by-side in 3D. |

---

## 10. RECOMMENDED ORDER OF DEVELOPMENT (CRITICAL PATH)

We recommend developing Project Nexus in the following exact sequence. This order minimizes blockages and ensures that performance and asset load limits are verified at every stage.

1.  **Phase 1: Setup Core Boilerplate & Shader Engine**
    - Create Next.js framework base and initialize the WebGL rendering canvas. Set up global Zustand stores. This ensures all developer workflows conform to the same data pipeline from day one.
2.  **Phase 2: Asset Optimization & Low-Poly Prototype**
    - Verify the asset pipeline by loading basic, low-poly placeholder meshes for the districts. Setup global camera rail tracks and basic locomotion. Establishing bounds early prevents clipping issues later.
3.  **Phase 3: Material Bakes & Lightmap Integrations**
    - Load finalized models with baked lightmaps. Apply custom GLSL shaders (crystalline foliage, light lines, obsidian reflections). Perform immediate performance benchmarks on mobile/desktop devices.
4.  **Phase 4: Guide AI & Interactivity**
    - Incorporate the Locus guide pathing behavior and activate district-specific interaction points (sliding bricks, deconstructing blocks). Implement click-to-visual response metrics.
5.  **Phase 5: Sound Engine Integration**
    - Integrate Web Audio API layers. Synchronize spatial loops, ambient sound dropouts (12dB cuts), and dynamic orchestral transitions.
6.  **Phase 6: Climax Orchestration & Telemetry Sync**
    - Code the "Convergence of the Lattice" matrix alignment sequence and wall drop triggers. Set up Route Handlers to pull live GitHub credentials, syncing them to the Nexus Tree branch growth.
7.  **Phase 7: Optimization Audits & Launch**
    - Conduct audits using performance profiling (CPU heap snapshots, shader warm-up tests). Configure fallback rules for slow networks and old GPUs. Deploy to production on Vercel.
