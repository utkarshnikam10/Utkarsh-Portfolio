"use client";

import { useEffect, useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { EventBus } from "@/core/EventBus";

/**
 * PROJECT NEXUS // ENVIRONMENT FOUNDATION
 * Responsibility: Establishes the base environmental context for the 3D scene.
 * Implements:
 *   - Soft morning golden sky gradient
 *   - Gentle warm sunset/sunrise fog
 *   - Slow moving ambient dust particles (motes)
 *   - Volumetric light rays (god rays) projecting from key light
 *   - Slow moving cloud shadow mesh layer
 */

/** Fog configuration constants (Warm golden morning dawn) */
const FOG_COLOR = "#12101a";
const FOG_NEAR = 35;
const FOG_FAR = 180;

/** Sky gradient colors (zenith to horizon - dawn sky) */
const SKY_ZENITH = "#080b18";
const SKY_HORIZON = "#f7be8f";

export function Environment() {
  const fogAppliedRef = useRef(false);
  const dustRef = useRef<THREE.Points>(null);
  const cloudRef = useRef<THREE.Mesh>(null);
  const shaftsRef = useRef<THREE.Group>(null);

  // Initialize 250 random dust motes
  const particleCount = 250;
  const positions = useMemo(() => {
    const arr = new Float32Array(particleCount * 3);
    let seed = 1;
    for (let i = 0; i < particleCount; i++) {
      const rx = Math.sin(seed++) * 10000;
      const ry = Math.sin(seed++) * 10000;
      const rz = Math.sin(seed++) * 10000;

      arr[i * 3] = (rx - Math.floor(rx) - 0.5) * 35; // X
      arr[i * 3 + 1] = (ry - Math.floor(ry)) * 8; // Y
      arr[i * 3 + 2] = (rz - Math.floor(rz) - 0.5) * 35; // Z
    }
    return arr;
  }, []);

  /**
   * Apply scene-level fog and background on the first frame using
   * the rootState pattern to satisfy React hooks immutability rules.
   */
  useFrame((rootState, delta) => {
    if (!fogAppliedRef.current) {
      fogAppliedRef.current = true;
      const scene = rootState.scene;
      scene.fog = new THREE.Fog(FOG_COLOR, FOG_NEAR, FOG_FAR);
      scene.background = new THREE.Color(FOG_COLOR);
    }

    const elapsed = rootState.clock.getElapsedTime();

    // 1. Slow moving dust particles (drift upward and sway horizontally)
    if (dustRef.current) {
      const geo = dustRef.current.geometry;
      const posAttr = geo.getAttribute("position") as THREE.BufferAttribute;
      const count = posAttr.count;

      for (let i = 0; i < count; i++) {
        let x = posAttr.getX(i);
        let y = posAttr.getY(i);
        let z = posAttr.getZ(i);

        // Drift upward
        y += delta * 0.18;
        // Sway gently in wind (sinusoidal offset)
        x += Math.sin(elapsed * 0.5 + i) * 0.005;
        z += Math.cos(elapsed * 0.4 + i) * 0.004;

        // Wrap around bounds
        if (y > 8.0) {
          y = 0.0;
          x = (Math.random() - 0.5) * 35;
          z = (Math.random() - 0.5) * 35;
        }

        posAttr.setXYZ(i, x, y, z);
      }
      posAttr.needsUpdate = true;
    }

    // 2. Slow moving cloud shadows (large high-altitude mesh drifts slowly)
    if (cloudRef.current) {
      cloudRef.current.position.x = Math.sin(elapsed * 0.05) * 15;
      cloudRef.current.position.z = elapsed * 0.3; // continuous drift
    }

    // 3. Volumetric light shafts breathing gently (shimmering)
    if (shaftsRef.current) {
      shaftsRef.current.children.forEach((shaft, index) => {
        const mat = (shaft as THREE.Mesh).material as THREE.MeshBasicMaterial;
        mat.opacity = 0.02 + Math.sin(elapsed * 0.8 + index) * 0.008;
      });
    }
  });

  /**
   * Emit environment ready event and cleanup fog on unmount.
   */
  useEffect(() => {
    EventBus.emit("environment:ready");

    return () => {
      fogAppliedRef.current = false;
    };
  }, []);

  return (
    <group name="environment-foundation">
      {/* 1. Sky Dome — procedural gradient sphere */}
      <mesh name="sky-dome" scale={[-500, 500, 500]}>
        <sphereGeometry args={[1, 32, 32]} />
        <shaderMaterial
          side={THREE.BackSide}
          depthWrite={false}
          uniforms={{
            uZenithColor: { value: new THREE.Color(SKY_ZENITH) },
            uHorizonColor: { value: new THREE.Color(SKY_HORIZON) },
          }}
          vertexShader={`
            varying vec3 vWorldPosition;
            void main() {
              vec4 worldPos = modelMatrix * vec4(position, 1.0);
              vWorldPosition = worldPos.xyz;
              gl_Position = projectionMatrix * viewMatrix * worldPos;
            }
          `}
          fragmentShader={`
            uniform vec3 uZenithColor;
            uniform vec3 uHorizonColor;
            varying vec3 vWorldPosition;
            void main() {
              float h = normalize(vWorldPosition).y;
              float t = clamp(h * 0.5 + 0.5, 0.0, 1.0);
              vec3 color = mix(uHorizonColor, uZenithColor, t);
              gl_FragColor = vec4(color, 1.0);
            }
          `}
        />
      </mesh>

      {/* 2. Procedural Volumetric Light Shafts (pointing downwards from light source direction) */}
      <group name="volumetric-light-shafts" ref={shaftsRef} position={[0, 12, 0]}>
        {[
          { pos: [-4, 0, -2], radius: 1.4, length: 18 },
          { pos: [5, 2, -6], radius: 2.0, length: 22 },
          { pos: [0, -1, 3], radius: 1.6, length: 16 },
        ].map((shaft, i) => (
          <mesh
            key={i}
            position={shaft.pos as [number, number, number]}
            rotation={[Math.PI / 6, 0, -Math.PI / 8]} // angled along directional light vector
          >
            <cylinderGeometry
              args={[shaft.radius * 0.5, shaft.radius, shaft.length, 16, 1, true]}
            />
            <meshBasicMaterial
              color="#fcdc9a"
              transparent
              opacity={0.03}
              blending={THREE.AdditiveBlending}
              side={THREE.DoubleSide}
              depthWrite={false}
            />
          </mesh>
        ))}
      </group>

      {/* 3. Slow Moving Cloud Shadow Layer (High above) */}
      <mesh
        ref={cloudRef}
        name="cloud-shadow-plane"
        position={[0, 80, 0]}
        rotation={[Math.PI / 2, 0, 0]}
      >
        <planeGeometry args={[150, 150]} />
        <meshBasicMaterial
          color="#06060c"
          transparent
          opacity={0.12} // subtle light absorption
          depthWrite={false}
        />
      </mesh>

      {/* 4. Slow Moving Dust Motes */}
      <points ref={dustRef} name="dust-motes">
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        </bufferGeometry>
        <pointsMaterial
          size={0.05}
          color="#ffd685"
          transparent
          opacity={0.4}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>

      {/* 5. Ground Plane — receives shadows */}
      <mesh
        name="ground-plane"
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -0.01, 0]}
        receiveShadow
      >
        <planeGeometry args={[200, 200]} />
        <shadowMaterial opacity={0.18} />
      </mesh>
    </group>
  );
}

export default Environment;
