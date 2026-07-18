"use client";

import { useState, useEffect, useRef } from "react";
import SectionHeader from "@/components/SectionHeader";
import Button from "@/components/Button";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * Decree — Chapter IV: Royal Petition
 * Styled contact form styled as a royal petition scroll to the kingdom.
 */

export default function Decree() {
  const [formData, setFormData] = useState({
    title: "",
    kingdom: "",
    petition: "",
  });
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const containerRef = useRef<HTMLDivElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");

    try {
      // Simulate royal scroll seal validation
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setStatus("success");
      setFormData({ title: "", kingdom: "", petition: "" });
    } catch {
      setStatus("error");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Scroll reveal trigger
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    gsap.fromTo(
      el.children,
      { opacity: 0, y: 40 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.2,
        ease: "power3.out",
        scrollTrigger: {
          trigger: el,
          start: "top 85%",
          toggleActions: "play none none none",
        },
      }
    );
  }, []);

  return (
    <section id="decree" className="py-32 px-6">
      <div className="max-w-7xl mx-auto">
        <SectionHeader index="Chapter IV" title="The Royal Decree" />

        <div ref={containerRef} className="grid grid-cols-1 lg:grid-cols-2 gap-12 mt-8 items-start">
          {/* Left Column: Form Scroll */}
          <div className="glass gold-corners rounded p-8 border border-border opacity-0">
            <h3 className="font-serif text-lg font-bold text-gradient mb-6 uppercase">
              Submit a Royal Petition
            </h3>

            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="title"
                    className="block text-[10px] font-mono tracking-widest uppercase text-text-tertiary mb-2"
                  >
                    Name & Title (e.g., Senapati)
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    required
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="Amarendra Baahubali"
                    className="form-field"
                    disabled={status === "sending"}
                  />
                </div>

                <div>
                  <label
                    htmlFor="kingdom"
                    className="block text-[10px] font-mono tracking-widest uppercase text-text-tertiary mb-2"
                  >
                    Kingdom / Province
                  </label>
                  <input
                    type="text"
                    id="kingdom"
                    name="kingdom"
                    required
                    value={formData.kingdom}
                    onChange={handleChange}
                    placeholder="Mahishmati"
                    className="form-field"
                    disabled={status === "sending"}
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="petition"
                  className="block text-[10px] font-mono tracking-widest uppercase text-text-tertiary mb-2"
                >
                  Petition / Message Scroll
                </label>
                <textarea
                  id="petition"
                  name="petition"
                  required
                  rows={5}
                  value={formData.petition}
                  onChange={handleChange}
                  placeholder="Draft your decree to the royal throne here..."
                  className="form-field resize-none"
                  disabled={status === "sending"}
                />
              </div>

              <div className="mt-2">
                <Button type="submit" variant="primary" className="w-full justify-center">
                  {status === "sending" ? "Sealing Scroll..." : "Send Decree Scroll"}
                </Button>
              </div>

              {status === "success" && (
                <p className="text-primary text-xs font-serif leading-relaxed mt-2 text-center animate-pulse">
                  ❖ The royal seal has been stamped. Your petition is dispatched to Sivagami Devi.
                </p>
              )}
              {status === "error" && (
                <p className="text-error text-xs font-serif leading-relaxed mt-2 text-center">
                  ◇ The carrier pigeon encountered a storm. Please resubmit your petition scroll.
                </p>
              )}
            </form>
          </div>

          {/* Right Column: Royal Stamp and Law specifications */}
          <div className="flex flex-col gap-8 opacity-0">
            <div className="glass gold-corners rounded p-8 border border-border">
              <h3 className="font-serif text-lg font-bold text-text mb-4 uppercase">
                The Sovereign Laws
              </h3>
              <p className="text-text-secondary text-sm leading-relaxed mb-6 font-sans">
                Every petition submitted is subject to the supreme command of Sivagami Devi. Any
                request contesting the sovereignty of the throne of Mahishmati will be summarily
                adjudicated by Commander Kattappa.
              </p>

              <div className="flex flex-col gap-4 text-xs font-mono">
                <div className="flex items-center gap-3">
                  <span className="text-primary">&gt; COURT STATUS:</span>
                  <span className="text-text-secondary">CONVENING</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-primary">&gt; ADJUDICATOR:</span>
                  <span className="text-text-secondary">Sivagami Devi</span>
                </div>
              </div>
            </div>

            {/* Stylized Sanskrit/Royal emblem block */}
            <div className="bg-[#0f0c09] border border-border p-6 rounded font-mono text-[10px] text-text-tertiary leading-relaxed relative overflow-hidden flex flex-col gap-2">
              <div className="absolute top-0 right-0 p-4 opacity-5 font-serif text-6xl text-primary pointer-events-none">
                ॐ
              </div>
              <p className="text-primary font-bold">
                MAHISHMATI SOVEREIGN PROTOCOL % ACCESS-SECURE
              </p>
              <p>&gt; Stamping signatures: Kattappa, Amarendra, Bhallala</p>
              <p>&gt; Checking lineage alignment... Mahendra verified.</p>
              <p className="text-success">&gt; Royal seal authentic.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
