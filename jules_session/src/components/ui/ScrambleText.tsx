"use client";

import { useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";

const GLYPHS = "ｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉ";

interface ScrambleTextProps {
  text: string;
  className?: string;
}

export function ScrambleText({ text, className }: ScrambleTextProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.7 });
  const [display, setDisplay] = useState(text);

  useEffect(() => {
    if (!isInView) return;

    let frame = 0;
    const totalFrames = Math.max(12, text.length * 2);
    const timer = window.setInterval(() => {
      frame += 1;
      const revealed = Math.floor((frame / totalFrames) * text.length);
      setDisplay(
        text
          .split("")
          .map((character, index) => {
            if (character === " ") return " ";
            if (index < revealed) return character;
            return GLYPHS[(frame * 7 + index * 11) % GLYPHS.length];
          })
          .join("")
      );

      if (frame >= totalFrames) {
        window.clearInterval(timer);
        setDisplay(text);
      }
    }, 32);

    return () => window.clearInterval(timer);
  }, [isInView, text]);

  return (
    <span className={className} ref={ref}>
      {display}
    </span>
  );
}
