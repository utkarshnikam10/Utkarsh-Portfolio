"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import gsap from "gsap";
import { useEffect, useMemo, useRef } from "react";
import type { MutableRefObject } from "react";
import { MathUtils, Vector3 } from "three";

import { CHAPTERS, HOME_CAMERA, chapterById } from "@/constants/chapters";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { Landmark } from "@/three/components/Landmark";
import { WorldGround } from "@/three/components/WorldGround";
import type { ChapterId } from "@/types/world";

interface WorldSceneProps {
  activeId: ChapterId | null;
  onSelect: (id: ChapterId) => void;
  scrollProgress: MutableRefObject<number>;
  visited: readonly ChapterId[];
}

const SCROLL_COMPOSITIONS = [
  HOME_CAMERA,
  { position: [-3.9, 3.5, 7.2], target: [-2.2, 1.05, -0.2] },
  { position: [1.2, 4.1, 7.5], target: [1.1, 0.95, 0.5] },
  { position: [5.55, 3.2, 2.35], target: [3.1, 1.05, -1.6] },
  { position: [1.8, 4.25, -6.5], target: [0.25, 1.05, -3.3] },
] as const;

function getScrollComposition(progress: number) {
  const scaled = Math.min(Math.max(progress, 0), 1) * (SCROLL_COMPOSITIONS.length - 1);
  const index = Math.min(Math.floor(scaled), SCROLL_COMPOSITIONS.length - 2);
  const fraction = scaled - index;
  const start = SCROLL_COMPOSITIONS[index];
  const end = SCROLL_COMPOSITIONS[index + 1];

  return {
    position: [
      MathUtils.lerp(start.position[0], end.position[0], fraction),
      MathUtils.lerp(start.position[1], end.position[1], fraction),
      MathUtils.lerp(start.position[2], end.position[2], fraction),
    ] as const,
    target: [
      MathUtils.lerp(start.target[0], end.target[0], fraction),
      MathUtils.lerp(start.target[1], end.target[1], fraction),
      MathUtils.lerp(start.target[2], end.target[2], fraction),
    ] as const,
  };
}

function CameraDirector({
  activeId,
  scrollProgress,
}: Pick<WorldSceneProps, "activeId" | "scrollProgress">) {
  const { camera } = useThree();
  const cameraRef = useRef(camera);
  const prefersReducedMotion = usePrefersReducedMotion();
  const lookAt = useRef(new Vector3(...HOME_CAMERA.target));
  const basePosition = useRef(new Vector3(...HOME_CAMERA.position));
  const scrollPosition = useRef(new Vector3(...HOME_CAMERA.position));
  const scrollLookAt = useRef(new Vector3(...HOME_CAMERA.target));
  const destination = useMemo(
    () => (activeId ? chapterById(activeId)?.camera : HOME_CAMERA),
    [activeId]
  );

  useEffect(() => {
    if (!destination) return;
    const sceneCamera = cameraRef.current;

    const state = {
      cameraX: sceneCamera.position.x,
      cameraY: sceneCamera.position.y,
      cameraZ: sceneCamera.position.z,
      lookX: lookAt.current.x,
      lookY: lookAt.current.y,
      lookZ: lookAt.current.z,
    };

    const tween = gsap.to(state, {
      cameraX: destination.position[0],
      cameraY: destination.position[1],
      cameraZ: destination.position[2],
      lookX: destination.target[0],
      lookY: destination.target[1],
      lookZ: destination.target[2],
      duration: prefersReducedMotion ? 0.18 : activeId ? 1.35 : 1.12,
      ease: activeId ? "power3.out" : "power2.inOut",
      onUpdate: () => {
        basePosition.current.set(state.cameraX, state.cameraY, state.cameraZ);
        lookAt.current.set(state.lookX, state.lookY, state.lookZ);
      },
    });

    return () => {
      tween.kill();
    };
  }, [activeId, destination, prefersReducedMotion]);

  useFrame(({ pointer }, delta) => {
    const parallaxAmount = activeId ? 0.12 : 0.32;
    const sceneCamera = cameraRef.current;
    if (!activeId) {
      const composition = getScrollComposition(scrollProgress.current);
      scrollPosition.current.set(...composition.position);
      scrollLookAt.current.set(...composition.target);
    }

    const position = activeId ? basePosition.current : scrollPosition.current;
    const target = activeId ? lookAt.current : scrollLookAt.current;
    sceneCamera.position.x = MathUtils.damp(
      sceneCamera.position.x,
      position.x + pointer.x * parallaxAmount,
      4,
      delta
    );
    sceneCamera.position.y = MathUtils.damp(
      sceneCamera.position.y,
      position.y + pointer.y * parallaxAmount * 0.45,
      4,
      delta
    );
    sceneCamera.position.z = MathUtils.damp(sceneCamera.position.z, position.z, 4, delta);
    sceneCamera.lookAt(target.x + pointer.x * 0.07, target.y + pointer.y * 0.04, target.z);
  });
  return null;
}

function Scene({ activeId, onSelect, scrollProgress, visited }: WorldSceneProps) {
  return (
    <>
      <color attach="background" args={["#17201e"]} />
      <fog attach="fog" args={["#17201e", 11, 24]} />
      <hemisphereLight args={["#d9e8d4", "#131817", 1.6]} />
      <directionalLight
        castShadow
        intensity={2.35}
        position={[-5, 9, 4]}
        shadow-mapSize={[1024, 1024]}
      />
      <pointLight color="#f6b47a" intensity={10} distance={7} position={[-1.2, 4.5, 1.5]} />
      <pointLight color="#9bc4ff" intensity={6} distance={5} position={[4, 2, -3]} />

      <WorldGround />
      {CHAPTERS.map((chapter) => (
        <Landmark
          chapter={chapter}
          isActive={chapter.id === activeId}
          isVisited={visited.includes(chapter.id)}
          key={chapter.id}
          onSelect={onSelect}
        />
      ))}
      <CameraDirector activeId={activeId} scrollProgress={scrollProgress} />
    </>
  );
}

export default function WorldScene(props: WorldSceneProps) {
  return (
    <Canvas
      camera={{
        fov: 34,
        near: 0.1,
        far: 100,
        position: [...HOME_CAMERA.position] as [number, number, number],
      }}
      dpr={[1, 1.75]}
      fallback={<div className="world-canvas-fallback" aria-hidden="true" />}
      gl={{ antialias: true, alpha: false, powerPreference: "high-performance" }}
      shadows
    >
      <Scene {...props} />
    </Canvas>
  );
}
