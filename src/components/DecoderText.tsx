"use client";

import { useEffect, useRef, useState, useCallback } from "react";

/**
 * DecoderText — hamishw.com-style text scramble reveal
 * Characters cycle through random glyphs before settling on the final letter.
 */

const GLYPHS =
  "ア イ ウ エ オ カ キ ク ケ コ サ シ ス セ ソ タ チ ツ テ ト ナ ニ ヌ ネ ノ ハ ヒ フ ヘ ホ マ ミ ム メ モ ヤ ユ ヨ ラ リ ル レ ロ ワ ヲ ン";

interface DecoderTextProps {
  text: string;
  className?: string;
  delay?: number;
  startOnView?: boolean;
}

export default function DecoderText({
  text,
  className = "",
  delay = 300,
  startOnView = true,
}: DecoderTextProps) {
  const [displayText, setDisplayText] = useState("");
  const [started, setStarted] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);
  const glyphChars = GLYPHS.split(" ");

  // Intersection observer to trigger on visibility
  useEffect(() => {
    if (!startOnView) {
      const timeout = setTimeout(() => setStarted(true), delay);
      return () => clearTimeout(timeout);
    }

    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setStarted(true), delay);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [delay, startOnView]);

  // Scramble animation
  const scramble = useCallback(() => {
    const chars = text.split("");
    let frame = 0;
    const totalFrames = chars.length * 3; // 3 scramble frames per char

    const interval = setInterval(() => {
      const decoded = chars.map((char, i) => {
        if (char === " ") return " ";
        const revealAt = i * 3; // Each char reveals after 3 frames
        if (frame >= revealAt) return char;
        return glyphChars[Math.floor(Math.random() * glyphChars.length)];
      });

      setDisplayText(decoded.join(""));
      frame++;

      if (frame > totalFrames) {
        clearInterval(interval);
        setDisplayText(text);
      }
    }, 40);

    return () => clearInterval(interval);
  }, [text, glyphChars]);

  useEffect(() => {
    if (started) {
      return scramble();
    }
  }, [started, scramble]);

  return (
    <span ref={ref} className={className} aria-label={text}>
      <span aria-hidden="true">{displayText || "\u00A0".repeat(text.length)}</span>
    </span>
  );
}
