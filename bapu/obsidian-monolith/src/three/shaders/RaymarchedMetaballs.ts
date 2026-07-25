import * as THREE from "three";
import { shaderMaterial } from "@react-three/drei";
import { extend } from "@react-three/fiber";

/**
 * Raymarched SDF Metaball Volume Material
 *
 * Renders two smooth-blended glass spheres using the smooth minimum operator:
 *   d(p) = -(1/k) * ln( exp(-k * d1) + exp(-k * d2) )
 *
 * Sphere centers are bound to mouse drag coordinates so users can pull
 * liquid glass blobs apart and let them merge back.
 */
export const RaymarchedMetaballMaterial = shaderMaterial(
  {
    uTime: 0,
    uResolution: new THREE.Vector2(1, 1),
    uSphere1: new THREE.Vector3(0.0, 0.0, 0.0),
    uSphere2: new THREE.Vector3(0.5, 0.0, 0.0),
    uSmoothK: 4.0,
    uIor: 1.52,
  },
  // Vertex Shader
  /* glsl */ `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  // Fragment Shader - Raymarched SDF Metaballs
  /* glsl */ `
    uniform float uTime;
    uniform vec2 uResolution;
    uniform vec3 uSphere1;
    uniform vec3 uSphere2;
    uniform float uSmoothK;
    uniform float uIor;

    varying vec2 vUv;

    float sdSphere(vec3 p, vec3 center, float r) {
      return length(p - center) - r;
    }

    // Smooth minimum: d(p) = -(1/k) * ln( exp(-k*d1) + exp(-k*d2) )
    float smin(float a, float b, float k) {
      return -(1.0 / k) * log(exp(-k * a) + exp(-k * b));
    }

    float sceneSDF(vec3 p) {
      float d1 = sdSphere(p, uSphere1, 0.5);
      float d2 = sdSphere(p, uSphere2, 0.4);
      return smin(d1, d2, uSmoothK);
    }

    vec3 calcNormal(vec3 p) {
      float e = 0.001;
      return normalize(vec3(
        sceneSDF(vec3(p.x + e, p.y, p.z)) - sceneSDF(vec3(p.x - e, p.y, p.z)),
        sceneSDF(vec3(p.x, p.y + e, p.z)) - sceneSDF(vec3(p.x, p.y - e, p.z)),
        sceneSDF(vec3(p.x, p.y, p.z + e)) - sceneSDF(vec3(p.x, p.y, p.z - e))
      ));
    }

    void main() {
      vec2 uv = vUv * 2.0 - 1.0;
      uv.x *= uResolution.x / uResolution.y;

      vec3 ro = vec3(0.0, 0.0, 2.5);
      vec3 rd = normalize(vec3(uv, -1.5));

      float t = 0.0;
      float d = 0.0;

      for (int i = 0; i < 64; i++) {
        vec3 p = ro + rd * t;
        d = sceneSDF(p);
        if (d < 0.001) break;
        t += d;
        if (t > 10.0) break;
      }

      if (d < 0.001) {
        vec3 p = ro + rd * t;
        vec3 n = calcNormal(p);
        vec3 viewDir = normalize(ro - p);

        // Fresnel: F = F0 + (1 - F0)(1 - cosTheta)^5
        float cosTheta = max(dot(n, viewDir), 0.0);
        float F0 = 0.04;
        float fresnel = F0 + (1.0 - F0) * pow(1.0 - cosTheta, 5.0);

        // Snell refraction with chromatic split
        vec3 refractR = refract(-viewDir, n, 1.0 / (uIor - 0.04));
        vec3 refractG = refract(-viewDir, n, 1.0 / uIor);
        vec3 refractB = refract(-viewDir, n, 1.0 / (uIor + 0.04));

        vec3 dispersion = vec3(
          abs(refractR.x),
          abs(refractG.y),
          abs(refractB.z)
        ) * 0.3;

        vec3 baseColor = vec3(0.05, 0.06, 0.08);
        vec3 finalColor = mix(baseColor + dispersion, vec3(1.0), fresnel * 0.6);

        // Rim lighting
        float rim = 1.0 - cosTheta;
        finalColor += vec3(0.22, 0.74, 0.97) * rim * rim * 0.5;

        gl_FragColor = vec4(finalColor, 0.92);
      } else {
        discard;
      }
    }
  `
);

extend({ RaymarchedMetaballMaterial });

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace JSX {
    interface IntrinsicElements {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      raymarchedMetaballMaterial: any;
    }
  }
}
