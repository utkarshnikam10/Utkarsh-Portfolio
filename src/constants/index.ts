// ═══════════════════════════════════════════════════════════
// PROJECT NEXUS // CONSTANTS & DATA
// Clean developer portfolio data reflecting top-tier engineering
// ═══════════════════════════════════════════════════════════

export const navLinks = [
  { href: "#about", label: "About" },
  { href: "#skills", label: "Skills" },
  { href: "#projects", label: "Projects" },
  { href: "#experience", label: "Experience" },
  { href: "#achievements", label: "Achievements" },
  { href: "#contact", label: "Contact" },
];

export const personalPhilosophy = {
  journey:
    "Beginning as a self-taught engineer fascinated by creative tech, I have spent the last 6+ years constructing high-performance systems and interactive 3D digital environments.",
  goals:
    "My mission is to merge engineering precision with spatial design, building web experiences that are not only blazingly fast but visually unforgettable.",
  philosophy:
    "I believe that software should feel alive. Micro-animations, responsive spring physics, and organic lighting are not details—they are the core of a premium digital craft.",
};

export const skillsData = [
  {
    category: "Frontend",
    skills: [
      "React / Next.js",
      "TypeScript",
      "Three.js / R3F",
      "GSAP / Framer Motion",
      "Tailwind CSS",
      "WebGL / Shaders",
    ],
  },
  {
    category: "Backend",
    skills: [
      "Node.js / Express",
      "Python / FastAPI",
      "GraphQL / REST APIs",
      "WebSockets / Socket.io",
      "gRPC / Protocol Buffers",
    ],
  },
  {
    category: "Databases",
    skills: ["PostgreSQL", "Redis Cache", "MongoDB", "Pinecone (Vector DB)", "Prisma / Mongoose"],
  },
  {
    category: "Cloud & DevOps",
    skills: [
      "Docker / Containers",
      "Vercel / Netlify",
      "Google Cloud / GCP",
      "AWS Core Services",
      "GitHub Actions CI/CD",
    ],
  },
  {
    category: "AI & Tools",
    skills: [
      "Gemini SDK / OpenAI API",
      "LangChain / Agents",
      "Git Version Control",
      "Figma Design",
      "Webpack / Vite",
    ],
  },
];

export const projectsData = [
  {
    id: "nexus-engine",
    title: "Nexus 3D Fluid Engine",
    description:
      "An interactive browser-based WebGL fluid dynamics simulator rendering real-time physics and volumetric smoke displacement.",
    tech: ["Three.js", "GLSL Shaders", "React Three Fiber", "GSAP"],
    challenge:
      "Rendering fluid turbulence on the CPU caused severe performance drops below 20 FPS.",
    solution:
      "Offloaded particle calculation to custom GPU fragment shaders using floating-point texture buffers.",
    impact:
      "Achieved buttery-smooth fluid simulations at 60 FPS on both mobile devices and high-DPI desktop screens.",
    github: "https://github.com/utkarsh/nexus-engine",
    demo: "https://nexus-engine.vercel.app",
    image: "/project1.jpg",
  },
  {
    id: "linear-orchestrator",
    title: "Offline-First Task Orchestrator",
    description:
      "A fast, keyboard-shortcut driven command center and bento-grid board layout with real-time replication.",
    tech: ["Next.js", "TypeScript", "Node.js", "Redis", "WebSockets"],
    challenge:
      "Preventing UI stutter or lag during batch synchronization on flaky network connections.",
    solution:
      "Designed an optimistic local cache state machine synchronized asynchronously via socket protocols.",
    impact:
      "Reduced local action response time to under 12ms and successfully synchronized tasks on reconnect without conflicts.",
    github: "https://github.com/utkarsh/task-orchestrator",
    demo: "https://task-orchestrator.vercel.app",
    image: "/project2.jpg",
  },
  {
    id: "stripe-billing",
    title: "Stripe Real-Time Billing Telemetry",
    description:
      "Financial telemetry dashboard processing 10k transactions/sec with real-time websocket charting metrics.",
    tech: ["React", "FastAPI", "PostgreSQL", "Redis", "Recharts"],
    challenge:
      "Buffering large volume transaction payloads without causing browser UI blocking or memory leaks.",
    symbol: "⚡",
    solution:
      "Created a sliding-window data queue inside Web Workers to throttle state updates to exactly 60Hz.",
    impact:
      "Maintained a consistent 60 FPS chart render loop while visualising real-time transactions during spike intervals.",
    github: "https://github.com/utkarsh/billing-telemetry",
    demo: "https://billing-telemetry.vercel.app",
    image: "/project3.jpg",
  },
];

export const experienceTimeline = [
  {
    role: "Senior Creative Engineer",
    company: "Vercel Partner Agency",
    duration: "2024 - Present",
    accomplishments: [
      "Led developers in building motion-first interactive 3D product landing pages.",
      "Developed reusable GSAP and Lenis scrolling architectures, reducing layout shift by 40%.",
      "Integrated Gemini API integrations to automate procedural copywriting generation inside design files.",
    ],
  },
  {
    role: "Full-Stack Software Engineer",
    company: "Stripe Integration Team",
    duration: "2022 - 2024",
    accomplishments: [
      "Optimized API response pipelines, achieving a 15% reduction in latency for webhook dispatches.",
      "Engineered real-time visual transaction telemetry logs using WebSockets and Redis channels.",
      "Maintained 99.9% uptime by enforcing strict integration testing suites and CD deployments.",
    ],
  },
  {
    role: "Frontend Developer",
    company: "Linear Design Partner",
    duration: "2020 - 2022",
    accomplishments: [
      "Created sleek, command-menu dashboard controls using React, TailwindCSS, and framer-motion.",
      "Authored custom UI libraries featuring rich micro-animations and accessibility features.",
    ],
  },
];

export const achievementsData = [
  {
    title: "Awwwards Developer Site of the Day Winner",
    organization: "Awwwards Jury",
    date: "Dec 2024",
    description:
      "Awarded for exceptional visual storytelling, R3F shader complexity, and performance scoring.",
  },
  {
    title: "Global AI Hackathon — Best Agentic Orchestration",
    organization: "OpenAI Sponsor Track",
    date: "Jun 2024",
    description: "Built an auto-recovering CI/CD workflow utilizing autonomous code repair agents.",
  },
  {
    title: "Advanced WebGL & Shaders Certification",
    organization: "ThreeJS Journey Academy",
    date: "Mar 2023",
    description:
      "Mastered matrix transformations, raymarching, GPGPU simulations, and post-processing passes.",
  },
];

export const socialLinks = [
  { label: "GitHub", href: "https://github.com/utkarsh", icon: "github" },
  { label: "LinkedIn", href: "https://linkedin.com/in/utkarsh", icon: "linkedin" },
  { label: "Twitter", href: "https://twitter.com/utkarsh", icon: "twitter" },
];
