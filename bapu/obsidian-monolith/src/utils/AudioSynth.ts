"use client";

class ProceduralAudioSynth {
  private ctx: AudioContext | null = null;
  private subOsc: OscillatorNode | null = null;
  private subGain: GainNode | null = null;
  private filter: BiquadFilterNode | null = null;
  private velOsc: OscillatorNode | null = null;
  private velGain: GainNode | null = null;
  private chordGain: GainNode | null = null;
  private isUnlocked: boolean = false;

  public init() {
    if (this.ctx || typeof window === "undefined") return;

    try {
      const AudioCtx = (window as unknown as { AudioContext: typeof AudioContext; webkitAudioContext: typeof AudioContext }).AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new AudioCtx();
      this.ctx = ctx;

      // Continuous 55Hz Sub-Bass Drone with Low-Pass Filter
      const subOsc = ctx.createOscillator();
      const subGain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      subOsc.type = "sine";
      subOsc.frequency.setValueAtTime(55, ctx.currentTime);

      filter.type = "lowpass";
      filter.frequency.setValueAtTime(200, ctx.currentTime);

      subGain.gain.setValueAtTime(0.001, ctx.currentTime);

      subOsc.connect(filter);
      filter.connect(subGain);
      subGain.connect(ctx.destination);
      subOsc.start();

      this.subOsc = subOsc;
      this.subGain = subGain;
      this.filter = filter;

      // Velocity Whine Oscillator (400Hz - 1200Hz)
      const velOsc = ctx.createOscillator();
      const velGain = ctx.createGain();

      velOsc.type = "sine";
      velOsc.frequency.setValueAtTime(400, ctx.currentTime);
      velGain.gain.setValueAtTime(0.001, ctx.currentTime);

      velOsc.connect(velGain);
      velGain.connect(ctx.destination);
      velOsc.start();

      this.velOsc = velOsc;
      this.velGain = velGain;

      // Gravitational Pulse Chord Gain Node
      const chordGain = ctx.createGain();
      chordGain.gain.setValueAtTime(0.001, ctx.currentTime);
      chordGain.connect(ctx.destination);
      this.chordGain = chordGain;
    } catch {
      // AudioContext fallback
    }
  }

  public unlock() {
    if (this.isUnlocked || !this.ctx) return;
    if (this.ctx.state === "suspended") {
      this.ctx.resume();
    }
    this.isUnlocked = true;
  }

  public updateVelocity(speed: number, cameraZVelocity: number) {
    if (!this.ctx || !this.isUnlocked) return;

    if (this.filter) {
      const targetFreq = Math.min(200 + cameraZVelocity * 300, 2000);
      this.filter.frequency.setTargetAtTime(targetFreq, this.ctx.currentTime, 0.05);
    }

    if (this.subGain) {
      this.subGain.gain.setTargetAtTime(0.06, this.ctx.currentTime, 0.1);
    }

    if (this.velOsc && this.velGain) {
      const pitch = Math.min(400 + speed * 800, 1200);
      const gainVal = Math.min(speed * 0.08, 0.04);
      this.velOsc.frequency.setTargetAtTime(pitch, this.ctx.currentTime, 0.02);
      this.velGain.gain.setTargetAtTime(gainVal, this.ctx.currentTime, 0.05);
    }
  }

  public playGravitationalPulse(isMouseDown: boolean) {
    if (!this.ctx || !this.isUnlocked || !this.chordGain) return;

    const targetGain = isMouseDown ? 0.07 : 0.001;
    this.chordGain.gain.setTargetAtTime(targetGain, this.ctx.currentTime, 0.05);
  }

  // Heavy FM Thud for kinetic interactions / Shatter events
  public playImpactHaptic() {
    if (!this.ctx || !this.isUnlocked) return;

    const time = this.ctx.currentTime;
    
    // Sub transient
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    
    osc.type = "sine";
    // Pitch drop from 150Hz to 40Hz
    osc.frequency.setValueAtTime(150, time);
    osc.frequency.exponentialRampToValueAtTime(40, time + 0.1);
    
    // Volume spike
    gain.gain.setValueAtTime(0, time);
    gain.gain.linearRampToValueAtTime(0.4, time + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.3);
    
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    
    osc.start(time);
    osc.stop(time + 0.3);

    // High frequency glassy pop
    const noiseOsc = this.ctx.createOscillator();
    const noiseGain = this.ctx.createGain();
    const bpFilter = this.ctx.createBiquadFilter();

    noiseOsc.type = "triangle";
    noiseOsc.frequency.setValueAtTime(2000, time);
    noiseOsc.frequency.linearRampToValueAtTime(800, time + 0.05);

    bpFilter.type = "bandpass";
    bpFilter.frequency.setValueAtTime(4000, time);
    bpFilter.Q.value = 5.0;

    noiseGain.gain.setValueAtTime(0, time);
    noiseGain.gain.linearRampToValueAtTime(0.15, time + 0.005);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, time + 0.1);

    noiseOsc.connect(bpFilter);
    bpFilter.connect(noiseGain);
    noiseGain.connect(this.ctx.destination);

    noiseOsc.start(time);
    noiseOsc.stop(time + 0.1);
  }
}

export const audioSynth = new ProceduralAudioSynth();
