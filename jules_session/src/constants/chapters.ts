import type { CameraComposition, Chapter, ChapterId } from "@/types/world";

export const HOME_CAMERA: CameraComposition = {
  position: [8.7, 6.8, 11.5],
  target: [0, 0.65, 0],
};

export const CHAPTERS: readonly Chapter[] = [
  {
    id: "tree",
    order: "01",
    label: "The Tree",
    eyebrow: "Origin / principles",
    title: "The work has to feel inevitable.",
    shortTitle: "Principles",
    description:
      "A point of view that turns complexity into a quiet, obvious next step. The best interface is remembered as confidence, not decoration.",
    accent: "#c8ed8a",
    position: [-3.55, 0, -1.15],
    camera: {
      position: [-6.45, 3.1, 5.5],
      target: [-3.3, 1.45, -1.1],
    },
    metric: { value: "01", label: "Clear idea before a visual idea" },
    details: [
      { title: "Clarity", copy: "Name the real decision before styling the screen." },
      { title: "Feeling", copy: "Use movement to reveal intent, never to fill silence." },
      { title: "Care", copy: "Treat loading, errors, and exits as first-class moments." },
    ],
    note: "A living system should grow character without growing friction.",
  },
  {
    id: "workshop",
    order: "02",
    label: "Workshop",
    eyebrow: "Selected systems",
    title: "Built to be used, not simply viewed.",
    shortTitle: "Work",
    description:
      "A selection of digital products where strategy, interaction, and engineering meet in the details people touch every day.",
    accent: "#f6b47a",
    position: [-0.75, 0, 2.15],
    camera: {
      position: [-4.5, 2.65, 7.7],
      target: [-0.75, 1.1, 2.05],
    },
    metric: { value: "06", label: "Product systems brought from idea to release" },
    details: [
      { title: "NORTH / 01", copy: "A modular commerce platform made decisively editorial." },
      { title: "Onda / 02", copy: "A financial workspace that makes complex money flows legible." },
      {
        title: "Serein / 03",
        copy: "A healthcare service where reassurance is part of the interface.",
      },
    ],
    note: "Every project begins with the part of the product people will feel first.",
  },
  {
    id: "library",
    order: "03",
    label: "Library",
    eyebrow: "Notes / methods",
    title: "Good decisions leave useful traces.",
    shortTitle: "Thinking",
    description:
      "A working library of interaction studies, design notes, and the small observations that make complex systems easier to navigate.",
    accent: "#9bc4ff",
    position: [2.95, 0, 1.25],
    camera: {
      position: [5.7, 2.8, 6.25],
      target: [2.9, 1.25, 1.15],
    },
    metric: { value: "37", label: "Fragments currently informing the work" },
    details: [
      { title: "Systems", copy: "How constraints create a more expressive visual language." },
      { title: "Attention", copy: "Making hierarchy felt before it needs to be explained." },
      {
        title: "Transition",
        copy: "Treating every state change as an opportunity for orientation.",
      },
    ],
    note: "Research is only useful when it changes the next decision.",
  },
  {
    id: "prototype-lab",
    order: "04",
    label: "Prototype Lab",
    eyebrow: "Experiments / interaction",
    title: "Test the feeling while the idea is still cheap.",
    shortTitle: "Experiments",
    description:
      "Small prototypes for the moments static design cannot answer: pace, resistance, delight, weight, and response.",
    accent: "#e7a5ff",
    position: [3.75, 0, -2.75],
    camera: {
      position: [7.0, 2.65, 1.75],
      target: [3.6, 1.05, -2.5],
    },
    metric: { value: "12", label: "Active interaction studies" },
    details: [
      {
        title: "Elastic feedback",
        copy: "Micro-responses that make an interface feel physically present.",
      },
      {
        title: "Spatial menus",
        copy: "Navigation that maintains context while shifting attention.",
      },
      { title: "Material motion", copy: "A timing language built from interruption and recovery." },
    ],
    note: "Prototypes keep the question alive long enough to find the right answer.",
  },
  {
    id: "observatory",
    order: "05",
    label: "Observatory",
    eyebrow: "Perspective / outcomes",
    title: "Zoom out until the right problem comes into view.",
    shortTitle: "Outcomes",
    description:
      "Design direction is most valuable when it sharpens a product decision. These are the outcomes, not just the artifacts.",
    accent: "#f6de78",
    position: [0.8, 0, -4.2],
    camera: {
      position: [2.8, 3.4, -8.2],
      target: [0.85, 1.45, -3.85],
    },
    metric: { value: "+42%", label: "Meaningful task completion on a recent launch" },
    details: [
      { title: "Direction", copy: "A shared product narrative makes smaller decisions faster." },
      { title: "Adoption", copy: "Trust is built in the moments where a user hesitates." },
      { title: "Momentum", copy: "Systems that survive handoff keep improving after launch." },
    ],
    note: "The strongest visual decision is often the one that helps a team decide.",
  },
  {
    id: "mailbox",
    order: "06",
    label: "Mailbox",
    eyebrow: "Start a conversation",
    title: "Good work begins with a thoughtful hello.",
    shortTitle: "Contact",
    description:
      "For teams shaping something ambitious, useful, and difficult to make simple. A clear question is the best place to start.",
    accent: "#ff9c9a",
    position: [-2.65, 0, -4.25],
    camera: {
      position: [-6.6, 2.25, -6.7],
      target: [-2.55, 0.95, -4.1],
    },
    metric: { value: "48h", label: "A considered reply, usually sooner" },
    details: [
      {
        title: "New work",
        copy: "Product direction, interface systems, and high-care launch experiences.",
      },
      {
        title: "Collaboration",
        copy: "An embedded design and frontend partner for a focused season.",
      },
      { title: "Elsewhere", copy: "A concise note is enough; the right project does the rest." },
    ],
    note: "hello@nexus.studio",
  },
] as const;

export const chapterById = (id: ChapterId) => CHAPTERS.find((chapter) => chapter.id === id);
