/**
 * PROJECT NEXUS // PORTFOLIO DATA TYPES
 * Responsibility: Declares interface schemas for system readouts, metrics,
 * code blocks, and professional history models.
 */

export interface ProjectData {
  id: string;
  title: string;
  description: string;
  category: string;
  metrics: string[];
  codeSnippet?: string;
  technologies: string[];
}

export interface EmploymentMilestone {
  id: string;
  role: string;
  company: string;
  duration: string;
  highlights: string[];
  titaniumPillarProjectionIndex: number;
}
