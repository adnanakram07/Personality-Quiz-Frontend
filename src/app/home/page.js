// src/home/page.js
"use client";

import { useState } from "react";
import Link from "next/link";
import IntroLayout from "../../components/layout/IntroLayout";
import ThreeLoader from "../../components/ThreeLoader";
import BrandTags from "../../components/BrandTags";
import NavigationSidebar from "../../components/NavigationSidebar";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <>
      {isLoading && <ThreeLoader onLoadComplete={() => setIsLoading(false)} />}

      <div className={`transition-opacity duration-500 ${isLoading ? "opacity-0" : "opacity-100"}`}>
        <IntroLayout sidebar={<NavigationSidebar />}>
          {/* Brand Tags (Circle + Rectangle) */}
          <BrandTags />

          {/* Desktop Layout - Brain Left, Text Right */}
          <div className="hidden lg:flex relative z-10 items-center justify-center w-full h-full px-16">
            <div className="flex items-center justify-center gap-50 max-w-7xl mx-auto w-full">

              {/* Left Side - 3D Brain */}
              <div className="w-[500px] h-[500px] flex-shrink-0">
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

              {/* Right Side - Text Content */}
              <div className="flex-1 max-w-xl font-editorial">
                <p className="text-lg text-gray-300 mb-4">
                  Decode who you are — with
                </p>
                <h1 className="text-[88px] leading-[0.9] font-semibold">
                  PARADOX<br />
                  PERSONALITY<br />
                  QUIZ
                </h1>
                <p className="mt-6 text-gray-400 text-base">
                  The Paradox Personality Quiz is an immersive experience designed to reveal the contradictions that shape who you are.
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

          {/* Mobile Layout - Text Top, Brain Bottom */}
          <div className="flex lg:hidden relative z-10 flex-col items-center justify-center w-full min-h-screen px-6 py-12">

            {/* Text Content */}
            <div className="text-center font-editorial mb-8">
              <p className="text-sm sm:text-base text-gray-300 mb-3">
                Decode who you are — with
              </p>
              <h1 className="text-[40px] sm:text-[52px] leading-[0.9] font-semibold">
                PARADOX<br />
                PERSONALITY<br />
                QUIZ
              </h1>
              <p className="mt-4 text-gray-400 text-sm">
                The Paradox Personality Quiz is an immersive experience designed to reveal the contradictions that shape who you are.
              </p>
              <Link
                href="/details"
                className="inline-block mt-8 border border-white px-5 py-2.5 text-xs tracking-wide hover:bg-white hover:text-black transition"
              >
                START EXPERIENCE
              </Link>
            </div>

            {/* 3D Brain */}
            <div className="w-full max-w-[350px] h-[350px]">
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

          </div>
        </IntroLayout>
      </div>

      <style jsx global>{`
        @import url("https://fonts.googleapis.com/css2?family=Orbitron:wght@800&display=swap");
      `}</style>
    </>
  );
}

function BrainModel() {
  const { scene } = useGLTF("/assets/3dbrain.glb");
  return (
    <primitive
      object={scene}
      scale={1.4}
      position={[0, 0, 0]}
      rotation={[0, Math.PI / 0.5, 0]}
    />
  );
}