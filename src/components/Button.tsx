"use client";

import { useRef, useCallback } from "react";
import gsap from "gsap";

/**
 * Button — Magnetic CTA button with hover pull effect
 * Inspired by theycallmegiulio.com's magnetic cursor interaction
 */

interface ButtonProps {
  children: React.ReactNode;
  href?: string;
  variant?: "primary" | "secondary";
  className?: string;
  onClick?: () => void;
  type?: "button" | "submit";
  icon?: React.ReactNode;
}

export default function Button({
  children,
  href,
  variant = "primary",
  className = "",
  onClick,
  type = "button",
  icon,
}: ButtonProps) {
  const ref = useRef<HTMLAnchorElement & HTMLButtonElement>(null);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    gsap.to(el, {
      x: x * 0.25,
      y: y * 0.25,
      duration: 0.3,
      ease: "power2.out",
      overwrite: "auto",
    });
  }, []);

  const handleMouseLeave = useCallback(() => {
    const el = ref.current;
    if (!el) return;

    gsap.to(el, {
      x: 0,
      y: 0,
      duration: 0.5,
      ease: "elastic.out(1.1, 0.4)",
      overwrite: "auto",
    });
  }, []);

  const btnClass = `cta-btn magnetic-btn ${
    variant === "primary" ? "cta-btn-primary" : "cta-btn-secondary"
  } ${className}`;

  if (href) {
    return (
      <a
        ref={ref}
        href={href}
        className={btnClass}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <span>{children}</span>
        {icon && (
          <span className="transition-transform duration-300 group-hover:translate-x-1">
            {icon}
          </span>
        )}
      </a>
    );
  }

  return (
    <button
      ref={ref}
      className={btnClass}
      onClick={onClick}
      type={type}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <span>{children}</span>
      {icon && (
        <span className="transition-transform duration-300 group-hover:translate-x-1">{icon}</span>
      )}
    </button>
  );
}
