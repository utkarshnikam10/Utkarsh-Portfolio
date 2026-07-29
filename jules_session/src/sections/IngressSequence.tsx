"use client";

import { useEffect, useState } from "react";

import { COORDINATES } from "@/constants/portfolio";

interface IngressSequenceProps {
  onComplete: () => void;
}

export function IngressSequence({ onComplete }: IngressSequenceProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setProgress((current) => {
        const next = Math.min(100, current + (current < 58 ? 7 : 4));
        if (next === 100) {
          window.clearInterval(timer);
          window.setTimeout(onComplete, 380);
        }
        return next;
      });
    }, 78);

    return () => window.clearInterval(timer);
  }, [onComplete]);

  const assetCount = String(Math.floor((progress / 100) * 27)).padStart(3, "0");

  return (
    <div
      className={`ingress ${progress === 100 ? "is-complete" : ""}`}
      aria-label="Loading portfolio"
    >
      <div className="ingress__streams" aria-hidden="true">
        {[...COORDINATES, ...COORDINATES, ...COORDINATES].map((line, index) => (
          <span key={`${line}-${index}`}>{line}</span>
        ))}
      </div>
      <div className="ingress__core">
        <p>UTKARSH // PORTFOLIO</p>
        <strong>{String(progress).padStart(3, "0")}</strong>
        <div className="ingress__meter" aria-hidden="true">
          <i />
        </div>
        <p>ASSET {assetCount} / 027 // STAGING</p>
      </div>
    </div>
  );
}
