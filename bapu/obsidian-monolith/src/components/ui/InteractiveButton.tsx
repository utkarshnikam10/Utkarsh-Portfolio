"use client";

import React, { useRef, useState } from "react";
import { playHoverTone, playSelectSound } from "../../utils/audio";

interface InteractiveButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  cursorLabel?: string;
}

export function InteractiveButton({
  children,
  cursorLabel = "CLICK",
  className = "",
  onMouseEnter,
  onClick,
  ...props
}: InteractiveButtonProps) {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [transform, setTransform] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!buttonRef.current) return;
    const rect = buttonRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    // Up to 8px magnetic pull translation towards cursor
    const deltaX = (e.clientX - centerX) * 0.25;
    const deltaY = (e.clientY - centerY) * 0.25;

    const maxOffset = 8;
    const clampedX = Math.min(Math.max(deltaX, -maxOffset), maxOffset);
    const clampedY = Math.min(Math.max(deltaY, -maxOffset), maxOffset);

    setTransform({ x: clampedX, y: clampedY });
  };

  const handleMouseLeave = () => {
    setTransform({ x: 0, y: 0 });
  };

  const handleMouseEnter = (e: React.MouseEvent<HTMLButtonElement>) => {
    playHoverTone();
    onMouseEnter?.(e);
  };

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    playSelectSound();
    onClick?.(e);
  };

  return (
    <button
      ref={buttonRef}
      data-cursor-label={cursorLabel}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={handleMouseEnter}
      onClick={handleClick}
      style={{
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }}
      className={`transition-all duration-200 ease-out hover:scale-[1.02] border border-white/10 hover:border-amber-300/60 bg-white/5 hover:bg-white/10 rounded px-4 py-2 font-mono text-xs text-zinc-300 hover:text-white ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
