"use client";

import { useEffect, useRef } from "react";

/**
 * Divider — hamishw.com-style notched divider line
 * The line draws left-to-right, then the notch pops up.
 */

interface DividerProps {
  className?: string;
  notch?: boolean;
}

export default function Divider({ className = "", notch = true }: DividerProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.setAttribute("data-visible", "true");
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className={`flex items-center gap-4 ${className}`} data-visible="false">
      <div
        className="divider-line flex-1"
        data-visible="false"
        ref={(lineEl) => {
          if (!lineEl) return;
          const parent = lineEl.closest("[data-visible]");
          if (parent) {
            const obs = new MutationObserver(() => {
              lineEl.setAttribute("data-visible", parent.getAttribute("data-visible") || "false");
            });
            obs.observe(parent, { attributes: true, attributeFilter: ["data-visible"] });
          }
        }}
      />
      {notch && (
        <div
          className="divider-notch"
          data-visible="false"
          ref={(notchEl) => {
            if (!notchEl) return;
            const parent = notchEl.closest("[data-visible]");
            if (parent) {
              const obs = new MutationObserver(() => {
                notchEl.setAttribute(
                  "data-visible",
                  parent.getAttribute("data-visible") || "false"
                );
              });
              obs.observe(parent, { attributes: true, attributeFilter: ["data-visible"] });
            }
          }}
        />
      )}
    </div>
  );
}
