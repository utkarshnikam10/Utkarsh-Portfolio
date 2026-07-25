/* eslint-disable */
"use client";

import { useRef, useEffect, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { audioSynth } from "../../utils/AudioSynth";

export interface GravityWellState {
  isMouseDown: boolean;
  gravityForce: THREE.Vector3;
  distortionStrength: number;
}

export function useGravityWell(): GravityWellState {
  const { pointer } = useThree();
  const [isMouseDown, setIsMouseDown] = useState(false);

  const gravityForce = useRef(new THREE.Vector3());
  const distortionStrength = useRef(0);
  const prevPointer = useRef(new THREE.Vector2());

  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleMouseDown = () => {
      setIsMouseDown(true);
      audioSynth.playGravitationalPulse(true);
    };

    const handleMouseUp = () => {
      setIsMouseDown(false);
      audioSynth.playGravitationalPulse(false);
    };

    window.addEventListener("pointerdown", handleMouseDown);
    window.addEventListener("pointerup", handleMouseUp);

    return () => {
      window.removeEventListener("pointerdown", handleMouseDown);
      window.removeEventListener("pointerup", handleMouseUp);
    };
  }, []);

  const tempForce = useRef(new THREE.Vector3());

  useFrame((_, delta) => {
    const dx = pointer.x - prevPointer.current.x;
    const dy = pointer.y - prevPointer.current.y;
    prevPointer.current.set(pointer.x, pointer.y);

    const speed = Math.hypot(dx, dy) / Math.max(delta, 0.001);
    audioSynth.updateVelocity(speed, 1.0);

    const targetDistortion = isMouseDown ? 0.15 : Math.min(speed * 0.02, 0.08);
    distortionStrength.current = THREE.MathUtils.lerp(
      distortionStrength.current,
      targetDistortion,
      delta * 6.0
    );

    if (isMouseDown) {
      tempForce.current.set(pointer.x * 4.0, pointer.y * 3.0, 0);
      gravityForce.current.lerp(tempForce.current, delta * 8.0);
    } else {
      tempForce.current.set(0, 0, 0);
      gravityForce.current.lerp(tempForce.current, delta * 5.0);
    }
  });

  return {
    isMouseDown,
    gravityForce: gravityForce.current,
    distortionStrength: distortionStrength.current,
  };
}
