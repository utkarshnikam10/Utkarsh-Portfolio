/* eslint-disable */
"use client";

import React, { useRef, useMemo, useEffect, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { useGravityWell } from "../hooks/useGravityWell";

/**
 * Audio FFT Analyser — extracts bass energy (20–150Hz) from the audio context
 * and exposes it as a uniform for the particle compute loop.
 */
class AudioFFTAnalyser {
  private ctx: AudioContext | null = null;
  private analyser: AnalyserNode | null = null;
  private dataArray: number[] = [];
  public bassEnergy: number = 0;

  public init() {
    if (this.ctx || typeof window === "undefined") return;

    try {
      const AudioCtx = (window as unknown as { AudioContext: typeof AudioContext }).AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new AudioCtx();
      this.ctx = ctx;

      const analyser = ctx.createAnalyser();
      analyser.fftSize = 256;
      this.analyser = analyser;
      this.dataArray = new Array(analyser.frequencyBinCount).fill(0);

      // Create a silent oscillator to feed the analyser
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.0, ctx.currentTime);
      osc.connect(gain);
      gain.connect(analyser);
      analyser.connect(ctx.destination);
      osc.start();
    } catch {
      // Audio unavailable
    }
  }

  public update() {
    if (!this.analyser || this.dataArray.length === 0) return;

    // Use a temporary typed array for the FFT call, then copy values
    const tempArray = new Uint8Array(this.analyser.frequencyBinCount);
    this.analyser.getByteFrequencyData(tempArray);

    for (let i = 0; i < tempArray.length; i++) {
      this.dataArray[i] = tempArray[i];
    }

    // Extract low-frequency bass bins (≈ 20Hz–150Hz)
    const bassSum = (this.dataArray[0] + this.dataArray[1]) / 2;
    this.bassEnergy = bassSum / 255.0;
  }
}

const fftAnalyser = new AudioFFTAnalyser();

export function ParticleFluid() {
  const pointsRef = useRef<THREE.Points>(null);
  const { pointer } = useThree();
  const gravity = useGravityWell();

  const count = 100000;

  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleGesture = () => {
      fftAnalyser.init();
      window.removeEventListener("pointerdown", handleGesture);
    };
    window.addEventListener("pointerdown", handleGesture);

    return () => window.removeEventListener("pointerdown", handleGesture);
  }, []);

  const [{ positions, velocities, basePositions }] = useState(() => {
    const pos = new Float32Array(count * 3);
    const basePos = new Float32Array(count * 3);
    const vel = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      const radius = 3.5 + Math.random() * 4.0;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      const x = radius * Math.sin(phi) * Math.cos(theta);
      const y = radius * Math.sin(phi) * Math.sin(theta);
      const z = radius * Math.cos(phi);

      pos[i * 3] = x;
      pos[i * 3 + 1] = y;
      pos[i * 3 + 2] = z;

      basePos[i * 3] = x;
      basePos[i * 3 + 1] = y;
      basePos[i * 3 + 2] = z;

      vel[i * 3] = (Math.random() - 0.5) * 0.002;
      vel[i * 3 + 1] = (Math.random() - 0.5) * 0.002;
      vel[i * 3 + 2] = (Math.random() - 0.5) * 0.002;
    }

    return { positions: pos, basePositions: basePos, velocities: vel };
  });

  useFrame((state, delta) => {
    if (!pointsRef.current) return;

    // Update FFT bass energy each frame
    fftAnalyser.update();
    const audioBass = fftAnalyser.bassEnergy;

    const geom = pointsRef.current.geometry;
    const posAttr = geom.getAttribute("position");
    const time = state.clock.getElapsedTime();

    const mouseX = pointer.x * 6.0;
    const mouseY = pointer.y * 4.0;

    // Bass-driven turbulence multiplier: idle = 1.0, bass hit = up to 4.0
    const turbulenceMultiplier = 1.0 + audioBass * 3.0;

    // Process every 4th particle per frame for performance (round-robin across 4 frames)
    const frameOffset = Math.floor(time * 60) % 4;

    for (let i = frameOffset; i < count; i += 4) {
      let px = posAttr.getX(i);
      let py = posAttr.getY(i);
      let pz = posAttr.getZ(i);

      // Mouse repulsion / fluid drag
      const dx = px - mouseX;
      const dy = py - mouseY;
      const distSq = dx * dx + dy * dy;

      if (distSq < 4.0 && distSq > 0.01) {
        const invDist = 1.0 / Math.sqrt(distSq);
        const force = (4.0 - distSq) * 0.08 * turbulenceMultiplier;
        velocities[i * 3] += dx * invDist * force;
        velocities[i * 3 + 1] += dy * invDist * force;
      }

      // Gravitational pull when mouse down
      if (gravity.isMouseDown) {
        velocities[i * 3] += (gravity.gravityForce.x - px) * 0.02;
        velocities[i * 3 + 1] += (gravity.gravityForce.y - py) * 0.02;
      }

      // Audio-driven curl-noise turbulence explosion on bass hits
      if (audioBass > 0.3) {
        const noiseX = Math.sin(time * 2.0 + i * 0.01) * audioBass * 0.15;
        const noiseY = Math.cos(time * 2.0 + i * 0.013) * audioBass * 0.15;
        velocities[i * 3] += noiseX;
        velocities[i * 3 + 1] += noiseY;
      }

      // Spring return to base positions
      const bx = basePositions[i * 3];
      const by = basePositions[i * 3 + 1];
      const bz = basePositions[i * 3 + 2];

      velocities[i * 3] += (bx - px) * 0.005;
      velocities[i * 3 + 1] += (by - py) * 0.005;
      velocities[i * 3 + 2] += (bz - pz) * 0.005;

      // Damping
      velocities[i * 3] *= 0.94;
      velocities[i * 3 + 1] *= 0.94;
      velocities[i * 3 + 2] *= 0.94;

      // Brownian drift
      px += velocities[i * 3] + Math.sin(time + i) * 0.002;
      py += velocities[i * 3 + 1] + Math.cos(time + i) * 0.002;
      pz += velocities[i * 3 + 2];

      posAttr.setXYZ(i, px, py, pz);
    }

    posAttr.needsUpdate = true;
  });

  const particleShader = useMemo(
    () => ({
      vertexShader: /* glsl */ `
        attribute vec3 position;
        uniform mat4 projectionMatrix;
        uniform mat4 modelViewMatrix;
        
        varying float vDepth;
        varying float vDist;
        
        void main() {
          vec4 mvPos = modelViewMatrix * vec4(position, 1.0);
          vDepth = -mvPos.z;
          vDist = length(position.xy);
          
          gl_Position = projectionMatrix * mvPos;
          gl_PointSize = max(1.0, 3.5 - vDepth * 0.15);
        }
      `,
      fragmentShader: /* glsl */ `
        varying float vDepth;
        varying float vDist;
        
        void main() {
          // Circular soft particle
          vec2 center = gl_PointCoord - 0.5;
          float dist = length(center);
          if (dist > 0.5) discard;
          float softEdge = 1.0 - smoothstep(0.2, 0.5, dist);
          
          // Depth-based color: close = warm gold, far = cool cyan
          float t = clamp(vDepth / 12.0, 0.0, 1.0);
          vec3 warm = vec3(1.0, 1.0, 0.14);   // Gold
          vec3 mid  = vec3(0.3, 0.75, 1.0);   // Cyan
          vec3 cool = vec3(0.2, 0.15, 0.6);   // Deep purple
          
          vec3 color = mix(warm, mid, smoothstep(0.0, 0.5, t));
          color = mix(color, cool, smoothstep(0.5, 1.0, t));
          
          // Radial fade for particles far from center
          float radialFade = smoothstep(8.0, 3.0, vDist);
          
          float alpha = softEdge * (0.25 + radialFade * 0.35);
          
          gl_FragColor = vec4(color, alpha);
        }
      `,
    }),
    []
  );

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <shaderMaterial
        vertexShader={particleShader.vertexShader}
        fragmentShader={particleShader.fragmentShader}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}
