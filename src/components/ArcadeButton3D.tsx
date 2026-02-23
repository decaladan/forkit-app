"use client";

import { useRef, useState, useCallback, useEffect, useMemo, Suspense } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useGLTF, Float, Text } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import * as THREE from "three";
import { addOutlines } from "@/lib/edge-outlines";

// ============================================
// FOOD MODEL — keeps original colors + adds outlines
// ============================================

function FoodModel({
  url,
  position,
  rotation,
  scale,
  floatSpeed = 1,
  floatIntensity = 0.3,
  spinSpeed = 0.3,
}: {
  url: string;
  position: [number, number, number];
  rotation?: [number, number, number];
  scale?: number;
  floatSpeed?: number;
  floatIntensity?: number;
  spinSpeed?: number;
}) {
  const { scene } = useGLTF(url);
  const ref = useRef<THREE.Group>(null);
  const baseY = useRef(position[1]);

  const clonedScene = useMemo(() => {
    const clone = scene.clone(true);
    clone.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        // Deep clone materials
        if (Array.isArray(child.material)) {
          child.material = child.material.map((m) => {
            const c = m.clone();
            // Ensure texture encoding is correct
            if (c.map) c.map.colorSpace = THREE.SRGBColorSpace;
            return c;
          });
        } else {
          child.material = child.material.clone();
          if (child.material.map) {
            child.material.map.colorSpace = THREE.SRGBColorSpace;
          }
        }
      }
    });
    addOutlines(clone, "#222222", 20);
    return clone;
  }, [scene]);

  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.getElapsedTime();
    ref.current.rotation.y += spinSpeed * 0.01;
    ref.current.position.y =
      baseY.current + Math.sin(t * floatSpeed) * floatIntensity;
  });

  return (
    <group ref={ref} position={position} rotation={rotation || [0, 0, 0]}>
      <primitive object={clonedScene} scale={scale || 1} />
    </group>
  );
}

// ============================================
// ARCADE BUTTON
// ============================================

function ArcadeButton({
  onPress,
  disabled,
}: {
  onPress: () => void;
  disabled: boolean;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const domeRef = useRef<THREE.Group>(null);
  const [pressed, setPressed] = useState(false);
  const [hovered, setHovered] = useState(false);

  useFrame(() => {
    if (!domeRef.current) return;
    const targetY = pressed ? -0.08 : 0;
    domeRef.current.position.y = THREE.MathUtils.lerp(
      domeRef.current.position.y,
      targetY,
      pressed ? 0.4 : 0.15
    );
    if (!groupRef.current) return;
    const s = hovered && !disabled ? 1.04 : 1;
    groupRef.current.scale.lerp(new THREE.Vector3(s, s, s), 0.08);
  });

  const handleDown = useCallback(() => {
    if (disabled) return;
    setPressed(true);
  }, [disabled]);

  const handleUp = useCallback(() => {
    if (disabled) return;
    setPressed(false);
    onPress();
  }, [disabled, onPress]);

  return (
    <group
      ref={groupRef}
      onPointerDown={handleDown}
      onPointerUp={handleUp}
      onPointerLeave={() => { setPressed(false); setHovered(false); }}
      onPointerEnter={() => !disabled && setHovered(true)}
    >
      {/* Base */}
      <mesh position={[0, -0.25, 0]} castShadow>
        <cylinderGeometry args={[1.2, 1.3, 0.5, 32]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.3} metalness={0.7} />
      </mesh>

      {/* Rim */}
      <mesh position={[0, 0.02, 0]}>
        <cylinderGeometry args={[1.15, 1.15, 0.06, 32]} />
        <meshBasicMaterial color="#333333" />
      </mesh>

      {/* Dome */}
      <group ref={domeRef}>
        <mesh position={[0, 0.1, 0]} castShadow>
          <sphereGeometry args={[0.95, 32, 16, 0, Math.PI * 2, 0, Math.PI * 0.5]} />
          <meshBasicMaterial color="#e53935" />
        </mesh>

        {/* Highlight */}
        <mesh position={[-0.15, 0.38, 0.2]}>
          <sphereGeometry args={[0.2, 16, 8]} />
          <meshBasicMaterial color="#ff8a80" transparent opacity={0.5} />
        </mesh>

        {/* Label */}
        <Text
          position={[0, 0.42, 0.45]}
          rotation={[-0.55, 0, 0]}
          fontSize={0.22}
          fontWeight={900}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.02}
          outlineColor="#111111"
        >
          FORK IT
        </Text>
      </group>
    </group>
  );
}

// ============================================
// FOOD RING — spread out, smaller, varied heights
// ============================================

const FOOD_ITEMS = [
  { url: "/models/kenney-food-kit/burger.glb", angle: 0, r: 4.5, y: 0.5, scale: 6, spin: 0.15 },
  { url: "/models/kenney-food-kit/pizza.glb", angle: Math.PI * 0.35, r: 5.0, y: 0.8, scale: 5, spin: -0.2 },
  { url: "/models/kenney-food-kit/taco.glb", angle: Math.PI * 0.7, r: 4.2, y: 0.3, scale: 6, spin: 0.2 },
  { url: "/models/kenney-food-kit/donut-sprinkles.glb", angle: Math.PI * 1.05, r: 4.8, y: 0.6, scale: 5, spin: -0.25 },
  { url: "/models/kenney-food-kit/fries.glb", angle: Math.PI * 1.4, r: 4.3, y: 0.4, scale: 5, spin: 0.18 },
  { url: "/models/kenney-food-kit/hot-dog.glb", angle: Math.PI * 1.7, r: 4.6, y: 0.7, scale: 6, spin: -0.2 },
];

function FoodRing() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!groupRef.current) return;
    groupRef.current.rotation.y = state.clock.getElapsedTime() * 0.04;
  });

  return (
    <group ref={groupRef}>
      {FOOD_ITEMS.map((item, i) => (
        <FoodModel
          key={i}
          url={item.url}
          position={[
            Math.cos(item.angle) * item.r,
            item.y,
            Math.sin(item.angle) * item.r,
          ]}
          scale={item.scale}
          floatSpeed={0.5 + i * 0.12}
          floatIntensity={0.2}
          spinSpeed={item.spin}
        />
      ))}
    </group>
  );
}

// ============================================
// BACKDROP
// ============================================

function BackdropGlow() {
  return (
    <mesh position={[0, -0.5, -4]} rotation={[-Math.PI / 5, 0, 0]} scale={[1.3, 1, 1]}>
      <circleGeometry args={[5, 64]} />
      <meshBasicMaterial color="#c62828" transparent opacity={0.2} />
    </mesh>
  );
}

// ============================================
// CAMERA — zoomed out more to show spread
// ============================================

function CameraSetup() {
  const { camera } = useThree();
  useEffect(() => {
    camera.position.set(0, 4, 8);
    camera.lookAt(0, 0, 0);
  }, [camera]);
  return null;
}

// ============================================
// MAIN EXPORT — fullscreen background canvas
// ============================================

interface ArcadeButton3DProps {
  onPress: () => void;
  disabled?: boolean;
}

export function ArcadeButton3D({ onPress, disabled = false }: ArcadeButton3DProps) {
  return (
    <div className="fixed inset-0 z-0" style={{ touchAction: "none" }}>
      <Canvas
        orthographic
        shadows
        dpr={[1, 2]}
        camera={{ zoom: 40, position: [0, 4, 10], near: -100, far: 100 }}
        gl={{
          antialias: true,
          toneMapping: THREE.NoToneMapping,
          alpha: true,
        }}
        style={{ background: "transparent", width: "100%", height: "100%" }}
      >
        <CameraSetup />

        {/* Flat lighting — high ambient to show texture colors */}
        <directionalLight position={[-3, 8, 5]} intensity={1} color="#ffffff" />
        <directionalLight position={[3, 2, -3]} intensity={0.4} color="#ffffff" />
        <ambientLight intensity={0.8} />

        <Suspense fallback={null}>
          <BackdropGlow />
          <Float speed={1} rotationIntensity={0.02} floatIntensity={0.04}>
            <ArcadeButton onPress={onPress} disabled={disabled} />
          </Float>
          <FoodRing />
        </Suspense>

        <EffectComposer>
          <Bloom intensity={0.2} luminanceThreshold={0.85} luminanceSmoothing={0.9} mipmapBlur />
        </EffectComposer>
      </Canvas>
    </div>
  );
}

// Preload
FOOD_ITEMS.forEach((item) => useGLTF.preload(item.url));
