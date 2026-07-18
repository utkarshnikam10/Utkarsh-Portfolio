"use client";

import { useEffect, useState } from "react";
import gsap from "gsap";

interface LoadingScreenProps {
  onComplete: () => void;
}

export default function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const [percent, setPercent] = useState(0);

  useEffect(() => {
    // Block scroll during loader active
    document.body.style.overflow = "hidden";

    const obj = { value: 0 };
    const tl = gsap.timeline({
      onComplete: () => {
        // Slide out animation
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

    // Gentle logo pulse
    gsap.fromTo(
      "#loading-emblem",
      { scale: 0.8, opacity: 0 },
      { scale: 1.05, opacity: 1, duration: 1.4, ease: "power2.out" }
    );
    gsap.fromTo(
      "#loading-title",
      { letterSpacing: "0.1em", opacity: 0 },
      { letterSpacing: "0.38em", opacity: 1, duration: 1.6, ease: "power3.out" }
    );

    return () => {
      document.body.style.overflow = "";
    };
  }, [onComplete]);

  return (
    <div
      id="loading-screen"
      className="fixed inset-0 z-50 bg-[#0a0806] flex-center flex-col select-none pointer-events-auto"
    >
      {/* Structural layout divider lines */}
      <div className="absolute inset-y-0 left-12 md:left-24 w-[1px] bg-border/25 pointer-events-none" />
      <div className="absolute inset-y-0 right-12 md:right-24 w-[1px] bg-border/25 pointer-events-none" />

      {/* Central Identity Group */}
      <div className="flex-center flex-col gap-6 relative z-10">
        <div id="loading-emblem" className="text-primary text-5xl font-serif">
          ❖
        </div>
        <h1
          id="loading-title"
          className="font-serif text-2xl md:text-3xl text-gradient font-black uppercase tracking-[0.2em] mb-1"
        >
          Mahishmati
        </h1>
        <p className="text-text-tertiary font-mono text-[9px] tracking-widest uppercase opacity-75">
          Verifying Lineage Protocols...
        </p>
      </div>

      {/* Bottom Percentage Progress */}
      <div className="absolute bottom-16 right-16 md:right-24 flex items-baseline gap-2 font-mono select-none">
        <span className="text-primary text-5xl font-extralight">
          {percent.toString().padStart(3, "0")}
        </span>
        <span className="text-text-tertiary text-[10px] uppercase tracking-widest">% SECURED</span>
      </div>
    </div>
  );
}
