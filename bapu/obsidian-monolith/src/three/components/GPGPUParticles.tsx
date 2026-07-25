"use client";

import React, { useRef, useMemo, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

// GLSL Simulation Shader: Calculates 3D Curl Noise vector fields, cursor repulsion force & particle life reset
const simVertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position, 1.0);
  }
`;

const simFragmentShader = `
  uniform sampler2D uCurrentPosition;
  uniform sampler2D uInitialPosition;
  uniform float uTime;
  uniform float uDelta;
  uniform vec3 uPointer;
  uniform vec2 uPointerVel;
  uniform float uClickShockwave;
  varying vec2 vUv;

  // GLSL Simplex Noise
  vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
  vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

  float snoise(vec3 v) {
    const vec2 C = vec2(1.0/6.0, 1.0/3.0);
    const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
    vec3 i  = floor(v + dot(v, C.yyy));
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
    vec4 j = p - 49.0 * floor(p * ns.z);
    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_);
    vec4 x = x_ *ns.x + ns.yyyy;
    vec4 y = y_ *ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);
    vec4 b0 = vec4(x.xy, y.xy);
    vec4 b1 = vec4(x.zw, y.zw);
    vec4 s0 = floor(b0)*2.0 + 1.0;
    vec4 s1 = floor(b1)*2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));
    vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
    vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;
    vec3 p0 = vec3(a0.xy, h.x);
    vec3 p1 = vec3(a0.zw, h.y);
    vec3 p2 = vec3(a1.xy, h.z);
    vec3 p3 = vec3(a1.zw, h.w);
    vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
    p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
    vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
    m = m * m;
    return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
  }

  vec3 curlNoise(vec3 p) {
    const float e = 0.08;
    float dx = snoise(p + vec3(e, 0.0, 0.0)) - snoise(p - vec3(e, 0.0, 0.0));
    float dy = snoise(p + vec3(0.0, e, 0.0)) - snoise(p - vec3(0.0, e, 0.0));
    float dz = snoise(p + vec3(0.0, 0.0, e)) - snoise(p - vec3(0.0, 0.0, e));

    float dx2 = snoise(p + vec3(0.0, e, 0.0) + vec3(17.1)) - snoise(p - vec3(0.0, e, 0.0) + vec3(17.1));
    float dy2 = snoise(p + vec3(0.0, 0.0, e) + vec3(17.1)) - snoise(p - vec3(0.0, 0.0, e) + vec3(17.1));
    float dz2 = snoise(p + vec3(e, 0.0, 0.0) + vec3(17.1)) - snoise(p - vec3(e, 0.0, 0.0) + vec3(17.1));

    return vec3(dy2 - dz, dz2 - dx, dx2 - dy);
  }

  void main() {
    vec4 posLife = texture2D(uCurrentPosition, vUv);
    vec3 pos = posLife.xyz;
    float life = posLife.w;

    vec3 initialPos = texture2D(uInitialPosition, vUv).xyz;

    life -= uDelta * 0.25;

    // Reset dead particles
    if (life <= 0.0) {
      pos = initialPos;
      life = 1.0 + fract(sin(vUv.x * 91.34 + uTime) * 473.12);
    }

    // 3D Curl Noise Field displacement
    vec3 curlVel = curlNoise(pos * 0.45 + vec3(uTime * 0.15)) * 0.65;

    // Mouse Pointer Repulsion Force
    vec3 distVec = pos - uPointer;
    float dist = length(distVec);
    vec3 repulsion = vec3(0.0);

    if (dist < 2.5 && dist > 0.001) {
      float force = (2.5 - dist) / 2.5;
      repulsion = (distVec / dist) * force * 2.2 + vec3(uPointerVel * force * 1.5, 0.0);
    }

    // Elastic Return Force to Base Position
    vec3 returnForce = (initialPos - pos) * 0.35;

    vec3 finalVel = (curlVel + repulsion + returnForce + vec3(0.0, uClickShockwave * 3.0, 0.0)) * uDelta;
    pos += finalVel;

    gl_FragColor = vec4(pos, life);
  }
`;

// Particle Render Shader: Sizing based on depth, velocity-based color shifting, and soft radial alpha
const renderVertexShader = `
  uniform sampler2D uPositionTexture;
  uniform float uSize;
  varying float vLife;
  varying vec3 vWorldPos;

  void main() {
    vec2 uvCoord = position.xy; // UV coordinate stored in geometry vertex
    vec4 posLife = texture2D(uPositionTexture, uvCoord);
    vec3 worldPos = posLife.xyz;
    vLife = posLife.w;
    vWorldPos = worldPos;

    vec4 mvPosition = modelViewMatrix * vec4(worldPos, 1.0);
    gl_Position = projectionMatrix * mvPosition;

    // Depth-based point sizing
    gl_PointSize = uSize * (300.0 / -mvPosition.z) * clamp(vLife, 0.2, 1.0);
  }
`;

const renderFragmentShader = `
  varying float vLife;
  varying vec3 vWorldPos;

  void main() {
    // Soft radial alpha attenuation
    float distToCenter = length(gl_PointCoord - vec2(0.5));
    if (distToCenter > 0.5) discard;
    float alpha = smoothstep(0.5, 0.0, distToCenter) * clamp(vLife, 0.0, 1.0) * 0.75;

    // Velocity & life based color shifting from deep obsidian to warm gold
    vec3 obsidianColor = vec3(0.04, 0.04, 0.05);
    vec3 goldColor = vec3(0.95, 0.90, 0.67);
    vec3 color = mix(obsidianColor, goldColor, pow(vLife, 0.7));

    gl_FragColor = vec4(color, alpha);
  }
`;

export function GPGPUParticles() {
  const { gl, pointer } = useThree();

  const prevPointer = useRef({ x: 0, y: 0 });
  const pointerVel = useRef(new THREE.Vector2());

  // Determine texture resolution dynamically (128 on mobile, 256 on desktop)
  const size = useMemo(() => {
    if (typeof window === "undefined") return 256;
    return (window.devicePixelRatio || 1) < 1.5 ? 128 : 256;
  }, []);

  const totalParticles = size * size;

  // Create Ping-Pong WebGL Render Targets
  const { targetA, targetB, simScene, simCamera, simMaterial, renderGeometry, renderMaterial } =
    useMemo(() => {
      const options: THREE.RenderTargetOptions = {
        minFilter: THREE.NearestFilter,
        magFilter: THREE.NearestFilter,
        format: THREE.RGBAFormat,
        type: THREE.FloatType,
      };

      const rTargetA = new THREE.WebGLRenderTarget(size, size, options);
      const rTargetB = new THREE.WebGLRenderTarget(size, size, options);

      // Create initial positions texture
      const data = new Float32Array(totalParticles * 4);
      for (let i = 0; i < totalParticles; i++) {
        data[i * 4] = (Math.random() - 0.5) * 14;
        data[i * 4 + 1] = (Math.random() - 0.5) * 14;
        data[i * 4 + 2] = (Math.random() - 0.5) * 8 - 1;
        data[i * 4 + 3] = Math.random(); // Initial life
      }

      const initialTexture = new THREE.DataTexture(
        data,
        size,
        size,
        THREE.RGBAFormat,
        THREE.FloatType
      );
      initialTexture.needsUpdate = true;

      // Fill both render targets initially
      gl.setRenderTarget(rTargetA);
      gl.clear();
      gl.setRenderTarget(rTargetB);
      gl.clear();
      gl.setRenderTarget(null);

      // Simulation scene setup
      const sScene = new THREE.Scene();
      const sCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

      const sMaterial = new THREE.ShaderMaterial({
        vertexShader: simVertexShader,
        fragmentShader: simFragmentShader,
        uniforms: {
          uCurrentPosition: { value: initialTexture },
          uInitialPosition: { value: initialTexture },
          uTime: { value: 0 },
          uDelta: { value: 0.016 },
          uPointer: { value: new THREE.Vector3() },
          uPointerVel: { value: new THREE.Vector2() },
          uClickShockwave: { value: 0 },
        },
      });

      const planeMesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), sMaterial);
      sScene.add(planeMesh);

      // Render geometry setup: Stores UV coordinates for particle point sampling
      const rGeom = new THREE.BufferGeometry();
      const uvs = new Float32Array(totalParticles * 2);

      for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
          const idx = (i * size + j) * 2;
          uvs[idx] = (j + 0.5) / size;
          uvs[idx + 1] = (i + 0.5) / size;
        }
      }

      rGeom.setAttribute("position", new THREE.BufferAttribute(uvs, 2));

      const rMat = new THREE.ShaderMaterial({
        vertexShader: renderVertexShader,
        fragmentShader: renderFragmentShader,
        uniforms: {
          uPositionTexture: { value: null },
          uSize: { value: 0.045 },
        },
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      });

      return {
        targetA: rTargetA,
        targetB: rTargetB,
        simScene: sScene,
        simCamera: sCamera,
        simMaterial: sMaterial,
        renderGeometry: rGeom,
        renderMaterial: rMat,
      };
    }, [gl, size, totalParticles]);

  const currentTarget = useRef(targetA);
  const nextTarget = useRef(targetB);

  // Simulation & render frame loop inside useFrame with strict frame-delta time independence
  useFrame((state, delta) => {
    const safeDelta = Math.min(delta, 0.033);

    // Mouse velocity calculation
    const dx = pointer.x - prevPointer.current.x;
    const dy = pointer.y - prevPointer.current.y;
    prevPointer.current.x = pointer.x;
    prevPointer.current.y = pointer.y;

    pointerVel.current.set(dx / safeDelta, dy / safeDelta);

    // Update Simulation Shader Uniforms
    simMaterial.uniforms.uCurrentPosition.value = currentTarget.current.texture;
    simMaterial.uniforms.uTime.value = state.clock.getElapsedTime();
    simMaterial.uniforms.uDelta.value = safeDelta;
    simMaterial.uniforms.uPointer.value.set(pointer.x * 7.0, pointer.y * 7.0, 0);
    simMaterial.uniforms.uPointerVel.value.copy(pointerVel.current);

    // Render Simulation Pass into nextTarget
    gl.setRenderTarget(nextTarget.current);
    gl.render(simScene, simCamera);
    gl.setRenderTarget(null);

    // Swap Ping-Pong targets
    const temp = currentTarget.current;
    currentTarget.current = nextTarget.current;
    nextTarget.current = temp;

    // Pass simulated position texture to particle render material
    renderMaterial.uniforms.uPositionTexture.value = currentTarget.current.texture;
  });

  useEffect(() => {
    return () => {
      targetA.dispose();
      targetB.dispose();
      simMaterial.dispose();
      renderMaterial.dispose();
      renderGeometry.dispose();
    };
  }, [targetA, targetB, simMaterial, renderMaterial, renderGeometry]);

  return <points geometry={renderGeometry} material={renderMaterial} />;
}
