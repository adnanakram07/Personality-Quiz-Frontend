"use client";

import { useState } from "react";
import Link from "next/link";
import IntroLayout from "../components/layout/IntroLayout";
// import StarField from "../components/StarField";
import ThreeLoader from "../components/ThreeLoader";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";

/* ---------------- HOME PAGE ---------------- */

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <>
      {/* Show loader initially */}
      {isLoading && (
        <ThreeLoader onLoadComplete={() => setIsLoading(false)} />
      )}

      {/* Main content - hidden while loading */}
      <div className={`transition-opacity duration-500 ${isLoading ? 'opacity-0' : 'opacity-100'}`}>
        <IntroLayout sidebar={<RightSidebar />}>
          {/* <StarField /> */}
          
          {/* Desktop Layout */}
          <div className="hidden lg:flex relative z-10 items-center justify-center w-full h-full">
            <div className="relative flex items-center justify-center">
              <div className="w-[500px] h-[500px]">
                <Canvas camera={{ position: [0, 0, 4], fov: 45 }}>
                  <ambientLight intensity={1.2} />
                  <directionalLight position={[5, 5, 5]} intensity={1} />
                  <BrainModel />
                  <OrbitControls
                    enableZoom={false}
                    enablePan={false}
                    enableRotate={false}
                    autoRotate
                    autoRotateSpeed={0.6}
                  />
                </Canvas>
              </div>
              <div className="absolute right-[-70px] font-editorial">
                <p className="text-lg text-gray-300 mb-4">
                  Fullstack Developer
                </p>
                <h1 className="text-[88px] leading-[0.9] font-semibold">
                  PARADOX<br />
                  PERSONALITY<br />
                  QUIZ
                </h1>
                <p className="mt-6 text-gray-400 text-base">
                  Bengaluru, India
                </p>
                <Link
                  href="/details"
                  className="inline-block mt-10 border border-white px-6 py-3 text-sm tracking-wide hover:bg-white hover:text-black transition"
                >
                  START EXPERIENCE
                </Link>
              </div>
            </div>
          </div>

          {/* Mobile Layout */}
          <div className="flex lg:hidden relative z-10 items-center justify-center w-full h-full px-6">
            <div className="relative flex items-center justify-center">
              {/* Brain - centered behind text */}
              <div className="absolute w-[300px] h-[300px] sm:w-[350px] sm:h-[350px]">
                <Canvas camera={{ position: [0, 0, 4], fov: 45 }}>
                  <ambientLight intensity={1.2} />
                  <directionalLight position={[5, 5, 5]} intensity={1} />
                  <BrainModel />
                  <OrbitControls
                    enableZoom={false}
                    enablePan={false}
                    enableRotate={false}
                    autoRotate
                    autoRotateSpeed={0.6}
                  />
                </Canvas>
              </div>
              
              {/* Text - centered on top of brain */}
              <div className="relative z-10 text-center font-editorial">
                <p className="text-sm sm:text-base text-gray-300 mb-3">
                  Fullstack Developer
                </p>
                <h1 className="text-[40px] sm:text-[52px] leading-[0.9] font-semibold">
                  PARADOX<br />
                  PERSONALITY<br />
                  QUIZ
                </h1>
                <p className="mt-4 text-gray-400 text-sm">
                  Bengaluru, India
                </p>
                <Link
                  href="/details"
                  className="inline-block mt-8 border border-white px-5 py-2.5 text-xs tracking-wide hover:bg-white hover:text-black transition"
                >
                  START EXPERIENCE
                </Link>
              </div>
            </div>
          </div>
        </IntroLayout>
      </div>
    </>
  );
}

/* ---------------- 3D BRAIN MODEL ---------------- */

function BrainModel() {
  const { scene } = useGLTF("/assets/3dbrain.glb");

  return (
    <primitive
      object={scene}
      scale={1.3}
      position={[0, 0, 0]}
      rotation={[0, Math.PI / 0.5, 0]}
    />
  );
}

/* ---------------- RIGHT SIDEBAR ---------------- */

function RightSidebar() {
  const items = ["ABOUT", "DETAILS", "QUIZ", "RESULT", "CONTACT"];

  return (
    <nav className="h-full flex items-center justify-center">
      <ul className="flex flex-col items-center justify-center gap-20 rotate-180">
        {items.map((item) => (
          <li
            key={item}
            className="rotate-90 text-xs tracking-widest text-gray-400 cursor-pointer transition-all duration-200 hover:line-through hover:text-white"
          >
            {item}
          </li>
        ))}
      </ul>
    </nav>
  );
}