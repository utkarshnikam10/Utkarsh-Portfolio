/* eslint-disable */
"use client";

import { useRef, useState, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

export interface BulletTimeState {
  timeScale: number;
  distortion: number;
  aberration: number;
  isSlomo: boolean;
}

const VELOCITY_THRESHOLD = 3.5;
const SLOMO_TIME_SCALE = 0.08;
const RECOVERY_DURATION = 1.2; // seconds

export function useBulletTime(): BulletTimeState {
  const { pointer } = useThree();

  const prevPointer = useRef(new THREE.Vector2());
  const timeScale = useRef(1.0);
  const distortion = useRef(0.0);
  const aberration = useRef(0.0);
  const isSlomo = useRef(false);
  const recoveryTimer = useRef(0);

  useFrame((_, delta) => {
    const dx = pointer.x - prevPointer.current.x;
    const dy = pointer.y - prevPointer.current.y;
    prevPointer.current.set(pointer.x, pointer.y);

    const safeDelta = Math.max(delta, 0.001);
    const velocity = Math.hypot(dx, dy) / safeDelta;

    if (velocity > VELOCITY_THRESHOLD && !isSlomo.current) {
      // Trigger bullet-time
      isSlomo.current = true;
      recoveryTimer.current = 0;
    }

    if (isSlomo.current) {
      recoveryTimer.current += delta;

      if (recoveryTimer.current < RECOVERY_DURATION) {
        // Ramp to slomo then spring recover
        const recoveryProgress = recoveryTimer.current / RECOVERY_DURATION;
        const easedRecovery = 1 - Math.pow(1 - recoveryProgress, 3); // cubic ease-out

        const targetTimeScale = THREE.MathUtils.lerp(SLOMO_TIME_SCALE, 1.0, easedRecovery);
        timeScale.current = THREE.MathUtils.lerp(timeScale.current, targetTimeScale, delta * 8.0);

        const targetDistortion = THREE.MathUtils.lerp(0.25, 0.0, easedRecovery);
        distortion.current = THREE.MathUtils.lerp(distortion.current, targetDistortion, delta * 6.0);

        const targetAberration = THREE.MathUtils.lerp(0.12, 0.0, easedRecovery);
        aberration.current = THREE.MathUtils.lerp(aberration.current, targetAberration, delta * 6.0);
      } else {
        // Recovery complete
        isSlomo.current = false;
        timeScale.current = THREE.MathUtils.lerp(timeScale.current, 1.0, delta * 10.0);
        distortion.current = THREE.MathUtils.lerp(distortion.current, 0.0, delta * 10.0);
        aberration.current = THREE.MathUtils.lerp(aberration.current, 0.0, delta * 10.0);
      }
    } else {
      timeScale.current = THREE.MathUtils.lerp(timeScale.current, 1.0, delta * 5.0);
      distortion.current = THREE.MathUtils.lerp(distortion.current, 0.0, delta * 5.0);
      aberration.current = THREE.MathUtils.lerp(aberration.current, 0.0, delta * 5.0);
    }
  });

  return {
    timeScale: timeScale.current,
    distortion: distortion.current,
    aberration: aberration.current,
    isSlomo: isSlomo.current,
  };
}
