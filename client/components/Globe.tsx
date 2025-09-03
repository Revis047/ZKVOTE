import { Canvas } from "@react-three/fiber";
import { OrbitControls, Stars } from "@react-three/drei";
import { useRef } from "react";
import * as THREE from "three";

function Sphere() {
  const mesh = useRef<THREE.Mesh>(null!);
  return (
    <mesh ref={mesh} rotation={[0.4, 0.8, 0]}>      
      <sphereGeometry args={[1.6, 64, 64]} />
      <meshStandardMaterial
        color={new THREE.Color("#1b2a4a")}
        metalness={0.2}
        roughness={0.7}
        emissive={new THREE.Color("#0ea5e9")}
        emissiveIntensity={0.08}
      />
      {/* Atmosphere glow */}
      <mesh>
        <sphereGeometry args={[1.63, 64, 64]} />
        <meshBasicMaterial color="#00e5ff" transparent opacity={0.06} />
      </mesh>
    </mesh>
  );
}

export default function Globe() {
  return (
    <div className="absolute inset-0 -z-10">
      <Canvas camera={{ position: [0, 0, 4.2], fov: 50 }}>
        <ambientLight intensity={0.3} />
        <directionalLight position={[5, 5, 5]} intensity={1.2} color="#7c3aed" />
        <Sphere />
        <Stars radius={50} depth={25} count={2000} factor={2} saturation={0} fade speed={1} />
        <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.6} />
      </Canvas>
    </div>
  );
}
