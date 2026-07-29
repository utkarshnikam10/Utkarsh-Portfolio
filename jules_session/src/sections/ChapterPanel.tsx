"use client";

import { AnimatePresence, motion } from "framer-motion";

import { panelTransition, panelVariants } from "@/animations/motion";
import { siteConfig } from "@/constants/site";
import type { Chapter } from "@/types/world";

interface ChapterPanelProps {
  chapter: Chapter | null;
  onClose: () => void;
}

function ArrowUpRight() {
  return (
    <svg aria-hidden="true" viewBox="0 0 16 16" fill="none">
      <path d="M3.25 12.75 12.75 3.25M5 3.25h7.75V11" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

export function ChapterPanel({ chapter, onClose }: ChapterPanelProps) {
  return (
    <AnimatePresence mode="wait">
      {chapter ? (
        <motion.aside
          aria-labelledby={`chapter-${chapter.id}`}
          className={`chapter-panel chapter-panel--${chapter.id}`}
          initial="initial"
          animate="animate"
          exit="exit"
          key={chapter.id}
          role="dialog"
          transition={panelTransition}
          variants={panelVariants}
        >
          <div className="chapter-panel__topline">
            <p>
              {chapter.order} / {chapter.eyebrow}
            </p>
            <button className="return-button" data-cursor onClick={onClose} type="button">
              <span aria-hidden="true">×</span>
              <span>Return</span>
            </button>
          </div>

          <div className="chapter-panel__intro">
            <p className="chapter-panel__label">{chapter.label}</p>
            <h2 id={`chapter-${chapter.id}`}>{chapter.title}</h2>
            <p className="chapter-panel__description">{chapter.description}</p>
          </div>

          <div className="chapter-metric">
            <strong>{chapter.metric.value}</strong>
            <span>{chapter.metric.label}</span>
          </div>

          <div className="chapter-details">
            {chapter.details.map((detail, index) => (
              <details className="chapter-detail" key={detail.title} open={index === 0}>
                <summary>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <span>{detail.title}</span>
                  <i aria-hidden="true">+</i>
                </summary>
                <p>{detail.copy}</p>
              </details>
            ))}
          </div>

          <footer className="chapter-panel__footer">
            <p>{chapter.note}</p>
            {chapter.id === "mailbox" ? (
              <a className="chapter-action" data-cursor href={`mailto:${siteConfig.email}`}>
                Write a note <ArrowUpRight />
              </a>
            ) : (
              <button className="chapter-action" data-cursor onClick={onClose} type="button">
                Continue exploring <ArrowUpRight />
              </button>
            )}
          </footer>
        </motion.aside>
      ) : null}
    </AnimatePresence>
  );
}
