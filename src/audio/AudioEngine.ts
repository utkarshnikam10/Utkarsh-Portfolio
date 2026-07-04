import { EventBus } from "@/core/EventBus";

/**
 * PROJECT NEXUS // AUDIO ENGINE
 * Responsibility: Low-level Web Audio API initialization and management.
 * Provides a typed audio layer system supporting ambient, music, and
 * positional audio channels. Handles browser autoplay policy compliance.
 *
 * Audio Layers:
 *   - Ambient:    Background environmental sounds (wind, hum, atmosphere)
 *   - Music:      Score tracks (cello/piano per district)
 *   - Positional: 3D spatialized audio attached to scene objects
 *   - UI:         Interface feedback sounds (hover, click)
 *
 * Events emitted:
 *   "audio:context:created"  — AudioContext instantiated
 *   "audio:context:resumed"  — AudioContext resumed after user gesture
 *   "audio:context:suspended" — AudioContext suspended
 *   "audio:layer:created"    — { layer: AudioLayerName }
 *
 * Browser Policy:
 *   AudioContext starts suspended. It resumes on the first user interaction
 *   (click/touch/keypress). The AudioEngine registers a one-time listener
 *   for this gesture.
 *
 * Extension point: Load audio assets via AudioBufferSourceNode in Sprint 4+.
 */

export type AudioLayerName = "ambient" | "music" | "positional" | "ui";

interface AudioLayer {
  name: AudioLayerName;
  gainNode: GainNode;
  defaultVolume: number;
  muted: boolean;
}

class AudioEngineImpl {
  private context: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private layers = new Map<AudioLayerName, AudioLayer>();
  private isInitialized = false;
  private gestureListenerAttached = false;

  // Procedural drone tracking
  private activeDroneOsc: OscillatorNode | null = null;
  private activeDroneGain: GainNode | null = null;

  // Procedural wind tracking
  private activeWindSource: AudioBufferSourceNode | null = null;
  private activeWindFilterLfo: OscillatorNode | null = null;
  private activeWindGain: GainNode | null = null;

  /**
   * Returns whether the audio engine has been initialized.
   */
  public get initialized(): boolean {
    return this.isInitialized;
  }

  /**
   * Returns the current AudioContext state, or "closed" if not created.
   */
  public getContextState(): AudioContextState | "closed" {
    return this.context?.state ?? "closed";
  }

  /**
   * Initialize the Web Audio API context and create the master gain structure.
   * Safe to call multiple times (idempotent).
   */
  public initialize(): void {
    if (this.isInitialized) return;

    // Create AudioContext (handles vendor prefixes internally)
    this.context = new (
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
    )();

    // Master gain node — all layers route through this
    this.masterGain = this.context.createGain();
    this.masterGain.gain.value = 0.8;
    this.masterGain.connect(this.context.destination);

    // Create standard audio layers
    this.createLayer("ambient", 0.6);
    this.createLayer("music", 0.7);
    this.createLayer("positional", 0.8);
    this.createLayer("ui", 0.5);

    // Attach user gesture listener for autoplay policy compliance
    this.attachGestureListener();

    this.isInitialized = true;
    EventBus.emit("audio:context:created");
    console.log("PROJECT NEXUS // Audio engine initialized.");
  }

  /**
   * Create a named audio layer with its own gain node.
   */
  private createLayer(name: AudioLayerName, defaultVolume: number): void {
    if (!this.context || !this.masterGain) return;

    const gainNode = this.context.createGain();
    gainNode.gain.value = defaultVolume;
    gainNode.connect(this.masterGain);

    this.layers.set(name, {
      name,
      gainNode,
      defaultVolume,
      muted: false,
    });

    EventBus.emit("audio:layer:created", { layer: name });
  }

  /**
   * Attach a one-time user gesture listener to resume the AudioContext.
   * Required by browser autoplay policies (Chrome, Safari, Firefox).
   */
  private attachGestureListener(): void {
    if (this.gestureListenerAttached) return;

    const resumeContext = () => {
      if (this.context && this.context.state === "suspended") {
        this.context.resume().then(() => {
          EventBus.emit("audio:context:resumed");
          console.log("PROJECT NEXUS // Audio context resumed via user gesture.");
        });
      }
      // Remove all gesture listeners after first activation
      document.removeEventListener("click", resumeContext);
      document.removeEventListener("touchstart", resumeContext);
      document.removeEventListener("keydown", resumeContext);
    };

    document.addEventListener("click", resumeContext, { once: true });
    document.addEventListener("touchstart", resumeContext, { once: true });
    document.addEventListener("keydown", resumeContext, { once: true });
    this.gestureListenerAttached = true;
  }

  /**
   * Set the master volume (0–1).
   */
  public setMasterVolume(volume: number): void {
    if (!this.masterGain) return;
    this.masterGain.gain.value = Math.max(0, Math.min(1, volume));
  }

  /**
   * Set volume for a specific audio layer (0–1).
   */
  public setLayerVolume(name: AudioLayerName, volume: number): void {
    const layer = this.layers.get(name);
    if (!layer) return;
    layer.gainNode.gain.value = Math.max(0, Math.min(1, volume));
  }

  /**
   * Mute a specific audio layer.
   */
  public muteLayer(name: AudioLayerName): void {
    const layer = this.layers.get(name);
    if (!layer) return;
    layer.gainNode.gain.value = 0;
    layer.muted = true;
  }

  /**
   * Unmute a specific audio layer (restores default volume).
   */
  public unmuteLayer(name: AudioLayerName): void {
    const layer = this.layers.get(name);
    if (!layer) return;
    layer.gainNode.gain.value = layer.defaultVolume;
    layer.muted = false;
  }

  /**
   * Returns the GainNode for a layer — used by future systems to connect
   * AudioBufferSourceNodes or MediaElementSourceNodes.
   */
  public getLayerGain(name: AudioLayerName): GainNode | null {
    return this.layers.get(name)?.gainNode ?? null;
  }

  /**
   * Returns the AudioContext — used by future positional audio systems.
   */
  public getContext(): AudioContext | null {
    return this.context;
  }

  /**
   * Returns diagnostic info for the debug panel.
   */
  public getDiagnostics(): {
    initialized: boolean;
    contextState: string;
    layers: string[];
  } {
    return {
      initialized: this.isInitialized,
      contextState: this.getContextState(),
      layers: Array.from(this.layers.keys()),
    };
  }

  /**
   * Suspend the audio context (used during tab visibility changes).
   */
  public suspend(): void {
    if (this.context && this.context.state === "running") {
      this.context.suspend();
      EventBus.emit("audio:context:suspended");
    }
  }

  /**
   * Resume the audio context.
   */
  public resume(): void {
    if (this.context && this.context.state === "suspended") {
      this.context.resume().then(() => {
        EventBus.emit("audio:context:resumed");
      });
    }
  }

  /**
   * Play a procedural drone and soft ambient wind matching the current district.
   */
  public playDistrictAmbient(districtId: string): void {
    if (!this.context || !this.isInitialized) return;

    this.stopDistrictAmbient();

    const ambientGain = this.getLayerGain("ambient");
    if (!ambientGain) return;

    // ────────────────────── 1. Low Frequency Atmospheric Drone ──────────────────────
    this.activeDroneOsc = this.context.createOscillator();
    this.activeDroneGain = this.context.createGain();

    let freq = 55; // default 55Hz (A1) for well-vault / arrival-plaza
    if (districtId === "kinetic-forge") freq = 65;
    if (districtId === "lattice-matrix") freq = 73;

    this.activeDroneOsc.type = "sine";
    this.activeDroneOsc.frequency.value = freq;

    // Very low volume, background drone
    this.activeDroneGain.gain.setValueAtTime(0.005, this.context.currentTime);

    // Muffled lowpass filter
    const droneFilter = this.context.createBiquadFilter();
    droneFilter.type = "lowpass";
    droneFilter.frequency.value = 100;

    this.activeDroneOsc.connect(droneFilter);
    droneFilter.connect(this.activeDroneGain);
    this.activeDroneGain.connect(ambientGain);
    this.activeDroneOsc.start();

    // ────────────────────── 2. Procedural Wind Synthesizer (White Noise + LFO) ──────────────────────
    const sampleRate = this.context.sampleRate;
    const bufferSize = sampleRate * 2.0; // 2 seconds loop
    const noiseBuffer = this.context.createBuffer(1, bufferSize, sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2.0 - 1.0;
    }

    this.activeWindSource = this.context.createBufferSource();
    this.activeWindSource.buffer = noiseBuffer;
    this.activeWindSource.loop = true;

    this.activeWindGain = this.context.createGain();
    this.activeWindGain.gain.setValueAtTime(0.012, this.context.currentTime); // soft background levels

    // Bandpass filter to isolate rustling wind/leaves sounds
    const windFilter = this.context.createBiquadFilter();
    windFilter.type = "bandpass";
    windFilter.Q.value = 1.2;
    windFilter.frequency.value = 280;

    // LFO to modulate filter frequency (simulates wind gusts)
    this.activeWindFilterLfo = this.context.createOscillator();
    this.activeWindFilterLfo.type = "sine";
    this.activeWindFilterLfo.frequency.value = 0.08; // slow gusts every 12 seconds

    const lfoGain = this.context.createGain();
    lfoGain.gain.value = 120; // modulate filter +/- 120Hz

    // Connect LFO modulation chain
    this.activeWindFilterLfo.connect(lfoGain);
    lfoGain.connect(windFilter.frequency);

    // Connect source chain
    this.activeWindSource.connect(windFilter);
    windFilter.connect(this.activeWindGain);
    this.activeWindGain.connect(ambientGain);

    this.activeWindFilterLfo.start();
    this.activeWindSource.start();

    console.log(`AudioEngine: Procedural wind and drone active at ${freq}Hz.`);
  }

  /**
   * Stop the procedural district drone and wind nodes.
   */
  public stopDistrictAmbient(): void {
    // Teardown drone
    if (this.activeDroneOsc) {
      try {
        this.activeDroneOsc.stop();
      } catch {}
      this.activeDroneOsc.disconnect();
      this.activeDroneOsc = null;
    }
    if (this.activeDroneGain) {
      this.activeDroneGain.disconnect();
      this.activeDroneGain = null;
    }

    // Teardown wind
    if (this.activeWindSource) {
      try {
        this.activeWindSource.stop();
      } catch {}
      this.activeWindSource.disconnect();
      this.activeWindSource = null;
    }
    if (this.activeWindFilterLfo) {
      try {
        this.activeWindFilterLfo.stop();
      } catch {}
      this.activeWindFilterLfo.disconnect();
      this.activeWindFilterLfo = null;
    }
    if (this.activeWindGain) {
      this.activeWindGain.disconnect();
      this.activeWindGain = null;
    }
  }

  /**
   * Teardown the audio engine. Closes the AudioContext and clears all layers.
   */
  public destroy(): void {
    this.stopDistrictAmbient();
    if (this.context) {
      this.context.close();
    }
    this.layers.clear();
    this.masterGain = null;
    this.context = null;
    this.isInitialized = false;
    this.gestureListenerAttached = false;
    console.log("PROJECT NEXUS // Audio engine destroyed.");
  }
}

/**
 * Singleton AudioEngine shared across the application.
 */
export const AudioEngine = new AudioEngineImpl();
