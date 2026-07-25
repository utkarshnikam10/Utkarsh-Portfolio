"use client";

import React, { useRef, useMemo } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { RaymarchedMetaballMaterial } from "../shaders/RaymarchedMetaballs";

export function MetaballVolume() {
  const meshRef = useRef<THREE.Mesh>(null);
  const { pointer, viewport } = useThree();

  const material = useMemo(() => {
    const mat = new RaymarchedMetaballMaterial();
    mat.transparent = true;
    mat.depthWrite = false;
    mat.side = THREE.DoubleSide;
    return mat;
  }, []);

  useFrame((state) => {
    material.uTime = state.clock.getElapsedTime();
    material.uResolution = new THREE.Vector2(viewport.width, viewport.height);
    material.uSphere1 = new THREE.Vector3(0.0, 0.0, 0.0);
    material.uSphere2 = new THREE.Vector3(
      pointer.x * 1.2,
      pointer.y * 0.8,
      0.0
    );
  });

  return (
    <mesh ref={meshRef} position={[0, 0, 0]} material={material}>
      <planeGeometry args={[4, 4]} />
    </mesh>
  );
}
