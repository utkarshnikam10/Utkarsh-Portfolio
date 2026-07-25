"use client";

import React, { useState, useEffect } from "react";

const NAV_ITEMS = [
  { id: "hero", label: "HOME" },
  { id: "projects", label: "PROJECTS" },
  { id: "capabilities", label: "CAPABILITIES" },
  { id: "contact", label: "CONTACT" },
];

export function PillNavigation() {
  const [activeSection, setActiveSection] = useState("hero");
  const [scrolled, setScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    // Entrance animation trigger
    const timer = setTimeout(() => setMounted(true), 200);

    if (typeof window === "undefined") return () => clearTimeout(timer);

    const handleScroll = () => {
      setScrolled(window.scrollY > 50);

      const sections = ["hero", "projects", "capabilities", "contact"];
      for (const sectionId of sections) {
        const el = document.getElementById(sectionId);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 250 && rect.bottom >= 150) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      clearTimeout(timer);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
    setMobileMenuOpen(false);
  };

  return (
    <>
      <header
        className={`fixed top-3 md:top-5 left-0 right-0 z-50 flex justify-center px-3 md:px-4 pointer-events-none select-none transition-all duration-700 ${
          mounted ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-6"
        }`}
      >
        <div
          className={`pointer-events-auto transition-all duration-500 ease-out flex items-center justify-between gap-2 md:gap-8 px-3 md:px-6 py-2 md:py-2.5 rounded-full border ${
            scrolled
              ? "bg-[#08080c]/90 backdrop-blur-2xl border-white/15 shadow-[0_10px_30px_rgba(0,0,0,0.9),0_0_1px_rgba(255,255,255,0.1)]"
              : "bg-[#08080c]/60 backdrop-blur-xl border-white/10"
          }`}
        >
          {/* Identity Pill Badge */}
          <div className="flex items-center gap-2 md:gap-2.5 font-mono text-[9px] md:text-[10px] tracking-[0.25em] text-white/80">
            <span className="relative flex h-2 w-2 md:h-2.5 md:w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60" />
              <span className="relative inline-flex rounded-full h-2 w-2 md:h-2.5 md:w-2.5 bg-emerald-500 shadow-[0_0_8px_rgba(52,211,153,0.6)]" />
            </span>
            <span className="font-bold text-white tracking-widest">UTKARSH</span>
            <span className="hidden lg:inline text-white/30">// CREATIVE TECHNOLOGIST</span>
          </div>

          {/* Desktop Section Anchors */}
          <nav className="hidden md:flex items-center gap-1 bg-white/[0.04] p-1 rounded-full border border-white/5">
            {NAV_ITEMS.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={`magnetic-press relative px-3.5 py-1 rounded-full font-mono text-[9px] uppercase tracking-[0.25em] transition-all duration-300 ${
                    isActive
                      ? "text-black font-semibold bg-[#ffff23] shadow-[0_0_16px_rgba(255,255,35,0.5)]"
                      : "text-white/60 hover:text-white hover:bg-white/[0.08]"
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Right Stats & CTA */}
          <div className="flex items-center gap-2 md:gap-3">
            <div className="hidden xl:flex items-center gap-2 font-mono text-[9px] text-white/50 tracking-[0.2em] px-3 py-1 bg-white/[0.03] rounded-full border border-white/5">
              <span className="text-[#ffff23] font-semibold">80+</span> BUILDS
              <span className="text-white/20">|</span>
              <span className="text-[#38bdf8] font-semibold">7+</span> YRS
            </div>

            <a
              href="#contact"
              onClick={(e) => {
                e.preventDefault();
                scrollToSection("contact");
              }}
              className="magnetic-press group flex items-center gap-1.5 md:gap-2 font-mono text-[8px] md:text-[9px] uppercase tracking-[0.25em] text-black bg-white hover:bg-[#ffff23] px-2.5 md:px-3.5 py-1 md:py-1.5 rounded-full font-semibold transition-all duration-300 shadow-lg hover:shadow-[0_0_25px_rgba(255,255,35,0.6)]"
            >
              <span className="hidden sm:inline">BOOK CALL</span>
              <span className="sm:hidden">HIRE</span>
              <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
            </a>

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              className="md:hidden flex flex-col items-center justify-center gap-[3px] w-7 h-7 rounded-full bg-white/[0.06] border border-white/10"
              aria-label="Toggle navigation"
            >
              <span className={`block w-3 h-[1.5px] bg-white/70 transition-all duration-300 ${mobileMenuOpen ? "rotate-45 translate-y-[4.5px]" : ""}`} />
              <span className={`block w-3 h-[1.5px] bg-white/70 transition-all duration-300 ${mobileMenuOpen ? "opacity-0" : ""}`} />
              <span className={`block w-3 h-[1.5px] bg-white/70 transition-all duration-300 ${mobileMenuOpen ? "-rotate-45 -translate-y-[4.5px]" : ""}`} />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Bottom-Sheet Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-[49] pointer-events-auto" onClick={() => setMobileMenuOpen(false)}>
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          {/* Menu Sheet */}
          <nav
            className="absolute bottom-0 left-0 right-0 bg-[#08080c]/95 backdrop-blur-2xl border-t border-white/10 rounded-t-3xl p-6 pb-10 animate-[slideUp_0.3s_ease-out]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-10 h-1 bg-white/20 rounded-full mx-auto mb-6" />
            <div className="flex flex-col gap-2">
              {NAV_ITEMS.map((item) => {
                const isActive = activeSection === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => scrollToSection(item.id)}
                    className={`w-full text-left px-5 py-3.5 rounded-xl font-mono text-[11px] uppercase tracking-[0.3em] transition-all duration-300 ${
                      isActive
                        ? "text-black font-bold bg-[#ffff23] shadow-[0_0_20px_rgba(255,255,35,0.4)]"
                        : "text-white/70 bg-white/[0.04] hover:bg-white/[0.08] border border-white/5"
                    }`}
                  >
                    {item.label}
                  </button>
                );
              })}
            </div>
          </nav>
        </div>
      )}
    </>
  );
}

