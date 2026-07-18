"use client";

import { useEffect, useState } from "react";
import gsap from "gsap";

interface LoadingScreenProps {
  onComplete: () => void;
}

export default function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const [percent, setPercent] = useState(0);

  useEffect(() => {
    document.body.style.overflow = "hidden";

    const obj = { value: 0 };
    const tl = gsap.timeline({
      onComplete: () => {
        gsap.to("#loading-screen", {
          yPercent: -100,
          duration: 0.9,
          ease: "power3.inOut",
          onComplete: () => {
            document.body.style.overflow = "";
            onComplete();
          },
        });
      },
    });

    tl.to(obj, {
      value: 100,
      duration: 2.0,
      ease: "power2.out",
      onUpdate: () => {
        setPercent(Math.floor(obj.value));
      },
    });

    // Minimal fade-in for brand mark
    gsap.fromTo(
      "#loading-emblem",
      { scale: 0.9, opacity: 0 },
      { scale: 1, opacity: 1, duration: 1.2, ease: "power2.out" }
    );
    gsap.fromTo(
      "#loading-title",
      { letterSpacing: "0.15em", opacity: 0 },
      { letterSpacing: "0.4em", opacity: 1, duration: 1.4, ease: "power3.out" }
    );

    return () => {
      document.body.style.overflow = "";
    };
  }, [onComplete]);

  return (
    <div
      id="loading-screen"
      className="fixed inset-0 z-50 bg-background flex-center flex-col select-none pointer-events-auto"
    >
      {/* Thin structural lines */}
      <div className="absolute inset-y-0 left-12 md:left-24 w-[0.5px] bg-border/20 pointer-events-none" />
      <div className="absolute inset-y-0 right-12 md:right-24 w-[0.5px] bg-border/20 pointer-events-none" />

      {/* Central Identity */}
      <div className="flex-center flex-col gap-5 relative z-10">
        <div id="loading-emblem" className="text-primary text-4xl font-mono font-bold">
          ◆
        </div>
        <h1
          id="loading-title"
          className="font-serif text-xl md:text-2xl font-bold uppercase tracking-[0.25em] text-text"
        >
          NEXUS
        </h1>
        <p className="text-text-tertiary font-mono text-[9px] tracking-widest uppercase opacity-75">
          Initializing Experience...
        </p>
      </div>

      {/* Bottom progress counter */}
      <div className="absolute bottom-16 right-16 md:right-24 flex items-baseline gap-2 font-mono select-none">
        <span className="text-primary text-5xl font-extralight">
          {percent.toString().padStart(3, "0")}
        </span>
        <span className="text-text-tertiary text-[10px] uppercase tracking-widest">% LOADED</span>
      </div>
    </div>
  );
}
