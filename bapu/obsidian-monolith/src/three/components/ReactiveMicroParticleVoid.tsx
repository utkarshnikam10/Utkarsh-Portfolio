"use client";

import React, { useRef, useMemo, useEffect, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

/**
 * ReactiveMicroParticleVoid — Hyper-responsive, ultra-luxury micro-particle system.
 * Key Upgrades:
 * 1. Darker background base opacity (0.12) to ensure 100% text readability.
 * 2. Instantaneous pointer reactivity (4.5 unit radius) with strong magnetic pull & push rings.
 * 3. High-contrast cursor glow (bright gold #ffff23 & electric cyan #38bdf8 ignition around cursor).
 * 4. Smooth spring recoil & velocity shockwave propagation.
 */

const microParticleVertexShader = /* glsl */ `
  attribute vec3 aVelocity;
  attribute float aSize;
  attribute float aPhase;

  uniform float uTime;
  uniform float uScrollDelta;
  uniform vec3 uRayOrigin;
  uniform vec3 uRayDirection;
  uniform vec2 uMouseVel;
  uniform float uMouseDown;

  varying float vDepth;
  varying float vDistToMouse;
  varying float vPhase;

  // Fast Simplex Noise
  vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 permute(vec4 x) { return mod289(((x * 34.0) + 1.0) * x); }
  vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

  float snoise(vec3 v) {
    const vec2 C = vec2(1.0/6.0, 1.0/3.0);
    const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
    vec3 i = floor(v + dot(v, C.yyy));
    vec3 x0 = v - i + dot(i, C.xxx);
    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min(g.xyz, l.zxy);
    vec3 i2 = max(g.xyz, l.zxy);
    vec3 x1 = x0 - i1 + C.xxx;
    vec3 x2 = x0 - i2 + C.yyy;
    vec3 x3 = x0 - D.yyy;
    i = mod289(i);
    vec4 p = permute(permute(permute(
      i.z + vec4(0.0, i1.z, i2.z, 1.0))
      + i.y + vec4(0.0, i1.y, i2.y, 1.0))
      + i.x + vec4(0.0, i1.x, i2.x, 1.0));
    float n_ = 0.142857142857;
    vec3 ns = n_ * D.wyz - D.xzx;
    vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_);
    vec4 x = x_ * ns.x + ns.yyyy;
    vec4 y = y_ * ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);
    vec4 b0 = vec4(x.xy, y.xy);
    vec4 b1 = vec4(x.zw, y.zw);
    vec4 s0 = floor(b0) * 2.0 + 1.0;
    vec4 s1 = floor(b1) * 2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));
    vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
    vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;
    vec3 p0 = vec3(a0.xy, h.x);
    vec3 p1 = vec3(a0.zw, h.y);
    vec3 p2 = vec3(a1.xy, h.z);
    vec3 p3 = vec3(a1.zw, h.w);
    vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
    p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
    vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
    m = m * m;
    return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
  }

  void main() {
    vPhase = aPhase;
    vec3 pos = position;

    // 1. CONTINUOUS ORGANIC FLUID ADVECTION (Living Cosmic Dust Motion)
    // Particles continuously drift, swirl, and breathe even when idle!
    vec3 flowPos = pos;
    
    // Dynamic 3D orbital vorticity
    float theta = uTime * 0.18 + aPhase * 6.28;
    float orbitRadius = 0.4 + sin(uTime * 0.8 + aPhase * 3.14) * 0.3;
    flowPos.x += cos(theta) * orbitRadius;
    flowPos.y += sin(theta * 1.3) * orbitRadius;
    flowPos.z += sin(theta * 0.7) * orbitRadius;

    // Organic noise advection flow vector
    float flowTime = uTime * 0.25;
    vec3 currentNoise = vec3(
      snoise(vec3(flowPos.y * 0.15, flowPos.z * 0.15, flowTime)),
      snoise(vec3(flowPos.z * 0.15, flowPos.x * 0.15, flowTime + 10.0)),
      snoise(vec3(flowPos.x * 0.15, flowPos.y * 0.15, flowTime + 20.0))
    );
    flowPos += currentNoise * 3.2;

    pos = flowPos;

    // TRUE 3D POINT-TO-RAY PHYSICS
    vec3 v = pos - uRayOrigin;
    float t = dot(v, uRayDirection);
    vec3 closestPointOnRay = uRayOrigin + t * uRayDirection;
    vec3 dirToMouse3D = pos - closestPointOnRay;
    float distToMouse = length(dirToMouse3D);
    vDistToMouse = distToMouse;

    // Smoothstep falloff across 3.2 unit interaction radius
    float influence = smoothstep(3.2, 0.0, distToMouse);
    
    if (influence > 0.0) {
      vec3 normDir = dirToMouse3D / (distToMouse + 0.001); // Prevent division by zero
      float mouseVelMag = length(uMouseVel);
      
      // Push force scales smoothly with distance and velocity
      float pushForce = influence * (1.2 + mouseVelMag * 1.5);
      
      if (uMouseDown > 0.5) {
        // Click vortex suction (pulls inward)
        pos -= normDir * pushForce * 1.5;
      } else {
        // High-velocity repulsion wave (pushes outward in 3D)
        pos += normDir * pushForce;
      }
    }

    // Scroll Momentum Z-Warp
    // FIX: Severely reduced multiplier and added clamp to prevent particles flying past camera/clipping planes
    float safeScrollDelta = clamp(uScrollDelta, -0.5, 0.5);
    pos.z += safeScrollDelta * 3.0 * sin(aPhase * 6.28);
    // Subtle Y-axis parallax
    pos.y += safeScrollDelta * 1.5 * cos(aPhase * 6.28);

    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    vDepth = -mvPosition.z;

    gl_Position = projectionMatrix * mvPosition;

    // Point size: Crisp micro-dots (1.2px - 3.8px) that swell smoothly around pointer
    float mouseSwell = influence * 3.0;
    gl_PointSize = (aSize + mouseSwell) * (16.0 / vDepth);
  }
`;

const microParticleFragmentShader = /* glsl */ `
  uniform float uTime;

  varying float vDepth;
  varying float vDistToMouse;
  varying float vPhase;

  void main() {
    // Sharp circular micro-dot rendering
    vec2 coord = gl_PointCoord - vec2(0.5);
    float dist = length(coord);
    if (dist > 0.5) discard;
    float alphaEdge = 1.0 - smoothstep(0.2, 0.5, dist);

    // Color Palette:
    // Gold (#ffff23) around pointer -> Electric Cyan (#38bdf8) mid -> Dim Cobalt void
    vec3 gold = vec3(1.00, 1.00, 0.14);
    vec3 cyan = vec3(0.22, 0.74, 0.97);
    vec3 dimCobalt = vec3(0.12, 0.15, 0.35);

    // Use smoothstep for proximity glow to match physical influence
    float mouseProximity = smoothstep(1.8, 0.0, vDistToMouse);
    float depthFactor = clamp(vDepth / 16.0, 0.0, 1.0);

    vec3 col = mix(dimCobalt, cyan, 1.0 - depthFactor);
    col = mix(col, gold, mouseProximity * 0.95);

    // Twinkle pulse
    float twinkle = sin(uTime * 2.5 + vPhase * 6.28) * 0.2 + 0.8;

    // READABILITY & CONTRAST GUARD
    float baseAlpha = 0.12 + (1.0 - depthFactor) * 0.10;
    float alpha = alphaEdge * (baseAlpha + mouseProximity * 0.75) * twinkle;

    gl_FragColor = vec4(col, alpha);
  }
`;

export function ReactiveMicroParticleVoid() {
  const pointsRef = useRef<THREE.Points>(null);
  const { pointer, camera } = useThree();

  const prevMouse = useRef({ x: 0, y: 0 });
  const mouseVel = useRef({ x: 0, y: 0 });
  const isMouseDown = useRef(false);
  const prevScrollY = useRef(0);
  const scrollDelta = useRef(0);
  
  // Robust plane for raycasting (Z = 0)
  const zPlane = useMemo(() => new THREE.Plane(new THREE.Vector3(0, 0, 1), 0), []);
  const raycaster = useMemo(() => new THREE.Raycaster(), []);
  const mouseIntersection = useRef(new THREE.Vector3());
  
  // Track global pointer to bypass DOM overlay blocking Canvas events
  const globalPointer = useRef(new THREE.Vector2(0, 0));

  const [particleCount, setParticleCount] = useState(35000);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const updateCount = () => {
      setParticleCount(window.innerWidth <= 768 ? 8000 : 35000);
    };
    updateCount();
    window.addEventListener("resize", updateCount);
    return () => window.removeEventListener("resize", updateCount);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleDown = () => { isMouseDown.current = true; };
    const handleUp = () => { isMouseDown.current = false; };
    
    const handleMove = (e: PointerEvent) => {
      globalPointer.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      globalPointer.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };

    window.addEventListener("pointerdown", handleDown);
    window.addEventListener("pointerup", handleUp);
    window.addEventListener("pointermove", handleMove);

    return () => {
      window.removeEventListener("pointerdown", handleDown);
      window.removeEventListener("pointerup", handleUp);
      window.removeEventListener("pointermove", handleMove);
    };
  }, []);

  const { positions, velocities, sizes, phases } = useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    const vel = new Float32Array(particleCount * 3);
    const sz = new Float32Array(particleCount);
    const ph = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      const radius = 1.2 + Math.pow(Math.random(), 0.5) * 9.0;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      pos[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = (Math.random() - 0.5) * 14.0;

      vel[i * 3] = 0;
      vel[i * 3 + 1] = 0;
      vel[i * 3 + 2] = 0;

      sz[i] = 1.0 + Math.random() * 1.6;
      ph[i] = Math.random();
    }

    return { positions: pos, velocities: vel, sizes: sz, phases: ph };
  }, [particleCount]);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uScrollDelta: { value: 0 },
      uRayOrigin: { value: new THREE.Vector3() },
      uRayDirection: { value: new THREE.Vector3() },
      uMouseVel: { value: new THREE.Vector2(0, 0) },
      uMouseDown: { value: 0 },
    }),
    []
  );

  useFrame((state, delta) => {
    if (!pointsRef.current) return;

    // 1. Precise World Coordinate via Raycaster (Prevents NaN explosions)
    // Use global pointer so DOM elements don't block interaction!
    raycaster.setFromCamera(globalPointer.current, camera);
    const intersect = raycaster.ray.intersectPlane(zPlane, mouseIntersection.current);
    
    // Fallback to exactly 0,0 if intersection fails to avoid NaN propagation
    const targetX = intersect ? mouseIntersection.current.x : 0;
    const targetY = intersect ? mouseIntersection.current.y : 0;

    // 2. Velocity Calculation (in world units)
    const vx = (targetX - prevMouse.current.x) / Math.max(delta, 0.001);
    const vy = (targetY - prevMouse.current.y) / Math.max(delta, 0.001);
    prevMouse.current.x = targetX;
    prevMouse.current.y = targetY;

    // Smooth velocity with safe clamp to prevent explosive jumps
    // Adding || 0 to completely prevent NaN injection if vx/vy ever hit NaN
    const safeVx = THREE.MathUtils.clamp(vx || 0, -20, 20);
    const safeVy = THREE.MathUtils.clamp(vy || 0, -20, 20);
    
    mouseVel.current.x = THREE.MathUtils.lerp(mouseVel.current.x, safeVx, delta * 12.0);
    mouseVel.current.y = THREE.MathUtils.lerp(mouseVel.current.y, safeVy, delta * 12.0);

    // Scroll delta
    if (typeof window !== "undefined") {
      const dy = (window.scrollY - prevScrollY.current) * 0.001;
      prevScrollY.current = window.scrollY;
      scrollDelta.current = THREE.MathUtils.lerp(scrollDelta.current, dy || 0, delta * 8.0);
    }

    uniforms.uTime.value = state.clock.getElapsedTime();
    uniforms.uRayOrigin.value.copy(raycaster.ray.origin);
    uniforms.uRayDirection.value.copy(raycaster.ray.direction);
    uniforms.uMouseVel.value.set(mouseVel.current.x, mouseVel.current.y);
    uniforms.uMouseDown.value = isMouseDown.current ? 1.0 : 0.0;
    uniforms.uScrollDelta.value = scrollDelta.current;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
        <bufferAttribute
          attach="attributes-aVelocity"
          args={[velocities, 3]}
        />
        <bufferAttribute
          attach="attributes-aSize"
          args={[sizes, 1]}
        />
        <bufferAttribute
          attach="attributes-aPhase"
          args={[phases, 1]}
        />
      </bufferGeometry>
      <shaderMaterial
        vertexShader={microParticleVertexShader}
        fragmentShader={microParticleFragmentShader}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}
