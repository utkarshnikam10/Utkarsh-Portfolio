"use client";

import { useState, useEffect, useRef } from "react";
import SectionHeader from "@/components/SectionHeader";
import Button from "@/components/Button";
import { socialLinks } from "@/constants";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * Contact — Professional contact form with social links
 * Clean, minimal input fields with Electric Blue focus states
 */
export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const containerRef = useRef<HTMLDivElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setStatus("success");
      setFormData({ name: "", email: "", message: "" });
    } catch {
      setStatus("error");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

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
    <section id="contact" className="relative h-full flex items-center py-12 md:py-20 px-6">
      <div className="max-w-7xl mx-auto w-full">
        <SectionHeader index="06" title="Get In Touch" />

        <div ref={containerRef} className="grid grid-cols-1 lg:grid-cols-2 gap-12 mt-8 items-start">
          {/* Form */}
          <div className="rounded-lg p-8 border border-border bg-surface/30 opacity-0">
            <h3 className="font-serif text-lg font-bold text-text mb-6">Send a Message</h3>

            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-[10px] font-mono tracking-widest uppercase text-text-tertiary mb-2"
                  >
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="John Doe"
                    className="form-field"
                    disabled={status === "sending"}
                  />
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-[10px] font-mono tracking-widest uppercase text-text-tertiary mb-2"
                  >
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="john@example.com"
                    className="form-field"
                    disabled={status === "sending"}
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="block text-[10px] font-mono tracking-widest uppercase text-text-tertiary mb-2"
                >
                  Your Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={5}
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Tell me about your project or opportunity..."
                  className="form-field resize-none"
                  disabled={status === "sending"}
                />
              </div>

              <div className="mt-2">
                <Button type="submit" variant="primary" className="w-full justify-center">
                  {status === "sending" ? "Sending..." : "Send Message"}
                </Button>
              </div>

              {status === "success" && (
                <p className="text-primary text-xs leading-relaxed mt-2 text-center">
                  ◆ Message sent successfully. I&apos;ll get back to you shortly.
                </p>
              )}
              {status === "error" && (
                <p className="text-error text-xs leading-relaxed mt-2 text-center">
                  Something went wrong. Please try again.
                </p>
              )}
            </form>
          </div>

          {/* Contact Info */}
          <div className="flex flex-col gap-8 opacity-0">
            <div className="rounded-lg p-8 border border-border bg-surface/30">
              <h3 className="font-serif text-lg font-bold text-text mb-4">Let&apos;s Connect</h3>
              <p className="text-text-secondary text-sm leading-relaxed mb-6 font-sans">
                I&apos;m always open to discussing new projects, creative ideas, or opportunities to
                be part of your engineering team. Feel free to reach out.
              </p>

              <div className="flex flex-col gap-4 text-xs font-mono">
                <div className="flex items-center gap-3">
                  <span className="text-primary">&gt; LOCATION:</span>
                  <span className="text-text-secondary">India (IST)</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-primary">&gt; AVAILABILITY:</span>
                  <span className="text-text-secondary">Open to opportunities</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-primary">&gt; RESPONSE TIME:</span>
                  <span className="text-text-secondary">&lt; 24 hours</span>
                </div>
              </div>
            </div>

            {/* Social Links */}
            <div className="rounded-lg p-8 border border-border bg-surface/30">
              <h4 className="text-text-tertiary text-[10px] tracking-widest uppercase font-mono mb-4">
                Social Coordinates
              </h4>
              <div className="flex flex-wrap gap-3">
                {socialLinks.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 text-xs font-mono tracking-wider text-text-secondary border border-border rounded-md hover:border-primary hover:text-primary transition-all duration-300 no-underline"
                  >
                    {social.label}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
