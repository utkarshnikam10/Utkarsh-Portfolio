"use client";

import DecoderText from "./DecoderText";
import Divider from "./Divider";

/**
 * SectionHeader — Section number + decoder text title + notch divider
 * Used at the top of each major section.
 */

interface SectionHeaderProps {
  index: string;
  title: string;
  className?: string;
}

export default function SectionHeader({ index, title, className = "" }: SectionHeaderProps) {
  return (
    <div className={`mb-16 ${className}`}>
      <div className="flex items-center gap-6 mb-4">
        <span className="section-index">{index}</span>
        <Divider className="flex-1" />
      </div>
      <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-text">
        <DecoderText text={title} />
      </h2>
    </div>
  );
}
