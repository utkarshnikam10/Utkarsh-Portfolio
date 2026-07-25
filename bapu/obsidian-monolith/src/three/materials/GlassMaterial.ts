import * as THREE from "three";

export function createGlassMaterial(
  overrides?: Partial<THREE.MeshPhysicalMaterialParameters>
): THREE.MeshPhysicalMaterial {
  return new THREE.MeshPhysicalMaterial({
    color: new THREE.Color("#0d0e10"),
    transmission: 0.98,
    roughness: 0.03,
    ior: 1.52,
    thickness: 1.5,
    dispersion: 0.04,
    clearcoat: 1.0,
    clearcoatRoughness: 0.02,
    metalness: 0.1,
    reflectivity: 1.0,
    ...overrides,
  });
}
