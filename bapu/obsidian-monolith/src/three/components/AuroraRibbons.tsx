"use client";

import React, { useRef, useMemo } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

/**
 * AuroraRibbons — Flowing, ethereal aurora borealis ribbons using custom
 * GLSL vertex displacement and gradient fragment coloring. Creates a mesmerizing
 * organic flow that responds to scroll position and cursor.
 */

const ribbonVertexShader = /* glsl */ `
  uniform float uTime;
  uniform float uScroll;
  uniform vec2 uMouse;
  
  varying vec2 vUv;
  varying float vElevation;
  varying float vDistortion;
  
  //
  // 3D Simplex Noise (simplified)
  //
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
    
    // Multi-octave noise displacement
    float noise1 = snoise(vec3(pos.x * 0.3 + uTime * 0.15, pos.y * 0.5, uTime * 0.1)) * 1.8;
    float noise2 = snoise(vec3(pos.x * 0.8 - uTime * 0.08, pos.y * 1.2 + uTime * 0.12, uScroll * 0.5)) * 0.6;
    float noise3 = snoise(vec3(pos.x * 2.0 + uTime * 0.25, pos.y * 0.3, pos.z + uTime * 0.1)) * 0.3;
    
    float totalNoise = noise1 + noise2 + noise3;
    
    // Mouse influence — gentle attraction
    float mouseInfluence = smoothstep(3.0, 0.0, length(vec2(pos.x - uMouse.x * 4.0, pos.y - uMouse.y * 3.0)));
    totalNoise += mouseInfluence * sin(uTime * 3.0) * 0.5;
    
    pos.z += totalNoise;
    pos.y += sin(pos.x * 0.3 + uTime * 0.2) * 0.4;
    
    vElevation = totalNoise;
    vDistortion = mouseInfluence;
    
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`;

const ribbonFragmentShader = /* glsl */ `
  uniform float uTime;
  uniform float uScroll;
  
  varying vec2 vUv;
  varying float vElevation;
  varying float vDistortion;
  
  void main() {
    // Aurora color palette — deep blues, teals, magentas, gold
    vec3 color1 = vec3(0.05, 0.12, 0.35);  // Deep navy
    vec3 color2 = vec3(0.1, 0.6, 0.85);    // Cyan
    vec3 color3 = vec3(0.6, 0.2, 0.8);     // Purple
    vec3 color4 = vec3(1.0, 1.0, 0.14);    // Gold/Yellow
    
    // Mix colors based on elevation and UV
    float t = vElevation * 0.5 + 0.5;
    vec3 color = mix(color1, color2, smoothstep(0.0, 0.35, t));
    color = mix(color, color3, smoothstep(0.35, 0.65, t));
    color = mix(color, color4, smoothstep(0.7, 1.0, t) * 0.4);
    
    // Edge fade for ribbon transparency
    float edgeFade = smoothstep(0.0, 0.15, vUv.y) * smoothstep(1.0, 0.85, vUv.y);
    
    // Horizontal fade
    float hFade = smoothstep(0.0, 0.1, vUv.x) * smoothstep(1.0, 0.9, vUv.x);
    
    // Brightness pulse based on distortion
    float brightness = 0.15 + vDistortion * 0.4;
    
    // Subtle shimmer
    brightness += sin(vUv.x * 40.0 + uTime * 2.0) * 0.02;
    
    float alpha = edgeFade * hFade * brightness;
    
    gl_FragColor = vec4(color, alpha);
  }
`;

export function AuroraRibbons() {
  const meshRef = useRef<THREE.Mesh>(null);
  const { pointer } = useThree();

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uScroll: { value: 0 },
      uMouse: { value: new THREE.Vector2(0, 0) },
    }),
    []
  );

  useFrame((state) => {
    uniforms.uTime.value = state.clock.getElapsedTime();
    uniforms.uMouse.value.set(pointer.x, pointer.y);

    if (typeof window !== "undefined") {
      const maxScroll = Math.max(
        document.documentElement.scrollHeight - window.innerHeight,
        1
      );
      uniforms.uScroll.value = window.scrollY / maxScroll;
    }
  });

  return (
    <group>
      {/* Multiple ribbon layers at different depths and rotations */}
      {[
        { pos: [0, 0, -4] as [number, number, number], rotZ: 0.1, scale: 1.0 },
        { pos: [2, 1, -6] as [number, number, number], rotZ: -0.15, scale: 0.8 },
        { pos: [-3, -1, -8] as [number, number, number], rotZ: 0.2, scale: 1.2 },
      ].map((ribbon, i) => (
        <mesh
          key={i}
          ref={i === 0 ? meshRef : undefined}
          position={ribbon.pos}
          rotation={[0, 0, ribbon.rotZ]}
          scale={ribbon.scale}
        >
          <planeGeometry args={[16, 3, 128, 32]} />
          <shaderMaterial
            vertexShader={ribbonVertexShader}
            fragmentShader={ribbonFragmentShader}
            uniforms={uniforms}
            transparent
            depthWrite={false}
            side={THREE.DoubleSide}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      ))}
    </group>
  );
}
