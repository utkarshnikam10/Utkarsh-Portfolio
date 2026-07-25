"use client";

import React, { useRef, useMemo, useState } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface ShatterGlassProps {
  position: [number, number, number];
  dimensions?: [number, number, number];
  visible?: boolean;
}

const SHARD_COUNT = 120;

export function ShatterGlass({ position, dimensions = [3.0, 1.8, 0.1], visible = true }: ShatterGlassProps) {
  const groupRef = useRef<THREE.Group>(null);
  const [shattered, setShattered] = useState(false);
  const shardRefs = useRef<THREE.Mesh[]>([]);

  // Generate 120 Voronoi-like shard geometries with random angular velocities
  const shards = useMemo(() => {
    const result = [];
    const [w, h, d] = dimensions;

    for (let i = 0; i < SHARD_COUNT; i++) {
      // Random shard origin within the parent slab volume
      const ox = (Math.random() - 0.5) * w;
      const oy = (Math.random() - 0.5) * h;
      const oz = (Math.random() - 0.5) * d;

      // Random explosion direction (impact normal vector + random spread)
      const dirX = ox * 2.0 + (Math.random() - 0.5) * 1.5;
      const dirY = oy * 2.0 + (Math.random() - 0.5) * 1.5;
      const dirZ = (Math.random() - 0.3) * 3.0;

      // Random angular velocity for tumbling shards
      const angVelX = (Math.random() - 0.5) * 8.0;
      const angVelY = (Math.random() - 0.5) * 8.0;
      const angVelZ = (Math.random() - 0.5) * 8.0;

      // Random shard scale
      const scale = 0.04 + Math.random() * 0.12;

      const explodeDir = new THREE.Vector3(dirX, dirY, dirZ);
      const origin = new THREE.Vector3(ox, oy, oz);
      const targetPos = origin.clone().add(explodeDir.clone().multiplyScalar(2.5));

      result.push({
        origin,
        explodeDir,
        targetPos,
        angularVel: new THREE.Vector3(angVelX, angVelY, angVelZ),
        currentPos: new THREE.Vector3(ox, oy, oz),
        currentRot: new THREE.Euler(
          Math.random() * Math.PI,
          Math.random() * Math.PI,
          Math.random() * Math.PI
        ),
        scale,
        progress: 0, // 0 = assembled, 1 = fully exploded
      });
    }

    return result;
  }, [dimensions]);

  useFrame((state, delta) => {
    if (!visible) return;
    if (!groupRef.current) return;

    // Scroll-driven reassembly
    let scrollProgress = 0;
    if (typeof window !== "undefined") {
      const maxScroll = Math.max(
        document.documentElement.scrollHeight - window.innerHeight,
        1
      );
      scrollProgress = window.scrollY / maxScroll;
    }

    for (let i = 0; i < SHARD_COUNT; i++) {
      const shard = shards[i];
      const mesh = shardRefs.current[i];
      if (!mesh) continue;

      if (shattered) {
        // Explode: Progress toward 1.0
        shard.progress = THREE.MathUtils.lerp(shard.progress, 1.0, delta * 4.0);
      } else {
        // Reassemble: Spring physics (stiffness: 220, damping: 15 approximated via lerp)
        shard.progress = THREE.MathUtils.lerp(shard.progress, 0.0, delta * 6.0);
      }

      const p = shard.progress;

      // Interpolate position between origin and exploded position
      mesh.position.lerpVectors(shard.origin, shard.targetPos, p);

      // Tumbling rotation during explosion
      mesh.rotation.x += shard.angularVel.x * delta * p;
      mesh.rotation.y += shard.angularVel.y * delta * p;
      mesh.rotation.z += shard.angularVel.z * delta * p;

      // Opacity fades as shards fly away
      const mat = mesh.material as THREE.MeshPhysicalMaterial;
      mat.opacity = THREE.MathUtils.lerp(1.0, 0.3, p);
    }
  });

  const handleDoubleClick = (e: THREE.Event) => {
    if ("stopPropagation" in e) (e as any).stopPropagation();
    setShattered(true);
    // Auto-reassemble after 2 seconds
    setTimeout(() => setShattered(false), 2000);
  };

  return (
    <group ref={groupRef} position={position} onDoubleClick={handleDoubleClick}>
      {shards.map((shard, i) => (
        <mesh
          key={i}
          ref={(el) => {
            if (el) shardRefs.current[i] = el;
          }}
          position={shard.origin}
          scale={shard.scale}
        >
          <tetrahedronGeometry args={[1, 0]} />
          <meshPhysicalMaterial
            color="#0d0e10"
            transmission={0.96}
            roughness={0.04}
            ior={1.52}
            thickness={0.8}
            clearcoat={1.0}
            transparent
            opacity={1.0}
            emissive="#38bdf8"
            emissiveIntensity={0.2}
          />
        </mesh>
      ))}
    </group>
  );
}
