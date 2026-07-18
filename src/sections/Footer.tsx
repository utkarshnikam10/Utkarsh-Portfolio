"use client";

import { socialLinks } from "@/constants";

/**
 * Footer
 * Simple footer with links, copyright and clean aesthetic.
 */
export default function Footer() {
  const currentYear = new Date().getFullYear();

  const handleBackToTop = (e: React.MouseEvent) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="border-t border-border bg-background py-12 px-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Copyright */}
        <div className="flex flex-col gap-1 text-center md:text-left">
          <span className="text-text-secondary text-sm">
            &copy; {currentYear} Utkarsh. All rights reserved.
          </span>
          <span className="text-text-tertiary text-xs">Designed & Engineered with passion.</span>
        </div>

        {/* Back to top & Socials */}
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-4">
            {socialLinks.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-text-tertiary hover:text-primary transition-colors text-sm font-mono"
              >
                {social.label}
              </a>
            ))}
          </div>

          <a
            href="#hero"
            onClick={handleBackToTop}
            className="flex-center w-10 h-10 rounded-full border border-border text-text-secondary hover:text-primary hover:border-primary transition-all duration-300"
            aria-label="Back to top"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="12" y1="19" x2="12" y2="5" />
              <polyline points="5 12 12 5 19 12" />
            </svg>
          </a>
        </div>
      </div>
    </footer>
  );
}
