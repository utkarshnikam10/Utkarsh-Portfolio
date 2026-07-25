"use client";

class SpatialAudioEngine {
  private ctx: AudioContext | null = null;
  private ambientOsc: OscillatorNode | null = null;
  private ambientGain: GainNode | null = null;
  private pannerNode: PannerNode | null = null;
  private isUnlocked: boolean = false;

  constructor() {
    // Lazy AudioContext initialization
  }

  public init() {
    if (this.ctx || typeof window === "undefined") return;

    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      this.ctx = new AudioCtx();

      this.pannerNode = this.ctx.createPanner();
      this.pannerNode.panningModel = "HRTF";
      this.pannerNode.distanceModel = "exponential";
      this.pannerNode.refDistance = 1;
      this.pannerNode.maxDistance = 10000;
      this.pannerNode.rolloffFactor = 1.5;
      this.pannerNode.connect(this.ctx.destination);

      // Low 60Hz Sub-bass Ambient Drone
      this.ambientOsc = this.ctx.createOscillator();
      this.ambientGain = this.ctx.createGain();

      this.ambientOsc.type = "sine";
      this.ambientOsc.frequency.setValueAtTime(60, this.ctx.currentTime);
      this.ambientGain.gain.setValueAtTime(0.001, this.ctx.currentTime);

      this.ambientOsc.connect(this.ambientGain);
      this.ambientGain.connect(this.pannerNode);

      this.ambientOsc.start();
    } catch {
      // AudioContext unavailable
    }
  }

  public unlock() {
    if (this.isUnlocked || !this.ctx) return;
    if (this.ctx.state === "suspended") {
      this.ctx.resume();
    }
    this.isUnlocked = true;
  }

  public updateCameraPosition(x: number, y: number, z: number, chamber: number) {
    if (!this.ctx || !this.pannerNode || !this.ambientGain) return;

    if (this.pannerNode.positionX) {
      this.pannerNode.positionX.setValueAtTime(x, this.ctx.currentTime);
      this.pannerNode.positionY.setValueAtTime(y, this.ctx.currentTime);
      this.pannerNode.positionZ.setValueAtTime(z, this.ctx.currentTime);
    }

    // Volume gain boost inside Chamber I (0) and Chamber IV (3)
    const isHighVolumeChamber = chamber === 0 || chamber === 3;
    const targetGain = isHighVolumeChamber ? 0.08 : 0.02;

    this.ambientGain.gain.setTargetAtTime(targetGain, this.ctx.currentTime, 0.1);
  }

  public playGlassNodePulse() {
    if (!this.ctx || !this.isUnlocked) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(1200, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(300, this.ctx.currentTime + 0.015);

      gain.gain.setValueAtTime(0.05, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.015);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.016);
    } catch {
      // Ignore audio glitches
    }
  }
}

export const spatialAudio = new SpatialAudioEngine();
