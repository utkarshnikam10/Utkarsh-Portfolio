"use client";

import React, { useRef, useMemo } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

/**
 * MorphingSphere — Organic noise-displaced icosahedron with iridescent
 * fresnel coloring. Reacts to cursor position and breathes slowly.
 */

const morphVertexShader = /* glsl */ `
  uniform float uTime;
  uniform vec2 uMouse;
  
  varying vec3 vNormal;
  varying vec3 vViewDir;
  varying float vDisplacement;
  
  // Simplex helpers
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
    // Multi-frequency noise displacement
    float slow = snoise(normal * 1.5 + uTime * 0.2) * 0.35;
    float med  = snoise(normal * 3.0 - uTime * 0.3) * 0.15;
    float fast = snoise(normal * 6.0 + uTime * 0.5) * 0.05;
    
    // Breathing pulse
    float breath = sin(uTime * 0.8) * 0.08;
    
    // Mouse proximity boost
    float mouseProx = smoothstep(2.0, 0.0, length(uMouse));
    float mouseBoost = mouseProx * sin(uTime * 4.0) * 0.1;
    
    float displacement = slow + med + fast + breath + mouseBoost;
    vDisplacement = displacement;
    
    vec3 newPosition = position + normal * displacement;
    
    // Compute displaced normal (finite differences)
    float eps = 0.01;
    vec3 tangent = normalize(cross(normal, vec3(0.0, 1.0, 0.0)));
    if (length(tangent) < 0.001) tangent = normalize(cross(normal, vec3(1.0, 0.0, 0.0)));
    vec3 bitangent = normalize(cross(normal, tangent));
    
    vec3 neighbor1 = position + tangent * eps;
    vec3 neighbor2 = position + bitangent * eps;
    
    float d1 = snoise((normal + tangent * eps) * 1.5 + uTime * 0.2) * 0.35
             + snoise((normal + tangent * eps) * 3.0 - uTime * 0.3) * 0.15;
    float d2 = snoise((normal + bitangent * eps) * 1.5 + uTime * 0.2) * 0.35
             + snoise((normal + bitangent * eps) * 3.0 - uTime * 0.3) * 0.15;
    
    vec3 p1 = neighbor1 + normal * d1;
    vec3 p2 = neighbor2 + normal * d2;
    
    vNormal = normalize(cross(p1 - newPosition, p2 - newPosition));
    
    vec4 mvPosition = modelViewMatrix * vec4(newPosition, 1.0);
    vViewDir = normalize(-mvPosition.xyz);
    
    gl_Position = projectionMatrix * mvPosition;
  }
`;

const morphFragmentShader = /* glsl */ `
  uniform float uTime;
  
  varying vec3 vNormal;
  varying vec3 vViewDir;
  varying float vDisplacement;
  
  void main() {
    // Fresnel factor
    float fresnel = pow(1.0 - max(dot(vNormal, vViewDir), 0.0), 3.0);
    
    // Iridescent color shift based on view angle + displacement
    float hue = fresnel * 0.6 + vDisplacement * 2.0 + uTime * 0.05;
    
    // HSV to RGB (simplified)
    vec3 col;
    float h = fract(hue) * 6.0;
    float f = fract(h);
    float q = 1.0 - f;
    
    if (h < 1.0) col = vec3(1.0, f, 0.0);
    else if (h < 2.0) col = vec3(q, 1.0, 0.0);
    else if (h < 3.0) col = vec3(0.0, 1.0, f);
    else if (h < 4.0) col = vec3(0.0, q, 1.0);
    else if (h < 5.0) col = vec3(f, 0.0, 1.0);
    else col = vec3(1.0, 0.0, q);
    
    // Desaturate and shift toward cool tones
    vec3 coolTint = vec3(0.15, 0.3, 0.9);
    col = mix(col, coolTint, 0.55);
    
    // Rim glow
    float rim = fresnel * 0.8;
    vec3 rimColor = vec3(0.4, 0.8, 1.0);
    col += rimColor * rim;
    
    // Core brightness
    float core = smoothstep(0.4, 0.0, fresnel) * 0.15;
    col += vec3(core);
    
    // Overall opacity — translucent glass feel
    float alpha = 0.25 + fresnel * 0.6 + abs(vDisplacement) * 0.3;
    alpha = clamp(alpha, 0.0, 0.85);
    
    gl_FragColor = vec4(col, alpha);
  }
`;

interface MorphingSphereProps {
  visible: boolean;
}

export function MorphingSphere({ visible }: MorphingSphereProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const { pointer } = useThree();

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector2(0, 0) },
    }),
    []
  );

  useFrame((state, delta) => {
    if (!meshRef.current) return;

    uniforms.uTime.value = state.clock.getElapsedTime();
    uniforms.uMouse.value.set(pointer.x, pointer.y);

    // Slow rotation
    meshRef.current.rotation.y += delta * 0.08;
    meshRef.current.rotation.x += delta * 0.03;

    // Visibility scale
    const targetScale = visible ? 1.0 : 0.001;
    meshRef.current.scale.setScalar(
      THREE.MathUtils.lerp(meshRef.current.scale.x, targetScale, delta * 4.0)
    );
  });

  return (
    <mesh ref={meshRef} position={[0, 0, 0]}>
      <icosahedronGeometry args={[1.8, 64]} />
      <shaderMaterial
        vertexShader={morphVertexShader}
        fragmentShader={morphFragmentShader}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}
