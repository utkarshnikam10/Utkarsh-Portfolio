"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import gsap from "gsap";
import DecoderText from "@/components/DecoderText";
import Button from "@/components/Button";

const ShivlingExperience = dynamic(() => import("@/components/HeroModels/ShivlingExperience"), {
  ssr: false,
});

/**
 * Hero — Cinematic Baahubali Intro Section
 * Displays massive regal typography and the interactive 3D Shivling model.
 * Features an optional synthesized cinematic audio cue using Web Audio API!
 */

export default function Hero() {
  const [audioPlaying, setAudioPlaying] = useState(false);
  const [audioCtx, setAudioCtx] = useState<AudioContext | null>(null);

  // Synthesize a low-frequency drone + epic royal brass chord using Web Audio API
  const playCinematicSound = () => {
    if (audioPlaying) return;

    try {
      const Ctx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new Ctx();
      setAudioCtx(ctx);
      setAudioPlaying(true);

      const now = ctx.currentTime;

      // 1. Low Cinematic Drone (Sanskrit temple vibe)
      const droneOsc = ctx.createOscillator();
      const droneGain = ctx.createGain();
      droneOsc.type = "sawtooth";
      droneOsc.frequency.setValueAtTime(65.41, now); // C2 frequency

      // Low pass filter to make it rumble
      const filter = ctx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.setValueAtTime(120, now);

      droneGain.gain.setValueAtTime(0, now);
      droneGain.gain.linearRampToValueAtTime(0.4, now + 1.5);

      droneOsc.connect(filter);
      filter.connect(droneGain);
      droneGain.connect(ctx.destination);
      droneOsc.start(now);

      // 2. Warm Orchestral Brass Fifth Chord (C3 + G3)
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const chordGain = ctx.createGain();

      osc1.type = "triangle";
      osc1.frequency.setValueAtTime(130.81, now); // C3
      osc2.type = "triangle";
      osc2.frequency.setValueAtTime(196.0, now); // G3

      chordGain.gain.setValueAtTime(0, now);
      chordGain.gain.linearRampToValueAtTime(0.2, now + 1.0);
      chordGain.gain.exponentialRampToValueAtTime(0.001, now + 4.5);

      osc1.connect(chordGain);
      osc2.connect(chordGain);
      chordGain.connect(ctx.destination);

      osc1.start(now);
      osc2.start(now);

      // Stop everything after 5 seconds
      setTimeout(() => {
        droneOsc.stop();
        osc1.stop();
        osc2.stop();
        ctx.close();
        setAudioPlaying(false);
      }, 5000);
    } catch (e) {
      console.warn("AudioContext not supported by browser", e);
    }
  };

  useEffect(() => {
    // Reveal main typography content using GSAP
    const tl = gsap.timeline({ delay: 0.2 });

    tl.fromTo(
      "#hero-badge",
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" }
    )
      .fromTo(
        "#hero-title",
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.1, ease: "power4.out" },
        "-=0.6"
      )
      .fromTo(
        "#hero-subtitle",
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" },
        "-=0.7"
      )
      .fromTo(
        "#hero-desc",
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" },
        "-=0.6"
      )
      .fromTo(
        "#hero-buttons > *",
        { y: 15, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: "power3.out", stagger: 0.15 },
        "-=0.5"
      )
      .fromTo(
        "#hero-canvas",
        { scale: 0.9, opacity: 0 },
        { scale: 1, opacity: 1, duration: 1.4, ease: "power2.out" },
        "-=1.2"
      );

    return () => {
      if (audioCtx) {
        audioCtx.close();
      }
    };
  }, [audioCtx]);

  return (
    <section id="hero" className="relative min-h-screen flex items-center overflow-hidden pt-24">
      {/* Volumetric Dark Vignette */}
      <div className="absolute inset-0 bg-radial-[circle_at_center,transparent_40%,#0a0806_90%] z-10 pointer-events-none" />

      {/* Background shadow layer */}
      <div className="absolute inset-0 bg-[#0a0806]/85 z-0" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Left Side: Cinematic Typography */}
        <div className="flex flex-col gap-6">
          <div id="hero-badge" className="flex items-center gap-3 opacity-0">
            <span className="w-10 h-[1px] bg-primary" />
            <span className="text-primary font-mono text-xs tracking-[0.3em] uppercase">
              <DecoderText text="An Interactive Digital Chronicle" delay={300} />
            </span>
          </div>

          <h1
            id="hero-title"
            className="font-serif text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-wider leading-[1.05] uppercase opacity-0"
          >
            Utkarsh
          </h1>

          <h2
            id="hero-subtitle"
            className="font-serif text-lg md:text-xl text-primary tracking-[0.2em] font-medium uppercase -mt-4 opacity-0"
          >
            Creative Technologist of Mahishmati
          </h2>

          <p
            id="hero-desc"
            className="text-text-tertiary text-sm md:text-base max-w-md leading-relaxed font-sans mt-2 opacity-0"
          >
            Forging state-of-the-art interactive digital experiences, robust server architectures,
            and immersive WebGL systems inspired by the power and scale of the Mahishmati Kingdom.
          </p>

          <div id="hero-buttons" className="flex flex-wrap gap-4 mt-4">
            <Button href="#codex" variant="primary">
              Explore Codex
            </Button>
            <Button onClick={playCinematicSound} variant="secondary" className="group">
              <span className="flex items-center gap-2">
                {audioPlaying ? (
                  <>
                    <span className="w-2 h-2 rounded-full bg-primary animate-ping" />
                    Echoing...
                  </>
                ) : (
                  <>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                    Play Theme
                  </>
                )}
              </span>
            </Button>
          </div>
        </div>

        {/* Right Side: Interactive 3D Shivling Waterfalls */}
        <div
          id="hero-canvas"
          className="relative w-full h-[450px] md:h-[550px] lg:h-[650px] flex-center opacity-0"
        >
          <div className="absolute w-[80%] aspect-square rounded-full bg-primary/5 blur-[80px] -z-10" />
          <ShivlingExperience />
        </div>
      </div>

      {/* Golden scroll arrow */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-20">
        <span className="text-text-tertiary text-[10px] tracking-[0.25em] uppercase font-mono">
          Enter Kingdom
        </span>
        <svg width="16" height="24" viewBox="0 0 20 30" className="scroll-indicator text-primary">
          <rect
            x="1"
            y="1"
            width="18"
            height="28"
            rx="9"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
          />
          <circle cx="10" cy="10" r="2" fill="currentColor">
            <animate attributeName="cy" values="10;18;10" dur="2.5s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="1;0.2;1" dur="2.5s" repeatCount="indefinite" />
          </circle>
        </svg>
      </div>
    </section>
  );
}
