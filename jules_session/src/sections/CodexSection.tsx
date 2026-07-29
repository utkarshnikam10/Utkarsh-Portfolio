"use client";

import type { CSSProperties, PointerEvent } from "react";
import { useState } from "react";

import { ScrambleText } from "@/components/ui/ScrambleText";
import { SKILL_GROUPS } from "@/constants/portfolio";
import type { SkillGroup } from "@/types/portfolio";

function SkillCard({ skill }: { skill: SkillGroup }) {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const style = {
    "--tilt-x": `${tilt.x.toFixed(2)}deg`,
    "--tilt-y": `${tilt.y.toFixed(2)}deg`,
  } as CSSProperties;

  const handlePointerMove = (event: PointerEvent<HTMLElement>) => {
    const bounds = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - bounds.left) / bounds.width - 0.5) * 6;
    const y = ((event.clientY - bounds.top) / bounds.height - 0.5) * -6;
    setTilt({ x: y, y: x });
  };

  return (
    <article
      className="skill-card"
      onPointerLeave={() => setTilt({ x: 0, y: 0 })}
      onPointerMove={handlePointerMove}
      style={style}
    >
      <div className="skill-card__topline">
        <span>{skill.index}</span>
        <span>CAPABILITY CLUSTER</span>
      </div>
      <h3>
        <ScrambleText text={skill.title} />
      </h3>
      <p>{skill.lead}</p>
      <ul className="skill-card__tags" aria-label={`${skill.title} technologies`}>
        {skill.technologies.map((technology) => (
          <li key={technology}>{technology}</li>
        ))}
      </ul>
      <div className="skill-card__stats" aria-label={`${skill.title} proficiency details`}>
        {skill.metrics.map((metric) => (
          <div className="skill-stat" key={metric.label}>
            <span>{metric.label}</span>
            <strong>{metric.value}</strong>
            <i className={`skill-stat__bar is-${metric.level}`} aria-hidden="true" />
          </div>
        ))}
      </div>
    </article>
  );
}

export function CodexSection() {
  return (
    <section className="codex-section section-shell" id="codex" aria-labelledby="codex-title">
      <div className="section-heading">
        <p className="telemetry-label">02 // CODEX</p>
        <div>
          <h2 id="codex-title">
            Design is a system
            <br />
            that <em>moves.</em>
          </h2>
          <p>
            I work at the intersection of visual direction, product mechanics, and frontend craft —
            where an experience earns its complexity.
          </p>
        </div>
      </div>
      <div className="skills-grid">
        {SKILL_GROUPS.map((skill) => (
          <SkillCard key={skill.index} skill={skill} />
        ))}
      </div>
    </section>
  );
}
