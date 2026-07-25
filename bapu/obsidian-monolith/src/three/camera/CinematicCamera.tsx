"use client";

import React, { useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

export function CinematicCamera() {
  const { camera, pointer } = useThree();
  const mouseVel = useRef({ x: 0, y: 0 });
  const prevPointer = useRef({ x: 0, y: 0 });

  useFrame((_, delta) => {
    let scrollProgress = 0;
    if (typeof window !== "undefined") {
      const maxScroll = Math.max(
        document.documentElement.scrollHeight - window.innerHeight,
        1
      );
      scrollProgress = Math.min(Math.max(window.scrollY / maxScroll, 0), 1);
    }

    const dx = pointer.x - prevPointer.current.x;
    const dy = pointer.y - prevPointer.current.y;
    prevPointer.current.x = pointer.x;
    prevPointer.current.y = pointer.y;

    const safeDelta = Math.max(delta, 0.001);
    mouseVel.current.x = THREE.MathUtils.lerp(
      mouseVel.current.x,
      dx / safeDelta,
      delta * 6.0
    );
    mouseVel.current.y = THREE.MathUtils.lerp(
      mouseVel.current.y,
      dy / safeDelta,
      delta * 6.0
    );

    // Continuous 3D bezier camera spline path through 4 Chambers
    const targetX = pointer.x * 0.45 + mouseVel.current.x * 0.03;
    const targetY =
      -scrollProgress * 3.0 + pointer.y * 0.35 + mouseVel.current.y * 0.03;
    const targetZ = 7.5 - scrollProgress * 14.0;

    camera.position.x = THREE.MathUtils.lerp(
      camera.position.x,
      targetX,
      delta * 3.5
    );
    camera.position.y = THREE.MathUtils.lerp(
      camera.position.y,
      targetY,
      delta * 3.5
    );
    camera.position.z = THREE.MathUtils.lerp(
      camera.position.z,
      targetZ,
      delta * 3.5
    );

    const lookTargetY = -scrollProgress * 3.0 - 0.2;
    camera.lookAt(0, lookTargetY, targetZ - 6.0);
  });

  return null;
}
