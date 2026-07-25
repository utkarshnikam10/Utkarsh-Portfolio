"use client";

import React, { useRef, useMemo, useEffect } from "react";
import { useFrame, useThree, createPortal } from "@react-three/fiber";
import { useFBO } from "@react-three/drei";
import * as THREE from "three";

/**
 * Non-Euclidean Stencil Portal
 *
 * Uses dual FBO render targets to render two distinct 3D scenes simultaneously:
 * - Inner Portal View: Cybernetic Tron Grid with neon vector lines
 * - Outer View: Dark volumetric fog void
 *
 * When the camera crosses the portal plane (Z_camera < Z_portal),
 * executes a seamless scene swap with zero camera position jumps.
 */

function TronGridScene({ visible }: { visible: boolean }) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!visible) return;
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.getElapsedTime() * 0.1;
    }
  });

  const gridLines = useMemo(() => {
    const lines: Array<{ start: THREE.Vector3; end: THREE.Vector3 }> = [];
    const gridSize = 20;
    const spacing = 1.0;

    for (let i = -gridSize; i <= gridSize; i++) {
      // Horizontal lines
      lines.push({
        start: new THREE.Vector3(-gridSize * spacing, 0, i * spacing),
        end: new THREE.Vector3(gridSize * spacing, 0, i * spacing),
      });
      // Vertical lines
      lines.push({
        start: new THREE.Vector3(i * spacing, 0, -gridSize * spacing),
        end: new THREE.Vector3(i * spacing, 0, gridSize * spacing),
      });
    }

    return lines;
  }, []);

  return (
    <group ref={groupRef}>
      {/* Neon vector grid floor */}
      {gridLines.map((line, i) => {
        const points = [line.start, line.end];
        const geometry = new THREE.BufferGeometry().setFromPoints(points);
        return (
          <lineSegments key={i} geometry={geometry}>
            <lineBasicMaterial
              color={i % 2 === 0 ? "#00ffff" : "#ff00ff"}
              transparent
              opacity={0.4}
            />
          </lineSegments>
        );
      })}

      {/* Central neon tower */}
      <mesh position={[0, 2, 0]}>
        <boxGeometry args={[0.3, 4, 0.3]} />
        <meshStandardMaterial
          color="#00ffff"
          emissive="#00ffff"
          emissiveIntensity={2.0}
        />
      </mesh>

      {/* Ambient glow */}
      <pointLight position={[0, 5, 0]} intensity={3} color="#00ffff" distance={30} />
      <ambientLight intensity={0.05} color="#0a0a20" />
    </group>
  );
}

interface NonEuclideanPortalProps {
  position?: [number, number, number];
  portalZ?: number;
  visible?: boolean;
}

export function NonEuclideanPortal({
  position = [0, 0, -8],
  portalZ = -8,
  visible = true,
}: NonEuclideanPortalProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const { camera, gl, scene: mainScene } = useThree();

  // Dual FBO render targets for the two worlds
  const innerFBO = useFBO(1024, 1024);
  const outerFBO = useFBO(1024, 1024);

  // Inner portal scene (Tron Grid)
  const innerScene = useMemo(() => {
    const s = new THREE.Scene();
    s.background = new THREE.Color("#050510");
    s.fog = new THREE.FogExp2("#050510", 0.04);
    return s;
  }, []);

  // Track which side the camera is on
  const cameraWasBehind = useRef(false);
  const swapped = useRef(false);

  // Inner scene camera clone
  const portalCamera = useMemo(() => {
    const cam = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
    return cam;
  }, []);

  useFrame((state) => {
    if (!visible) return;
    const camZ = camera.position.z;
    const isBehind = camZ < portalZ;

    // Detect crossing — seamless swap
    if (isBehind !== cameraWasBehind.current) {
      swapped.current = !swapped.current;
    }
    cameraWasBehind.current = isBehind;

    // Sync portal camera to main camera
    portalCamera.position.copy(camera.position);
    portalCamera.quaternion.copy(camera.quaternion);
    portalCamera.aspect = (state.viewport.width / state.viewport.height) || 1;
    portalCamera.updateProjectionMatrix();

    // Render inner Tron scene into FBO
    gl.setRenderTarget(innerFBO);
    gl.clear();
    gl.render(innerScene, portalCamera);
    gl.setRenderTarget(null);

    // Apply the correct texture to the portal quad
    if (meshRef.current) {
      const mat = meshRef.current.material as THREE.MeshBasicMaterial;
      mat.map = swapped.current ? outerFBO.texture : innerFBO.texture;
      mat.needsUpdate = true;

      // Slow rotation for visual presence
      meshRef.current.rotation.z = Math.sin(state.clock.getElapsedTime() * 0.3) * 0.05;
    }
  });

  // Cleanup FBOs on unmount
  useEffect(() => {
    return () => {
      innerFBO.dispose();
      outerFBO.dispose();
      innerScene.clear();
    };
  }, [innerFBO, outerFBO, innerScene]);

  return (
    <>
      {/* Tron Grid rendered into inner scene via R3F portal */}
      {createPortal(<TronGridScene visible={visible} />, innerScene)}

      {/* Portal Quad — displays the FBO texture */}
      <mesh ref={meshRef} position={position}>
        <planeGeometry args={[3.2, 4.0]} />
        <meshBasicMaterial
          transparent
          opacity={0.95}
          side={THREE.DoubleSide}
          toneMapped={false}
        />
      </mesh>

      {/* Portal rim glow */}
      <mesh position={position}>
        <torusGeometry args={[2.5, 0.06, 16, 64]} />
        <meshStandardMaterial
          color="#38bdf8"
          emissive="#38bdf8"
          emissiveIntensity={1.5}
          transparent
          opacity={0.6}
        />
      </mesh>

      {/* Subtle edge light for depth */}
      <pointLight
        position={[position[0], position[1], position[2] + 0.5]}
        intensity={2.0}
        color="#38bdf8"
        distance={5}
      />
    </>
  );
}
