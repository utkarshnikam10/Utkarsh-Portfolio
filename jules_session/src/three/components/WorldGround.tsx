"use client";

import { ContactShadows, Sparkles } from "@react-three/drei";

export function WorldGround() {
  return (
    <group>
      <mesh receiveShadow position={[0, -0.08, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[7.25, 64]} />
        <meshStandardMaterial color="#202927" roughness={0.97} />
      </mesh>
      <mesh position={[0, -0.06, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[6.3, 7.18, 64]} />
        <meshBasicMaterial color="#45554d" transparent opacity={0.28} />
      </mesh>
      <mesh position={[0.1, -0.045, -0.2]} rotation={[-Math.PI / 2, 0.25, 0]}>
        <ringGeometry args={[2.8, 2.88, 64, 1, 0.1, Math.PI * 1.75]} />
        <meshBasicMaterial color="#c9a371" transparent opacity={0.28} />
      </mesh>
      <ContactShadows
        opacity={0.48}
        position={[0, -0.06, 0]}
        scale={15}
        blur={2.7}
        far={5.5}
        color="#08110e"
      />
      <Sparkles
        count={42}
        scale={[13, 4, 12]}
        size={1.8}
        speed={0.12}
        color="#f6debc"
        position={[0, 2.2, 0]}
      />
    </group>
  );
}
