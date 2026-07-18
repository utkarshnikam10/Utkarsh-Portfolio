"use client";

/**
 * AudioSynth — Procedural UI Sound Synthesizer using Web Audio API
 * Generates low-latency warm ambient hover and mechanical click tones procedurally.
 * Avoids browser autoplay blocks by lazy-loading the AudioContext on user interaction.
 */
class AudioSynthImpl {
  private ctx: AudioContext | null = null;

  private initCtx() {
    if (typeof window === "undefined") return;

    if (!this.ctx) {
      const CtxClass =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (CtxClass) {
        this.ctx = new CtxClass();
      }
    }

    if (this.ctx && this.ctx.state === "suspended") {
      void this.ctx.resume();
    }
  }

  playHover() {
    try {
      this.initCtx();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gainNode = this.ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(520, now);
      // Soft pitch decay
      osc.frequency.exponentialRampToValueAtTime(360, now + 0.07);

      // Low volume to prevent hover fatigue
      gainNode.gain.setValueAtTime(0.04, now);
      gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.07);

      osc.connect(gainNode);
      gainNode.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.07);
    } catch {
      // AudioContext failed to load or unsupported
    }
  }

  playClick() {
    try {
      this.initCtx();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gainNode = this.ctx.createGain();

      osc.type = "triangle";
      osc.frequency.setValueAtTime(260, now);
      osc.frequency.exponentialRampToValueAtTime(120, now + 0.12);

      gainNode.gain.setValueAtTime(0.08, now);
      gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

      osc.connect(gainNode);
      gainNode.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.12);
    } catch {
      // AudioContext failed
    }
  }
}

export const AudioSynth = new AudioSynthImpl();
