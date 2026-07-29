"use client";

import { FormEvent, useState } from "react";

import { UTKARSH } from "@/constants/portfolio";

function playSealTone() {
  const AudioContextConstructor = window.AudioContext;
  if (!AudioContextConstructor) return;

  const context = new AudioContextConstructor();
  const oscillator = context.createOscillator();
  const gain = context.createGain();
  oscillator.type = "sine";
  oscillator.frequency.setValueAtTime(230, context.currentTime);
  oscillator.frequency.exponentialRampToValueAtTime(92, context.currentTime + 0.16);
  gain.gain.setValueAtTime(0.06, context.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, context.currentTime + 0.2);
  oscillator.connect(gain);
  gain.connect(context.destination);
  oscillator.start();
  oscillator.stop(context.currentTime + 0.2);
  window.setTimeout(() => context.close(), 260);
}

export function ContactSection() {
  const [isSealed, setIsSealed] = useState(false);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    playSealTone();
    setIsSealed(true);
  };

  return (
    <section className="contact-section section-shell" id="contact" aria-labelledby="contact-title">
      <div className="section-heading section-heading--compact">
        <p className="telemetry-label">05 // ROYAL DECREE</p>
        <div>
          <h2 id="contact-title">
            A good brief starts
            <br />
            with a <em>clear signal.</em>
          </h2>
          <p>For products, platforms, and teams looking for a more considered next chapter.</p>
        </div>
      </div>

      <div className="contact-grid">
        <form className="decree-form" onSubmit={handleSubmit}>
          <div className="decree-form__topline">
            <span>INCOMING DECREE // {isSealed ? "SEALED" : "DRAFT"}</span>
            <span>UTK / 001</span>
          </div>
          <label>
            <span>Name / title</span>
            <input name="name" required placeholder="Your name" />
          </label>
          <label>
            <span>Kingdom / province</span>
            <input name="company" required placeholder="Company or team" />
          </label>
          <label>
            <span>Decree details</span>
            <textarea
              name="details"
              required
              placeholder="What are you trying to make more clear?"
              rows={4}
            />
          </label>
          <div className="decree-form__footer">
            <button className={`seal-button ${isSealed ? "is-sealed" : ""}`} type="submit">
              <span>{isSealed ? "Decree sealed" : "Apply seal"}</span>
              <i aria-hidden="true">✦</i>
            </button>
            <span aria-live="polite">
              {isSealed
                ? "Signal acknowledged. A response path has been opened."
                : "No data leaves this preview."}
            </span>
          </div>
        </form>

        <aside className="contact-terminal" aria-label="Connection diagnostics">
          <div className="contact-terminal__topline">
            <span>TERMINAL // UTKARSH</span>
            <span>● LINKED</span>
          </div>
          <div className="contact-terminal__log" aria-live="polite">
            <p>
              <i>›</i> lineage.check <span>utkarsh</span>
            </p>
            <p>
              <i>✓</i> systems online <span>stable</span>
            </p>
            <p>
              <i>✓</i> connection route <span>{UTKARSH.email}</span>
            </p>
            <p>
              <i>{isSealed ? "✓" : "…"}</i> decree protocol{" "}
              <span>{isSealed ? "acknowledged" : "awaiting seal"}</span>
            </p>
          </div>
          <p className="contact-terminal__footnote">
            INDEPENDENT PRACTICE / AVAILABLE FOR SELECTED PARTNERSHIPS
          </p>
        </aside>
      </div>
    </section>
  );
}
