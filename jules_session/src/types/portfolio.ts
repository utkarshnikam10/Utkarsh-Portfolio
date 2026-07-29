export type CampaignId = "nexus-os" | "luma-finance" | "vector-health";

export interface TelemetryMetric {
  label: string;
  value: number;
  suffix: string;
}

export interface Campaign {
  id: CampaignId;
  index: string;
  category: string;
  title: string;
  description: string;
  year: string;
  device: "laptop" | "mobile" | "dual";
  metrics: readonly TelemetryMetric[];
  theme: "cobalt" | "ember" | "violet";
  detail: string;
}

export interface SkillGroup {
  index: string;
  title: string;
  lead: string;
  technologies: readonly string[];
  metrics: readonly { label: string; value: string; level: "high" | "mid" | "focused" }[];
}
