"use client";

import React, { useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

export function CameraPath() {
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

    // Pointer velocity & spring inertia
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

    // Continuous 3D spatial camera spline path calculated from normalized scrollProgress
    const targetX = pointer.x * 0.4 + mouseVel.current.x * 0.03;
    const targetY =
      -scrollProgress * 2.5 + pointer.y * 0.3 + mouseVel.current.y * 0.03;
    const targetZ = 7.5 - scrollProgress * 12.0;

    // Smooth spring damping interpolation
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

    // Continuous target vector lookAt tracking
    const lookTargetY = -scrollProgress * 2.5 - 0.2;
    camera.lookAt(0, lookTargetY, targetZ - 6.0);
  });

  return null;
}
