export const CHAPTER_IDS = [
  "tree",
  "workshop",
  "library",
  "prototype-lab",
  "observatory",
  "mailbox",
] as const;

export type ChapterId = (typeof CHAPTER_IDS)[number];

export type WorldVector = readonly [number, number, number];

export interface CameraComposition {
  position: WorldVector;
  target: WorldVector;
}

export interface ChapterMetric {
  value: string;
  label: string;
}

export interface ChapterDetail {
  title: string;
  copy: string;
}

export interface Chapter {
  id: ChapterId;
  order: string;
  label: string;
  eyebrow: string;
  title: string;
  shortTitle: string;
  description: string;
  accent: string;
  position: WorldVector;
  camera: CameraComposition;
  metric: ChapterMetric;
  details: readonly ChapterDetail[];
  note: string;
}
