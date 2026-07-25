import * as THREE from "three";
import { shaderMaterial } from "@react-three/drei";
import { extend } from "@react-three/fiber";

/**
 * Kerr Black Hole Gravitational Lensing Post-Processing Shader
 *
 * Distorts screen UV coordinates based on inverse-square distance
 * to the black hole singularity:
 *
 *   UV_distorted = UV + (dir / r²) * uStrength
 *
 * Includes accretion disk Doppler shift coloring:
 * - Blue-shifted particles moving toward camera
 * - Red-shifted particles moving away
 */
export const GravitationalLensingMaterial = shaderMaterial(
  {
    uTexture: null as THREE.Texture | null,
    uTime: 0,
    uResolution: new THREE.Vector2(1, 1),
    uSingularity: new THREE.Vector2(0.5, 0.5),
    uStrength: 0.15,
    uEventHorizonRadius: 0.08,
  },
  // Vertex Shader
  /* glsl */ `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  // Fragment Shader — Gravitational Lensing
  /* glsl */ `
    uniform sampler2D uTexture;
    uniform float uTime;
    uniform vec2 uResolution;
    uniform vec2 uSingularity;
    uniform float uStrength;
    uniform float uEventHorizonRadius;

    varying vec2 vUv;

    void main() {
      vec2 uv = vUv;
      vec2 aspect = vec2(uResolution.x / uResolution.y, 1.0);

      // Direction from fragment to singularity
      vec2 dir = (uSingularity - uv) * aspect;
      float r = length(dir);

      // Inverse-square gravitational lensing distortion
      // UV_distorted = UV + (dir / r²) * uStrength
      float r2 = max(r * r, 0.001);
      vec2 distortedUV = uv + (dir / r2) * uStrength * 0.01;

      // Clamp to prevent sampling outside texture
      distortedUV = clamp(distortedUV, 0.001, 0.999);

      vec4 sceneColor = texture2D(uTexture, distortedUV);

      // Event horizon — fade to black within the Schwarzschild radius
      float horizonMask = smoothstep(uEventHorizonRadius * 0.5, uEventHorizonRadius, r);
      sceneColor.rgb *= horizonMask;

      // Accretion disk ring — Doppler shift coloring
      float diskRadius = uEventHorizonRadius * 3.0;
      float diskWidth = uEventHorizonRadius * 1.5;
      float diskMask = smoothstep(diskRadius - diskWidth, diskRadius, r) *
                        (1.0 - smoothstep(diskRadius, diskRadius + diskWidth, r));

      if (diskMask > 0.01) {
        // Orbital angle for disk rotation
        float angle = atan(dir.y, dir.x) + uTime * 0.8;

        // Doppler shift: blue when approaching, red when receding
        float doppler = sin(angle);
        vec3 blueShift = vec3(0.3, 0.6, 1.0);
        vec3 redShift = vec3(1.0, 0.3, 0.1);
        vec3 diskColor = mix(redShift, blueShift, doppler * 0.5 + 0.5);

        // Intensity falloff with turbulent brightness variations
        float brightness = 0.8 + 0.3 * sin(angle * 6.0 + uTime * 2.0);
        diskColor *= brightness;

        sceneColor.rgb += diskColor * diskMask * 0.6;
      }

      // Photon sphere glow at the event horizon edge
      float photonRing = exp(-pow((r - uEventHorizonRadius * 1.2) * 30.0, 2.0));
      sceneColor.rgb += vec3(0.9, 0.7, 0.4) * photonRing * 0.4;

      gl_FragColor = sceneColor;
    }
  `
);

extend({ GravitationalLensingMaterial });

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace JSX {
    interface IntrinsicElements {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      gravitationalLensingMaterial: any;
    }
  }
}
