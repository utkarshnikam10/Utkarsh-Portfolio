import { Effect } from "postprocessing";
/* eslint-disable */
import * as THREE from "three";

const fragmentShader = /* glsl */ `
  precision highp float;

  uniform sampler2D tDiffuse;
  uniform sampler2D tFluid;       // ping-pong fluid velocity buffer
  uniform float uTime;
  uniform float uDistortionStrength;

  void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {
    vec4 fluid = texture2D(tFluid, uv);
    vec2 velocity = fluid.rg;

    vec2 distortedUV = uv + velocity * uDistortionStrength;
    distortedUV = clamp(distortedUV, 0.001, 0.999);

    float aberrationAmt = length(velocity) * 0.6;
    vec2 abDir = normalize(velocity + vec2(0.0001));

    float r = texture2D(tDiffuse, distortedUV + abDir * aberrationAmt * 0.008).r;
    float g = texture2D(tDiffuse, distortedUV).g;
    float b = texture2D(tDiffuse, distortedUV - abDir * aberrationAmt * 0.008).b;

    outputColor = vec4(r, g, b, inputColor.a);
  }
`;

/**
 * FluidRippleEffect — custom postprocessing Effect.
 * Maintains two WebGLRenderTargets in a ping-pong setup.
 */
export class FluidRippleEffect extends Effect {
  private pingPong: [THREE.WebGLRenderTarget, THREE.WebGLRenderTarget];
  private simMaterial: THREE.ShaderMaterial;
  private simQuad: THREE.Mesh;
  private simScene: THREE.Scene;
  private simCamera: THREE.OrthographicCamera;
  private currentBuffer: number = 0;

  constructor() {
    const fluidBuffer = new THREE.WebGLRenderTarget(256, 256, {
      minFilter: THREE.LinearFilter,
      magFilter: THREE.LinearFilter,
      type: THREE.HalfFloatType,
      format: THREE.RGBAFormat,
    });

    super("FluidRippleEffect", fragmentShader, {
      uniforms: new Map<string, THREE.Uniform<any>>([
        ["tFluid", new THREE.Uniform(fluidBuffer.texture)],
        ["uTime", new THREE.Uniform(0)],
        ["uDistortionStrength", new THREE.Uniform(0.04)],
      ]),
    });

    this.pingPong = [
      fluidBuffer,
      new THREE.WebGLRenderTarget(256, 256, {
        minFilter: THREE.LinearFilter,
        magFilter: THREE.LinearFilter,
        type: THREE.HalfFloatType,
        format: THREE.RGBAFormat,
      }),
    ];

    this.simMaterial = new THREE.ShaderMaterial({
      uniforms: {
        tPrev: { value: null },
        uMouse: { value: new THREE.Vector2(0.5, 0.5) },
        uVelocity: { value: new THREE.Vector2(0, 0) },
        uDecay: { value: 0.985 },
      },
      vertexShader: /* glsl */ `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: /* glsl */ `
        precision highp float;
        uniform sampler2D tPrev;
        uniform vec2 uMouse;
        uniform vec2 uVelocity;
        uniform float uDecay;

        varying vec2 vUv;

        void main() {
          float px = 1.0 / 256.0;
          vec4 curr = texture2D(tPrev, vUv);
          vec4 n    = texture2D(tPrev, vUv + vec2(0.0,  px));
          vec4 s    = texture2D(tPrev, vUv + vec2(0.0, -px));
          vec4 e    = texture2D(tPrev, vUv + vec2( px, 0.0));
          vec4 w    = texture2D(tPrev, vUv + vec2(-px, 0.0));
          vec4 diffused = (curr + n + s + e + w) / 5.0;

          float dist = length(vUv - uMouse);
          float splash = smoothstep(0.08, 0.0, dist);

          vec4 result = diffused * uDecay + vec4(uVelocity * splash * 0.3, 0.0, 0.0);

          gl_FragColor = result;
        }
      `,
    });

    this.simScene = new THREE.Scene();
    this.simCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const simGeom = new THREE.PlaneGeometry(2, 2);
    this.simQuad = new THREE.Mesh(simGeom, this.simMaterial);
    this.simScene.add(this.simQuad);
  }

  public update(
    renderer: THREE.WebGLRenderer,
    _inputBuffer: THREE.WebGLRenderTarget,
    _deltaTime: number
  ): void {
    const read  = this.pingPong[this.currentBuffer];
    const write = this.pingPong[1 - this.currentBuffer];

    this.simMaterial.uniforms.tPrev.value = read.texture;
    renderer.setRenderTarget(write);
    renderer.render(this.simScene, this.simCamera);
    renderer.setRenderTarget(null);

    this.uniforms.get("tFluid")!.value = write.texture;
    this.currentBuffer = 1 - this.currentBuffer;
  }

  public setMouseVelocity(mouse: THREE.Vector2, vel: THREE.Vector2) {
    this.simMaterial.uniforms.uMouse.value = mouse;
    this.simMaterial.uniforms.uVelocity.value = vel;
  }

  public dispose(): void {
    this.pingPong[0].dispose();
    this.pingPong[1].dispose();
    this.simMaterial.dispose();
    this.simQuad.geometry.dispose();
    super.dispose();
  }
}
