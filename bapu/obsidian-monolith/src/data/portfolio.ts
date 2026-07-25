export interface Profile {
  name: string;
  title: string;
  university: string;
  location: string;
  bio: string;
  contactEmail: string;
  github: string;
  linkedin: string;
  twitter: string;
}

export interface Metric {
  label: string;
  value: string;
}

export interface Project {
  id: string;
  title: string;
  category: string;
  tag: string;
  year: string;
  description: string;
  technologies: string[];
  liveUrl?: string;
  githubUrl?: string;
  metrics: Metric[];
}

export interface SkillCategory {
  category: string;
  items: string[];
}

export interface CareerMilestone {
  year: string;
  role: string;
  company: string;
  impact: string;
}

export interface PortfolioData {
  profile: Profile;
  projects: Project[];
  skills: SkillCategory[];
  trajectory: CareerMilestone[];
}

export const portfolioData: PortfolioData = {
  profile: {
    name: "Utkarsh Nikam",
    title: "B.Tech CSE Student & Software Developer",
    university: "Lovely Professional University",
    location: "Maharashtra, India",
    bio: "Motivated and dedicated B.Tech Computer Science Engineering student with a strong aptitude for logical thinking and software development. Quick learner proficient in Python and C++, with a growing interest in full-stack web technologies and real-time graphics. Passionate about leveraging code to solve real-world problems.",
    contactEmail: "utkarshnikam10@gmail.com",
    github: "https://github.com",
    linkedin: "https://linkedin.com",
    twitter: "https://x.com",
  },
  projects: [
    {
      id: "health-monitor",
      title: "Smart Health Monitoring System",
      category: "IoT & Embedded Systems",
      tag: "REAL-TIME VITALS TRACKING",
      year: "2025",
      description:
        "Developed a real-time health monitoring device using the ESP32 platform to track patient vitals efficiently. Integrated sensors including BMP180 (Pressure), MAX30102 (Pulse Oximeter), and TTP223B (Touch).",
      technologies: [
        "C++",
        "ESP32",
        "IoT Sensors",
        "Embedded Systems",
      ],
      liveUrl: "https://github.com",
      githubUrl: "https://github.com",
      metrics: [
        { label: "Hardware", value: "ESP32 MCU" },
        { label: "Sensors", value: "MAX30102, BMP180" },
        { label: "Focus", value: "Real-time Metrics" },
      ],
    },
    {
      id: "obsidian-monolith",
      title: "The Obsidian Monolith",
      category: "Spatial Web Architecture",
      tag: "REAL-TIME WEBGL",
      year: "2026",
      description:
        "A highly optimized, physics-driven interactive portfolio built with React Three Fiber. Features responsive GPGPU particle systems, spatial audio routing, and cinematic post-processing.",
      technologies: [
        "Next.js 16",
        "Three.js",
        "React Three Fiber",
        "Tailwind CSS",
        "TypeScript",
      ],
      liveUrl: "http://localhost:3000",
      githubUrl: "https://github.com",
      metrics: [
        { label: "Performance", value: "60 FPS WebGL" },
        { label: "Particles", value: "35K Dynamic" },
        { label: "Design", value: "Glassmorphism" },
      ],
    },
    {
      id: "algos",
      title: "Algorithmic Problem Solving",
      category: "Data Structures & Algorithms",
      tag: "C++ & PYTHON",
      year: "2024-2025",
      description:
        "Continuous participation in coding bootcamps and algorithmic problem-solving. Strong focus on optimizing time and space complexities using advanced data structures in C++ and Python.",
      technologies: [
        "C++",
        "Python",
        "C",
        "Algorithms",
      ],
      liveUrl: "https://github.com",
      githubUrl: "https://github.com",
      metrics: [
        { label: "Focus", value: "Optimization" },
        { label: "Languages", value: "C++, Python" },
        { label: "Logic", value: "Problem Solving" },
      ],
    }
  ],
  skills: [
    {
      category: "Core Languages",
      items: ["Python", "C++", "C", "JavaScript", "TypeScript"],
    },
    {
      category: "Web Development",
      items: [
        "HTML5",
        "CSS3",
        "Next.js",
        "React",
        "Tailwind CSS",
      ],
    },
    {
      category: "Tools & Technologies",
      items: [
        "Git",
        "GitHub",
        "VS Code",
        "IoT (ESP32)",
        "Generative AI Tools",
      ],
    },
    {
      category: "Soft Skills",
      items: ["Logical Thinking", "Quick Learner", "Problem Solving", "English", "Hindi", "Marathi"],
    },
  ],
  trajectory: [
    {
      year: "2025 – 2029",
      role: "B.Tech Computer Science Engineering",
      company: "Lovely Professional University (LPU)",
      impact:
        "Focusing on Data Structures, Algorithms, and System Design. Active participant in coding bootcamps and technical workshops.",
    },
    {
      year: "2025",
      role: "IoT System Developer (Academic Project)",
      company: "Smart Health Monitoring",
      impact:
        "Engineered an ESP32-based health monitoring system utilizing C++ to interface with biometric and environmental sensors.",
    },
    {
      year: "2026",
      role: "Software Developer",
      company: "Independent Projects",
      impact:
        "Developed full-stack web applications and spatial computing interfaces like The Obsidian Monolith using modern web technologies.",
    }
  ],
};
