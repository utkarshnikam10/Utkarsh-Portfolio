import * as THREE from "three";
import { shaderMaterial } from "@react-three/drei";
import { extend } from "@react-three/fiber";

export const SnellGlassShaderMaterial = shaderMaterial(
  {
    uTime: 0,
    uIor: 1.52,
    uDispersion: 0.04,
    uFresnelPower: 5.0,
    uColor: new THREE.Color("#0d0e10"),
    uEmissive: new THREE.Color("#38bdf8"),
    uEmissiveIntensity: 0.1,
  },
  // Vertex Shader
  /* glsl */ `
    varying vec3 vNormal;
    varying vec3 vWorldPosition;
    varying vec3 vViewVector;

    void main() {
      vNormal = normalize(normalMatrix * normal);
      vec4 worldPosition = modelMatrix * vec4(position, 1.0);
      vWorldPosition = worldPosition.xyz;
      vViewVector = normalize(cameraPosition - worldPosition.xyz);
      gl_Position = projectionMatrix * viewMatrix * worldPosition;
    }
  `,
  // Fragment Shader
  /* glsl */ `
    uniform float uTime;
    uniform float uIor;
    uniform float uDispersion;
    uniform float uFresnelPower;
    uniform vec3 uColor;
    uniform vec3 uEmissive;
    uniform float uEmissiveIntensity;

    varying vec3 vNormal;
    varying vec3 vWorldPosition;
    varying vec3 vViewVector;

    void main() {
      vec3 normal = normalize(vNormal);
      vec3 viewDir = normalize(vViewVector);

      // Fresnel reflection equation: F = F0 + (1.0 - F0) * (1.0 - cosTheta)^5
      float cosTheta = max(dot(normal, viewDir), 0.0);
      float F0 = 0.04;
      float fresnel = F0 + (1.0 - F0) * pow(1.0 - cosTheta, uFresnelPower);

      // Snell Refraction RGB Chromatic Edge Splitting
      vec3 refractR = refract(-viewDir, normal, 1.0 / (uIor - uDispersion));
      vec3 refractG = refract(-viewDir, normal, 1.0 / uIor);
      vec3 refractB = refract(-viewDir, normal, 1.0 / (uIor + uDispersion));

      vec3 edgeColor = vec3(
        abs(refractR.x),
        abs(refractG.y),
        abs(refractB.z)
      ) * uDispersion * 8.0;

      vec3 baseColor = uColor + uEmissive * uEmissiveIntensity;
      vec3 finalColor = mix(baseColor + edgeColor, vec3(1.0), fresnel * 0.7);

      gl_FragColor = vec4(finalColor, 0.95);
    }
  `
);

extend({ SnellGlassShaderMaterial });

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace JSX {
    interface IntrinsicElements {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      snellGlassShaderMaterial: any;
    }
  }
}
