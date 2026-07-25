/* eslint-disable */
"use client";

import { useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

export interface MousePhysicsState {
  velocity: THREE.Vector2;
  speed: number;
}

export function useMousePhysics(): MousePhysicsState {
  const { pointer } = useThree();

  const prevPointer = useRef(new THREE.Vector2(0, 0));
  const velocity = useRef(new THREE.Vector2(0, 0));
  const speed = useRef(0);

  useFrame((_, delta) => {
    const dx = pointer.x - prevPointer.current.x;
    const dy = pointer.y - prevPointer.current.y;

    prevPointer.current.set(pointer.x, pointer.y);

    const safeDelta = Math.max(delta, 0.001);
    const targetVelX = dx / safeDelta;
    const targetVelY = dy / safeDelta;

    velocity.current.x = THREE.MathUtils.lerp(
      velocity.current.x,
      targetVelX,
      0.05
    );
    velocity.current.y = THREE.MathUtils.lerp(
      velocity.current.y,
      targetVelY,
      0.05
    );

    speed.current = velocity.current.length();
  });

  return {
    velocity: velocity.current,
    speed: speed.current,
  };
}
