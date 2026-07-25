"use client";

import React, { useRef, useMemo } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import * as THREE from "three";

interface LiquidMeshChapterProps {
  visible: boolean;
}

export function LiquidMeshChapter({ visible }: LiquidMeshChapterProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const { pointer } = useThree();

  const prevPointer = useRef({ x: 0, y: 0 });
  const mouseVel = useRef(0);

  const uniformsRef = useRef({
    uTime: { value: 0 },
    uPointer: { value: new THREE.Vector2() },
    uVelocity: { value: 0 },
    uFresnelColor: { value: new THREE.Color("#f3e5ab") },
  });

  const geometry = useMemo(() => {
    const geom = new THREE.IcosahedronGeometry(2.1, 32);
    geom.computeVertexNormals();
    return geom;
  }, []);

  const handleBeforeCompile = (
    shader: THREE.WebGLProgramParametersWithUniforms
  ) => {
    shader.uniforms.uTime = uniformsRef.current.uTime;
    shader.uniforms.uPointer = uniformsRef.current.uPointer;
    shader.uniforms.uVelocity = uniformsRef.current.uVelocity;
    shader.uniforms.uFresnelColor = uniformsRef.current.uFresnelColor;

    shader.vertexShader = `
      uniform float uTime;
      uniform vec2 uPointer;
      uniform float uVelocity;

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

      ${shader.vertexShader}
    `;

    shader.vertexShader = shader.vertexShader.replace(
      `#include <begin_vertex>`,
      `
      #include <begin_vertex>
      float wave = snoise(position * 1.2 + vec3(uTime * 0.7));
      float distToPointer = length(uPointer - position.xy);
      float mouseRipple = sin(distToPointer * 6.0 - uTime * 4.0) * exp(-distToPointer * 1.2);
      float velocityBoost = uVelocity * 0.15;
      transformed += normal * (wave * 0.22 + mouseRipple * (0.08 + velocityBoost));
      `
    );

    shader.fragmentShader = `
      uniform vec3 uFresnelColor;
      ${shader.fragmentShader}
    `;

    shader.fragmentShader = shader.fragmentShader.replace(
      `#include <dithering_fragment>`,
      `
      #include <dithering_fragment>
      vec3 normVec = normalize(vNormal);
      vec3 viewDirVec = normalize(vViewPosition);
      float fresnelVal = pow(1.0 - max(0.0, dot(normVec, viewDirVec)), 3.0);
      gl_FragColor.rgb += uFresnelColor * fresnelVal * 0.95;
      `
    );
  };

  useFrame((state, delta) => {
    // Mouse velocity calculation
    const dx = pointer.x - prevPointer.current.x;
    const dy = pointer.y - prevPointer.current.y;
    prevPointer.current.x = pointer.x;
    prevPointer.current.y = pointer.y;

    const speed = Math.hypot(dx, dy) / Math.max(delta, 0.001);
    mouseVel.current = THREE.MathUtils.lerp(mouseVel.current, speed, delta * 8.0);

    uniformsRef.current.uTime.value = state.clock.getElapsedTime();
    uniformsRef.current.uPointer.value.set(pointer.x * 2.5, pointer.y * 2.5);
    uniformsRef.current.uVelocity.value = mouseVel.current;

    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.25;
      meshRef.current.rotation.x = THREE.MathUtils.lerp(
        meshRef.current.rotation.x,
        pointer.y * 0.45,
        delta * 3.5
      );

      const targetScale = visible ? 1.0 : 0.0;
      meshRef.current.scale.setScalar(
        THREE.MathUtils.lerp(meshRef.current.scale.x, targetScale, delta * 5.0)
      );
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={0.8}>
      <mesh ref={meshRef} geometry={geometry}>
        <meshPhysicalMaterial
          color="#0a0a0c"
          roughness={0.04}
          metalness={0.88}
          transmission={0.95}
          thickness={1.8}
          ior={1.52}
          clearcoat={1.0}
          clearcoatRoughness={0.05}
          reflectivity={1.0}
          onBeforeCompile={handleBeforeCompile}
        />
      </mesh>
    </Float>
  );
}
