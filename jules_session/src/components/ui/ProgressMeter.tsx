import { CHAPTERS } from "@/constants/chapters";
import { cn } from "@/utils/cn";

interface ProgressMeterProps {
  visited: readonly string[];
}

export function ProgressMeter({ visited }: ProgressMeterProps) {
  return (
    <div
      className="progress-meter"
      aria-label={`${visited.length} of ${CHAPTERS.length} places visited`}
    >
      <span className="progress-meter__label">Places</span>
      <span className="progress-meter__bars" aria-hidden="true">
        {CHAPTERS.map((chapter) => (
          <i
            className={cn("progress-meter__bar", visited.includes(chapter.id) && "is-visited")}
            key={chapter.id}
          />
        ))}
      </span>
      <span className="progress-meter__count">{String(visited.length).padStart(2, "0")}</span>
    </div>
  );
}
