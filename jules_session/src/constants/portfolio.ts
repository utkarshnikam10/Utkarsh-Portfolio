import type { Campaign, SkillGroup } from "@/types/portfolio";

export const UTKARSH = {
  name: "Utkarsh",
  role: "Creative developer / product engineer",
  email: "hello@utkarsh.design",
} as const;

export const SKILL_GROUPS: readonly SkillGroup[] = [
  {
    index: "01",
    title: "Frontend systems",
    lead: "Interfaces that make difficult things feel inevitable.",
    technologies: ["React / Next.js", "TypeScript", "Motion systems"],
    metrics: [
      { label: "Interaction architecture", value: "96", level: "high" },
      { label: "Design systems", value: "92", level: "high" },
      { label: "Rendering performance", value: "88", level: "mid" },
    ],
  },
  {
    index: "02",
    title: "Backend logic",
    lead: "Product infrastructure with a calm surface and a reliable core.",
    technologies: ["Node / Edge", "APIs", "Data modelling"],
    metrics: [
      { label: "Service design", value: "84", level: "mid" },
      { label: "Data contracts", value: "82", level: "mid" },
      { label: "Observability", value: "76", level: "focused" },
    ],
  },
  {
    index: "03",
    title: "DevOps craft",
    lead: "Release paths that let ambitious work arrive intact.",
    technologies: ["CI / CD", "Cloud delivery", "Web vitals"],
    metrics: [
      { label: "Deployment fluency", value: "81", level: "mid" },
      { label: "Performance budgets", value: "89", level: "high" },
      { label: "Quality gates", value: "86", level: "mid" },
    ],
  },
] as const;

export const CAMPAIGNS: readonly Campaign[] = [
  {
    id: "nexus-os",
    index: "01",
    category: "Spatial operating system",
    title: "NEXUS / OS",
    description: "A calm control surface for teams orchestrating multiple moving parts at once.",
    year: "2026",
    device: "laptop",
    theme: "cobalt",
    metrics: [
      { label: "Design integrity", value: 96, suffix: "%" },
      { label: "Speed index", value: 98, suffix: "/100" },
      { label: "Code purity", value: 94, suffix: "%" },
    ],
    detail: "Systems design, R3F prototyping, frontend architecture",
  },
  {
    id: "luma-finance",
    index: "02",
    category: "Financial workspace",
    title: "LUMA / FINANCE",
    description:
      "A focused financial command centre that turns complex activity into clear next actions.",
    year: "2025",
    device: "dual",
    theme: "ember",
    metrics: [
      { label: "Design integrity", value: 93, suffix: "%" },
      { label: "Speed index", value: 95, suffix: "/100" },
      { label: "Code purity", value: 91, suffix: "%" },
    ],
    detail: "Product direction, dashboard design, interaction language",
  },
  {
    id: "vector-health",
    index: "03",
    category: "Care platform",
    title: "VECTOR / HEALTH",
    description: "A care journey designed to make high-stakes decisions feel less isolating.",
    year: "2024",
    device: "mobile",
    theme: "violet",
    metrics: [
      { label: "Design integrity", value: 97, suffix: "%" },
      { label: "Speed index", value: 92, suffix: "/100" },
      { label: "Code purity", value: 89, suffix: "%" },
    ],
    detail: "Mobile product, patient journeys, accessible design systems",
  },
] as const;

export const CAREER = [
  {
    year: "2026",
    title: "Independent",
    copy: "Partnering with teams on the high-leverage moments before a product becomes obvious.",
  },
  {
    year: "2025",
    title: "Product systems",
    copy: "Designed interaction frameworks that made launches clearer, faster, and easier to maintain.",
  },
  {
    year: "2024",
    title: "Creative engineering",
    copy: "Brought motion, interface craft, and frontend systems into one practical design practice.",
  },
  {
    year: "2022",
    title: "The first interface",
    copy: "Started with a question: can technology feel as considered as the products it enables?",
  },
] as const;

export const COORDINATES = [
  "COORD 42.10 // INDEX 01",
  "SIGNAL 0.83 // SYSTEM ONLINE",
  "RENDER PIPELINE // NOMINAL",
  "UTKARSH // DELHI, IN",
] as const;
