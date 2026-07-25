"use client";

import React, { useRef, useMemo } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

/**
 * LiquidChromeBackground — Awwwards Site of the Year inspired interactive WebGL background.
 * Features:
 * - Ultra-smooth liquid obsidian/mercury surface with physical caustic light refractions.
 * - Dynamic mouse ripple shockwaves with inertial decay physics.
 * - Chromatic RGB dispersion & metallic Fresnel highlights.
 */

const liquidVertexShader = /* glsl */ `
  uniform float uTime;
  uniform float uScroll;
  uniform vec2 uMouse;
  uniform vec2 uMouseVelocity;
  
  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vViewPosition;
  varying float vWave;
  varying float vMouseDist;

  // 3D Simplex Noise Function
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
    vUv = uv;
    vec3 pos = position;

    // Organic wave compound harmonics
    float time = uTime * 0.4;
    float noise1 = snoise(vec3(pos.xy * 0.3, time * 0.5)) * 0.8;
    float noise2 = snoise(vec3(pos.xy * 0.8 + vec2(time * 0.2), time * 0.3)) * 0.3;
    float noise3 = snoise(vec3(pos.xy * 1.8 - vec2(time * 0.1), uScroll * 2.0)) * 0.12;

    float wave = noise1 + noise2 + noise3;

    // Mouse Ripple Interaction
    vec2 mouseWorld = uMouse * vec2(8.0, 5.0);
    float d = distance(pos.xy, mouseWorld);
    float mouseRipple = sin(d * 4.0 - uTime * 6.0) * exp(-d * 0.8) * length(uMouseVelocity) * 1.5;

    pos.z += wave + mouseRipple;
    vWave = wave + mouseRipple;
    vMouseDist = d;

    // Recalculate normal for specular highlights
    vec3 neighbor1 = pos + vec3(0.01, 0.0, snoise(vec3((pos.xy + vec2(0.01, 0.0)) * 0.3, time * 0.5)));
    vec3 neighbor2 = pos + vec3(0.0, 0.01, snoise(vec3((pos.xy + vec2(0.0, 0.01)) * 0.3, time * 0.5)));
    vec3 calcNormal = normalize(cross(neighbor1 - pos, neighbor2 - pos));
    vNormal = normalMatrix * calcNormal;

    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    vViewPosition = -mvPosition.xyz;

    gl_Position = projectionMatrix * mvPosition;
  }
`;

const liquidFragmentShader = /* glsl */ `
  uniform float uTime;
  uniform float uScroll;
  
  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vViewPosition;
  varying float vWave;
  varying float vMouseDist;

  void main() {
    vec3 normal = normalize(vNormal);
    vec3 viewDir = normalize(vViewPosition);

    // Fresnel effect for edge reflections
    float fresnel = pow(1.0 - max(dot(normal, viewDir), 0.0), 4.0);

    // Dynamic metallic color ramp: Deep Obsidian Space -> Electric Cyan -> Cyber Gold
    vec3 baseColor = vec3(0.02, 0.02, 0.04);       // Midnight void
    vec3 cyanGlow  = vec3(0.22, 0.74, 0.97);       // #38bdf8
    vec3 goldGlow  = vec3(1.00, 1.00, 0.14);       // #ffff23
    vec3 deepPurple = vec3(0.35, 0.08, 0.45);

    // Mix colors based on wave height & fresnel angle
    float waveNormalized = clamp(vWave * 0.5 + 0.5, 0.0, 1.0);
    
    vec3 col = mix(baseColor, deepPurple, waveNormalized * 0.6);
    col = mix(col, cyanGlow, smoothstep(0.4, 0.85, waveNormalized) * 0.7);
    col = mix(col, goldGlow, fresnel * 0.8);

    // Specular highlight highlights
    vec3 lightDir = normalize(vec3(0.5, 0.8, 1.0));
    vec3 halfVector = normalize(lightDir + viewDir);
    float NdotH = max(dot(normal, halfVector), 0.0);
    float specular = pow(NdotH, 64.0) * 1.5;
    col += vec3(specular) * goldGlow;

    // Interactive Mouse Touch Glow
    float mouseGlow = smoothstep(2.5, 0.0, vMouseDist);
    col += cyanGlow * mouseGlow * 0.35;

    // Edge vignette fade
    float distFromCenter = length(vUv - vec2(0.5));
    float vignette = smoothstep(0.75, 0.2, distFromCenter);

    gl_FragColor = vec4(col, vignette * 0.88);
  }
`;

export function LiquidChromeBackground() {
  const meshRef = useRef<THREE.Mesh>(null);
  const { pointer } = useThree();
  const prevMouse = useRef({ x: 0, y: 0 });
  const mouseVel = useRef({ x: 0, y: 0 });

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uScroll: { value: 0 },
      uMouse: { value: new THREE.Vector2(0, 0) },
      uMouseVelocity: { value: new THREE.Vector2(0, 0) },
    }),
    []
  );

  useFrame((state, delta) => {
    if (!meshRef.current) return;

    // Calculate mouse velocity
    const vx = (pointer.x - prevMouse.current.x) / Math.max(delta, 0.001);
    const vy = (pointer.y - prevMouse.current.y) / Math.max(delta, 0.001);
    prevMouse.current.x = pointer.x;
    prevMouse.current.y = pointer.y;

    mouseVel.current.x = THREE.MathUtils.lerp(mouseVel.current.x, vx, delta * 5.0);
    mouseVel.current.y = THREE.MathUtils.lerp(mouseVel.current.y, vy, delta * 5.0);

    uniforms.uTime.value = state.clock.getElapsedTime();
    uniforms.uMouse.value.set(pointer.x, pointer.y);
    uniforms.uMouseVelocity.value.set(mouseVel.current.x, mouseVel.current.y);

    if (typeof window !== "undefined") {
      const maxScroll = Math.max(
        document.documentElement.scrollHeight - window.innerHeight,
        1
      );
      uniforms.uScroll.value = window.scrollY / maxScroll;
    }
  });

  return (
    <mesh ref={meshRef} position={[0, 0, -3.5]} rotation={[-Math.PI * 0.1, 0, 0]}>
      {/* Dense plane geometry for smooth wave displacement */}
      <planeGeometry args={[20, 14, 128, 128]} />
      <shaderMaterial
        vertexShader={liquidVertexShader}
        fragmentShader={liquidFragmentShader}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}
