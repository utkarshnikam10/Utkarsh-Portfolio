"use client";

import React, { useRef, useState, useMemo, useEffect } from "react";
import { useFrame, useThree, ThreeEvent } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import * as THREE from "three";
import { playHoverTone, playSelectSound } from "../../utils/audio";
import { useTheme } from "../../context/ThemeContext";

interface ObsidianSculptureProps {
  onHoverChange?: (hovered: boolean) => void;
  onPointerTargetUpdate?: (point: THREE.Vector3 | null) => void;
  highlightIndex?: number | null;
}

interface ShardData {
  id: number;
  initialPos: THREE.Vector3;
  direction: THREE.Vector3;
  rotAxis: THREE.Vector3;
  geometry: THREE.BufferGeometry;
}

export function ObsidianSculpture({
  onHoverChange,
  onPointerTargetUpdate,
  highlightIndex,
}: ObsidianSculptureProps) {
  const groupRef = useRef<THREE.Group>(null);
  const coreRef = useRef<THREE.Mesh>(null);
  const shardsGroupRef = useRef<THREE.Group>(null);

  const [hoveredShard, setHoveredShard] = useState<number | null>(null);
  const [clickedShard, setClickedShard] = useState<number | null>(null);
  const [reducedMotion, setReducedMotion] = useState(false);

  const { theme, themeConfig } = useTheme();
  const { pointer } = useThree();
  const scrollRef = useRef(0);
  const clickScaleRef = useRef(1.0);

  const uniformsRef = useRef({
    uTime: { value: 0 },
    uNoiseIntensity: { value: 0 },
    uFresnelColor: { value: new THREE.Color(themeConfig.accent) },
    uFresnelPower: { value: 3.0 },
  });

  // Update uniforms when theme changes
  useEffect(() => {
    uniformsRef.current.uFresnelColor.value.set(themeConfig.accent);
  }, [themeConfig.accent]);

  // Custom GLSL 3D Simplex Noise & Fresnel Edge Shader
  const handleBeforeCompile = (
    shader: THREE.WebGLProgramParametersWithUniforms
  ) => {
    shader.uniforms.uTime = uniformsRef.current.uTime;
    shader.uniforms.uNoiseIntensity = uniformsRef.current.uNoiseIntensity;
    shader.uniforms.uFresnelColor = uniformsRef.current.uFresnelColor;
    shader.uniforms.uFresnelPower = uniformsRef.current.uFresnelPower;

    shader.vertexShader = `
      uniform float uTime;
      uniform float uNoiseIntensity;

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
      float nDisplace = snoise(position * 1.5 + vec3(uTime * 0.8)) * uNoiseIntensity;
      transformed += normal * nDisplace;
      `
    );

    shader.fragmentShader = `
      uniform vec3 uFresnelColor;
      uniform float uFresnelPower;
      ${shader.fragmentShader}
    `;

    shader.fragmentShader = shader.fragmentShader.replace(
      `#include <dithering_fragment>`,
      `
      #include <dithering_fragment>
      vec3 normVec = normalize(vNormal);
      vec3 viewDirVec = normalize(vViewPosition);
      float fresnelVal = pow(1.0 - max(0.0, dot(normVec, viewDirVec)), uFresnelPower);
      gl_FragColor.rgb += uFresnelColor * fresnelVal * 0.95;
      `
    );
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
      setReducedMotion(mediaQuery.matches);

      const handleChange = (e: MediaQueryListEvent) =>
        setReducedMotion(e.matches);
      mediaQuery.addEventListener("change", handleChange);
      return () => mediaQuery.removeEventListener("change", handleChange);
    }
  }, []);

  const shards = useMemo<ShardData[]>(() => {
    const shardList: ShardData[] = [];
    const configs = [
      { pos: [0.35, 1.3, 0.25], dir: [0.65, 0.9, 0.5], rot: [0.5, 0.8, 0.2] },
      { pos: [-0.35, 1.3, -0.25], dir: [-0.65, 0.9, -0.5], rot: [-0.4, 0.7, -0.3] },
      { pos: [-0.5, 0.4, 0.35], dir: [-0.9, 0.3, 0.7], rot: [0.7, -0.5, 0.6] },
      { pos: [0.5, 0.4, -0.35], dir: [0.9, 0.3, -0.7], rot: [-0.6, 0.4, -0.5] },
      { pos: [0.55, -0.4, 0.3], dir: [0.8, -0.4, 0.6], rot: [0.3, 0.9, 0.4] },
      { pos: [-0.55, -0.4, -0.3], dir: [-0.8, -0.4, -0.6], rot: [-0.5, -0.7, 0.3] },
      { pos: [0.3, -1.3, 0.2], dir: [0.5, -0.9, 0.4], rot: [0.8, 0.3, -0.6] },
      { pos: [-0.3, -1.3, -0.2], dir: [-0.5, -0.9, -0.4], rot: [-0.7, 0.6, 0.5] },
    ];

    configs.forEach((cfg, idx) => {
      const geom = new THREE.CylinderGeometry(
        0.5 + Math.random() * 0.2,
        0.7 + Math.random() * 0.2,
        1.0 + Math.random() * 0.3,
        5 + Math.floor(Math.random() * 3),
        1
      );
      geom.computeVertexNormals();

      shardList.push({
        id: idx,
        initialPos: new THREE.Vector3(...cfg.pos),
        direction: new THREE.Vector3(...cfg.dir).normalize(),
        rotAxis: new THREE.Vector3(...cfg.rot).normalize(),
        geometry: geom,
      });
    });

    return shardList;
  }, []);

  const coreGeometry = useMemo(() => {
    const geom = new THREE.IcosahedronGeometry(0.85, 1);
    geom.computeVertexNormals();
    return geom;
  }, []);

  const handleShardClick = (e: ThreeEvent<MouseEvent>, shardId: number) => {
    e.stopPropagation();
    setClickedShard(shardId);
    clickScaleRef.current = 1.08;
    playSelectSound();
    setTimeout(() => setClickedShard(null), 300);
  };

  const handleShardOver = (e: ThreeEvent<PointerEvent>, shardId: number) => {
    e.stopPropagation();
    setHoveredShard(shardId);
    onHoverChange?.(true);
    playHoverTone();

    if (e.point) {
      onPointerTargetUpdate?.(e.point);
    }
  };

  const handleShardOut = () => {
    setHoveredShard(null);
    onHoverChange?.(false);
    onPointerTargetUpdate?.(null);
  };

  useFrame((state, delta) => {
    uniformsRef.current.uTime.value = state.clock.getElapsedTime();
    const targetNoise = hoveredShard !== null ? 0.08 : 0.015;
    uniformsRef.current.uNoiseIntensity.value = THREE.MathUtils.lerp(
      uniformsRef.current.uNoiseIntensity.value,
      targetNoise,
      delta * 4.0
    );

    if (typeof window !== "undefined") {
      const maxScroll = Math.max(
        document.documentElement.scrollHeight - window.innerHeight,
        1
      );
      const currentScroll = window.scrollY;
      const targetScroll = Math.min(Math.max(currentScroll / maxScroll, 0), 1);

      scrollRef.current = THREE.MathUtils.lerp(
        scrollRef.current,
        targetScroll,
        delta * (reducedMotion ? 10 : 3.5)
      );
    }

    const progress = scrollRef.current;

    clickScaleRef.current = THREE.MathUtils.lerp(
      clickScaleRef.current,
      1.0,
      delta * 8
    );

    if (groupRef.current) {
      groupRef.current.scale.setScalar(clickScaleRef.current);

      if (!reducedMotion) {
        const targetRotX = pointer.y * 0.35;
        let targetRotY = pointer.x * 0.45;

        if (highlightIndex !== null && highlightIndex !== undefined) {
          const projectRotationAngles = [0, Math.PI * 0.5, Math.PI, Math.PI * 1.5];
          targetRotY += projectRotationAngles[highlightIndex % 4];
        }

        groupRef.current.rotation.x = THREE.MathUtils.lerp(
          groupRef.current.rotation.x,
          targetRotX,
          delta * 3.5
        );

        const spinSpeed = 0.15 + progress * 0.95;
        groupRef.current.rotation.y += delta * spinSpeed;
        groupRef.current.rotation.y = THREE.MathUtils.lerp(
          groupRef.current.rotation.y,
          groupRef.current.rotation.y + targetRotY * 0.05,
          delta * 3.5
        );

        groupRef.current.rotation.z = THREE.MathUtils.lerp(
          groupRef.current.rotation.z,
          -pointer.x * 0.15,
          delta * 3.5
        );
      }
    }

    if (shardsGroupRef.current) {
      shardsGroupRef.current.children.forEach((child, idx) => {
        const shardData = shards[idx];
        if (!shardData) return;

        const isThisHovered = hoveredShard === idx;
        const isThisClicked = clickedShard === idx;

        let explosionDistance = progress * 2.8;
        if (isThisHovered) explosionDistance += 0.35;
        if (isThisClicked) explosionDistance += 0.5;

        const targetX =
          shardData.initialPos.x + shardData.direction.x * explosionDistance;
        const targetY =
          shardData.initialPos.y + shardData.direction.y * explosionDistance;
        const targetZ =
          shardData.initialPos.z + shardData.direction.z * explosionDistance;

        child.position.x = THREE.MathUtils.lerp(
          child.position.x,
          targetX,
          delta * 5.0
        );
        child.position.y = THREE.MathUtils.lerp(
          child.position.y,
          targetY,
          delta * 5.0
        );
        child.position.z = THREE.MathUtils.lerp(
          child.position.z,
          targetZ,
          delta * 5.0
        );

        if (!reducedMotion) {
          child.rotation.x += delta * shardData.rotAxis.x * progress * 1.5;
          child.rotation.y += delta * shardData.rotAxis.y * progress * 1.5;
          child.rotation.z += delta * shardData.rotAxis.z * progress * 1.5;
        }

        const mesh = child as THREE.Mesh;
        if (mesh.material && mesh.material instanceof THREE.MeshPhysicalMaterial) {
          const targetEmissive = isThisHovered
            ? 0.95
            : progress * 0.85;

          mesh.material.emissiveIntensity = THREE.MathUtils.lerp(
            mesh.material.emissiveIntensity,
            targetEmissive,
            delta * 6.0
          );
        }
      });
    }

    if (coreRef.current) {
      if (!reducedMotion) {
        coreRef.current.rotation.y -= delta * (0.3 + progress * 1.2);
        coreRef.current.rotation.x += delta * (0.2 + progress * 0.8);
      }
      const scale = 1.0 + progress * 0.4;
      coreRef.current.scale.set(scale, scale, scale);

      if (
        coreRef.current.material &&
        coreRef.current.material instanceof THREE.MeshStandardMaterial
      ) {
        coreRef.current.material.emissiveIntensity = THREE.MathUtils.lerp(
          coreRef.current.material.emissiveIntensity,
          progress * 2.2,
          delta * 4.0
        );
      }
    }
  });

  return (
    <Float
      speed={reducedMotion ? 0 : 1.5}
      rotationIntensity={reducedMotion ? 0 : 0.4}
      floatIntensity={reducedMotion ? 0 : 0.6}
      floatingRange={[-0.15, 0.15]}
    >
      <group ref={groupRef}>
        {/* Inner glowing fracture core */}
        <mesh ref={coreRef} geometry={coreGeometry}>
          <meshStandardMaterial
            color="#121216"
            emissive={themeConfig.accent}
            emissiveIntensity={0.1}
            roughness={0.2}
            metalness={0.9}
            wireframe={theme === "BRUTALIST" || theme === "TACTICAL_CAD"}
          />
        </mesh>

        {/* Dynamic Theme-reactive Obsidian Shards */}
        <group ref={shardsGroupRef}>
          {shards.map((shard) => (
            <mesh
              key={shard.id}
              geometry={shard.geometry}
              position={shard.initialPos}
              onPointerOver={(e) => handleShardOver(e, shard.id)}
              onPointerOut={handleShardOut}
              onClick={(e) => handleShardClick(e, shard.id)}
              castShadow
              receiveShadow
            >
              <meshPhysicalMaterial
                color={themeConfig.bg}
                transmission={theme === "EDITORIAL" ? 0.96 : 0.4}
                roughness={theme === "EDITORIAL" ? 0.04 : 0.08}
                ior={1.52}
                thickness={1.4}
                clearcoat={1.0}
                clearcoatRoughness={0.02}
                metalness={theme === "TACTICAL_CAD" ? 0.95 : 0.1}
                dispersion={0.04}
                reflectivity={1.0}
                wireframe={theme === "BRUTALIST"}
                flatShading={true}
                emissive={themeConfig.accent}
                emissiveIntensity={theme === "BRUTALIST" ? 0.15 : 0.0}
                onBeforeCompile={handleBeforeCompile}
              />
            </mesh>
          ))}
        </group>
      </group>
    </Float>
  );
}
