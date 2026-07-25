import * as THREE from "three";
import { shaderMaterial } from "@react-three/drei";
import { extend } from "@react-three/fiber";

/**
 * FRACTAL MEGASTRUCTURE SHADER
 *
 * Fast, performant Raymarched Mandelbox SDF backdrop.
 * Highly optimized for 60 FPS performance without WebGL TDR GPU hangs.
 */
export const FractalMegastructureMaterial = shaderMaterial(
  {
    uTime: 0,
    uScrollDepth: 0,
    uResolution: new THREE.Vector2(1, 1),
    uMouse: new THREE.Vector2(0.5, 0.5),
    uRaymarchSteps: 24,
  },
  // Vertex shader
  /* glsl */ `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  // Fragment shader — Mandelbox Raymarcher
  /* glsl */ `
    precision mediump float;

    uniform float uTime;
    uniform float uScrollDepth;
    uniform vec2  uResolution;
    uniform vec2  uMouse;
    uniform int   uRaymarchSteps;

    varying vec2 vUv;

    // ── Mandelbox SDF (Fast 4-iteration fold) ────────────────────────
    float scale = 2.4;

    vec3 boxFold(vec3 p, float fold) {
      return clamp(p, -fold, fold) * 2.0 - p;
    }

    float ballFold(float r, float minR) {
      if (r < minR) return 1.0 / (minR * minR);
      if (r < 1.0) return 1.0 / (r * r);
      return 1.0;
    }

    float mandelboxSDF(vec3 p) {
      vec3 z  = p;
      float dr = 1.0;
      float r  = 0.0;
      float fold = 1.0 + 0.03 * sin(uTime * 0.3);

      for (int i = 0; i < 4; i++) {
        z  = boxFold(z, fold);
        r  = length(z);
        float bf = ballFold(r, 0.5);
        z  *= bf * scale;
        dr *= abs(scale) * bf;
        z  += p;
      }
      return length(z) / abs(dr) - 0.003;
    }

    // ── Fast Normal estimation ───────────────────────────────────────
    vec3 calcNormal(vec3 p) {
      const vec2 e = vec2(0.002, -0.002);
      return normalize(
        e.xyy * mandelboxSDF(p + e.xyy) +
        e.yyx * mandelboxSDF(p + e.yyx) +
        e.yxy * mandelboxSDF(p + e.yxy) +
        e.xxx * mandelboxSDF(p + e.xxx)
      );
    }

    // ── Fast AO (2 samples) ──────────────────────────────────────────
    float calcAO(vec3 pos, vec3 nor) {
      float occ = 0.0;
      occ += (0.05 - mandelboxSDF(pos + nor * 0.05)) * 0.5;
      occ += (0.15 - mandelboxSDF(pos + nor * 0.15)) * 0.25;
      return clamp(1.0 - 2.0 * occ, 0.0, 1.0);
    }

    // ── Iridescent color from normal ─────────────────────────────────
    vec3 iridescentColor(vec3 n, float t) {
      float hue = dot(n, vec3(0.577)) * 0.5 + 0.5 + t * 0.08;
      vec3 a = vec3(0.5);
      vec3 b = vec3(0.5);
      vec3 c = vec3(1.0, 1.0, 1.0);
      vec3 d = vec3(0.00, 0.33, 0.67);
      return a + b * cos(6.28318 * (c * hue + d));
    }

    // ── Ray orbit camera ─────────────────────────────────────────────
    mat3 setCamera(vec3 ro, vec3 ta) {
      vec3 w = normalize(ta - ro);
      vec3 u = normalize(cross(w, vec3(0.0, 1.0, 0.0)));
      vec3 v = cross(u, w);
      return mat3(u, v, w);
    }

    void main() {
      vec2 uv = vUv;
      vec2 p = (uv * 2.0 - 1.0) * vec2(uResolution.x / uResolution.y, 1.0);

      // Camera position
      float angle = uTime * 0.05 + uScrollDepth * 0.8;
      float camR   = 4.2 - uScrollDepth * 1.0;
      float camY   = 0.5 + sin(uTime * 0.03) * 0.2;

      vec3 ro = vec3(cos(angle) * camR, camY, sin(angle) * camR);
      vec3 ta = vec3(0.0, 0.0, 0.0);

      vec2 mOff = (uMouse - 0.5) * 0.2;
      ro.x += mOff.x;
      ro.y += mOff.y;

      mat3 ca = setCamera(ro, ta);
      vec3 rd = ca * normalize(vec3(p, 1.8));

      // ── Raymarching loop (capped at 24 steps max) ─────────────────
      float t   = 0.05;
      float tMax = 10.0;
      float d   = 0.0;
      bool  hit  = false;

      for (int i = 0; i < 24; i++) {
        d = mandelboxSDF(ro + rd * t);
        if (d < 0.002) { hit = true; break; }
        if (t > tMax)  { break; }
        t += d * 0.85;
      }

      vec3 col = vec3(0.0);

      if (hit) {
        vec3 pos = ro + rd * t;
        vec3 n   = calcNormal(pos);
        vec3 lDir = normalize(vec3(1.0, 2.0, 1.5));

        float ao   = calcAO(pos, n);
        float diff = max(dot(n, lDir), 0.0);
        float spec = pow(max(dot(reflect(-lDir, n), -rd), 0.0), 16.0);

        vec3 baseCol = iridescentColor(n, uTime);

        col  = baseCol * (diff * 1.1 + ao * 0.2);
        col += vec3(0.9, 0.95, 1.0) * spec * 0.4;
        col += baseCol * 0.05;

        // Depth fog
        float fogAmount = 1.0 - exp(-t * 0.1);
        col = mix(col, vec3(0.01, 0.015, 0.04), fogAmount);
      } else {
        float fogGlow = exp(-t * 0.08);
        col = vec3(0.005, 0.008, 0.02) + vec3(0.01, 0.02, 0.04) * fogGlow;
      }

      // Tone-map & gamma
      col = col / (1.0 + col);
      col = pow(col, vec3(0.4545));

      // Vignette
      float vign = 1.0 - dot(vUv - 0.5, (vUv - 0.5) * 2.0) * 0.7;
      col *= vign;

      gl_FragColor = vec4(col, hit ? 0.95 : 0.0);
    }
  `
);

extend({ FractalMegastructureMaterial });
