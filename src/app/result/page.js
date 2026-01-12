"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { Sparkles, RefreshCw, Zap, Award, TrendingUp } from "lucide-react";

// Result Page Component
function ResultPage({ user, result, onRetake }) {
  // ✅ ADD NULL CHECKS - This fixes the Vercel error
  if (!result || !result.topPersonality) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <p className="text-gray-400">Loading results...</p>
      </div>
    );
  }

  const { topPersonality } = result;
  const containerRef = useRef(null);
  const videoRef = useRef(null);
  
  const displayName = user?.name?.trim() || "Stranger";
  const [videoError, setVideoError] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 50, y: 50 });
  const [showConfetti, setShowConfetti] = useState(true);
  
  const getPersonalityVideo = (personalityName) => {
    const name = personalityName.toLowerCase();
    if (name.includes("analyst")) return "/assets/analyst.MP4";
    if (name.includes("creative")) return "/assets/creative.MP4";
    if (name.includes("leader")) return "/assets/leader.MP4";
    if (name.includes("supporter")) return "/assets/supporter.mp4";
    return "/assets/analyst.MP4";
  };
  
  const personalityVideo = getPersonalityVideo(topPersonality.name);

  // Personality color schemes
  const getPersonalityTheme = (name) => {
    const n = name.toLowerCase();
    if (n.includes("analyst")) return {
      primary: "#3b82f6",
      secondary: "#2563eb",
      accent: "#60a5fa",
      gradient: "from-blue-500 via-blue-600 to-indigo-600"
    };
    if (n.includes("creative")) return {
      primary: "#fbbf24",
      secondary: "#f59e0b",
      accent: "#fcd34d",
      gradient: "from-yellow-400 via-amber-500 to-orange-500"
    };
    if (n.includes("leader")) return {
      primary: "#a855f7",
      secondary: "#9333ea",
      accent: "#c084fc",
      gradient: "from-purple-500 via-violet-600 to-fuchsia-600"
    };
    if (n.includes("supporter")) return {
      primary: "#fde047",
      secondary: "#facc15",
      accent: "#fef08a",
      gradient: "from-yellow-300 via-yellow-400 to-amber-400"
    };
    return {
      primary: "#a855f7",
      secondary: "#9333ea",
      accent: "#c084fc",
      gradient: "from-purple-500 via-violet-600 to-fuchsia-600"
    };
  };

  const theme = getPersonalityTheme(topPersonality.name);

  // Mouse tracking for interactive effects
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100
      });
    };
    
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Confetti particles
  const confettiCount = 50;
  const confettiParticles = Array.from({ length: confettiCount });

  return (
    <div 
      ref={containerRef}
      className="min-h-screen bg-black text-white overflow-x-hidden relative font-['Manrope',sans-serif]"
      style={{
        background: `radial-gradient(circle at ${mousePosition.x}% ${mousePosition.y}%, rgba(255,69,0,0.15) 0%, transparent 50%), black`
      }}
    >
      {/* Animated grid background */}
      <div className="absolute inset-0 opacity-20">
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: `linear-gradient(${theme.primary} 1px, transparent 1px), linear-gradient(90deg, ${theme.primary} 1px, transparent 1px)`,
            backgroundSize: '50px 50px',
            animation: 'gridMove 20s linear infinite'
          }}
        />
      </div>

      {/* Floating orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className={`absolute rounded-full blur-3xl bg-gradient-to-r ${theme.gradient}`}
            style={{
              width: `${200 + i * 50}px`,
              height: `${200 + i * 50}px`,
              left: `${i * 20}%`,
              top: `${i * 15}%`,
            }}
            animate={{
              x: [0, 100, 0],
              y: [0, -100, 0],
              scale: [1, 1.2, 1],
              opacity: [0.1, 0.2, 0.1],
            }}
            transition={{
              duration: 15 + i * 2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.5
            }}
          />
        ))}
      </div>

      {/* Confetti celebration */}
      <AnimatePresence>
        {showConfetti && (
          <div className="absolute inset-0 pointer-events-none overflow-hidden z-50">
            {confettiParticles.map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-3 h-3 rounded-full"
                style={{
                  background: i % 3 === 0 ? theme.primary : i % 3 === 1 ? theme.secondary : theme.accent,
                  left: `${Math.random() * 100}%`,
                  top: '-5%'
                }}
                initial={{ y: -50, opacity: 1, rotate: 0 }}
                animate={{
                  y: typeof window !== 'undefined' ? window.innerHeight + 50 : 1000,
                  opacity: [1, 1, 0],
                  rotate: Math.random() * 720,
                  x: (Math.random() - 0.5) * 200
                }}
                transition={{
                  duration: 3 + Math.random() * 2,
                  ease: "easeIn",
                  delay: i * 0.02
                }}
                onAnimationComplete={() => {
                  if (i === confettiParticles.length - 1) {
                    setTimeout(() => setShowConfetti(false), 1000);
                  }
                }}
              />
            ))}
          </div>
        )}
      </AnimatePresence>

      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center p-4 md:p-6 lg:p-8 py-8 md:py-12">
        
        {/* Main content wrapper */}
        <motion.div 
          className="w-full max-w-7xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          
          {/* Trophy/Badge section */}
          <motion.div
            className="flex justify-center mb-6 md:mb-8"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ 
              type: "spring", 
              stiffness: 200, 
              damping: 15,
              delay: 0.2 
            }}
          >
            <div className="relative">
              <motion.div
                className="absolute inset-0 blur-xl"
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.5, 0.8, 0.5],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                style={{ 
                  background: `radial-gradient(circle, ${theme.primary} 0%, transparent 70%)` 
                }}
              />
              <Award 
                className="relative" 
                size={60}
                style={{ color: theme.primary }}
                strokeWidth={1.5}
              />
            </div>
          </motion.div>

          {/* Results card with video integration */}
          <div className="grid lg:grid-cols-2 gap-6 md:gap-8 items-start lg:items-center">
            
            {/* Left side - Text content */}
            <motion.div
              initial={{ x: -100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="space-y-4 md:space-y-6 order-2 lg:order-1"
            >
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <div className="flex items-center gap-2 mb-2 md:mb-3">
                  <Sparkles size={20} style={{ color: theme.accent }} className="md:w-6 md:h-6" />
                  <span className="text-xs md:text-sm uppercase tracking-widest text-gray-400 font-semibold">
                    Your Personality Type
                  </span>
                </div>
                
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black mb-3 md:mb-4 leading-tight">
                  Hey{" "}
                  <motion.span
                    className="inline-block bg-gradient-to-r bg-clip-text text-transparent"
                    style={{
                      backgroundImage: `linear-gradient(135deg, ${theme.primary} 0%, ${theme.secondary} 100%)`
                    }}
                  >
                    {displayName}
                  </motion.span>
                  !
                </h1>
              </motion.div>

              <motion.div
                className="relative p-5 md:p-8 rounded-2xl md:rounded-3xl overflow-hidden"
                style={{
                  background: `linear-gradient(135deg, rgba(255,69,0,0.1) 0%, rgba(0,0,0,0.5) 100%)`,
                  border: `2px solid ${theme.primary}33`
                }}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6 }}
                whileHover={{ 
                  scale: 1.02,
                  boxShadow: `0 20px 60px ${theme.primary}40`
                }}
              >
                <motion.div
                  className="absolute top-0 right-0 w-32 h-32 md:w-40 md:h-40 rounded-full blur-3xl"
                  style={{ background: theme.primary }}
                  animate={{
                    scale: [1, 1.5, 1],
                    opacity: [0.1, 0.2, 0.1]
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                  }}
                />

                <div className="relative z-10">
                  <div className="flex items-center gap-2 md:gap-3 mb-3 md:mb-4">
                    <Zap size={24} style={{ color: theme.accent }} className="md:w-8 md:h-8 flex-shrink-0" />
                    <h2 
                      className="text-3xl sm:text-4xl md:text-5xl font-black leading-tight"
                      style={{ color: theme.primary }}
                    >
                      {topPersonality.name}
                    </h2>
                  </div>
                  
                  <p className="text-base md:text-lg lg:text-xl text-gray-300 leading-relaxed">
                    {topPersonality.description}
                  </p>

                  <div className="mt-4 md:mt-6 flex flex-wrap gap-2 md:gap-3">
                    {["Innovative", "Strategic", "Visionary"].map((trait, i) => (
                      <motion.span
                        key={trait}
                        className="px-3 py-1.5 md:px-4 md:py-2 rounded-full text-xs md:text-sm font-semibold"
                        style={{
                          background: `${theme.primary}20`,
                          color: theme.primary,
                          border: `1px solid ${theme.primary}50`
                        }}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.8 + i * 0.1 }}
                        whileHover={{ scale: 1.1 }}
                      >
                        {trait}
                      </motion.span>
                    ))}
                  </div>
                </div>
              </motion.div>

              <motion.button
                onClick={onRetake}
                className="w-full px-8 md:px-10 py-4 md:py-5 text-base md:text-lg font-bold rounded-xl md:rounded-2xl relative overflow-hidden group"
                style={{
                  background: `linear-gradient(135deg, ${theme.primary} 0%, ${theme.secondary} 100%)`,
                }}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.9 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <motion.div
                  className="absolute inset-0 bg-white"
                  initial={{ x: "-100%", opacity: 0 }}
                  whileHover={{ x: "100%", opacity: 0.2 }}
                  transition={{ duration: 0.5 }}
                />
                <span className="relative z-10 flex items-center justify-center gap-2 md:gap-3">
                  <RefreshCw size={18} className="md:w-5 md:h-5" />
                  RETAKE QUIZ
                </span>
              </motion.button>
            </motion.div>

            {/* Right side - Video */}
            <motion.div
              initial={{ x: 100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="order-1 lg:order-2 flex justify-center"
            >
              {videoError ? (
                <div 
                  className="w-full max-w-[280px] sm:max-w-sm aspect-[9/16] rounded-2xl md:rounded-3xl flex items-center justify-center"
                  style={{
                    background: `linear-gradient(135deg, ${theme.primary}20 0%, transparent 100%)`,
                    border: `2px solid ${theme.primary}40`
                  }}
                >
                  <p className="text-gray-400 text-sm md:text-base">Video unavailable</p>
                </div>
              ) : (
                <motion.div 
                  ref={videoRef}
                  className="relative w-full max-w-[280px] sm:max-w-sm"
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  {/* Glowing border effect */}
                  <motion.div
                    className="absolute -inset-0.5 md:-inset-1 rounded-2xl md:rounded-3xl blur-lg md:blur-xl"
                    animate={{
                      opacity: [0.3, 0.5, 0.3],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                    style={{
                      background: `linear-gradient(135deg, ${theme.primary} 0%, ${theme.secondary} 50%, ${theme.accent} 100%)`
                    }}
                  />
                  
                  <div 
                    className="relative aspect-[9/16] rounded-2xl md:rounded-3xl overflow-hidden"
                    style={{
                      background: `linear-gradient(135deg, ${theme.primary}15 0%, ${theme.secondary}10 100%)`,
                      boxShadow: `0 20px 40px -12px ${theme.primary}60`
                    }}
                  >
                    {/* Inner padding container to reduce video size */}
                    <div className="absolute inset-4 md:inset-6 rounded-xl md:rounded-2xl overflow-hidden">
                      <video
                        key={personalityVideo}
                        src={personalityVideo}
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="w-full h-full object-cover"
                        onError={() => {
                          console.error("Video failed to load:", personalityVideo);
                          setVideoError(true);
                        }}
                        onLoadedData={() => {
                          console.log("Video loaded successfully:", personalityVideo);
                        }}
                      />
                    </div>
                    
                    {/* Gradient overlay */}
                    <div 
                      className="absolute inset-0 pointer-events-none"
                      style={{
                        background: `linear-gradient(to top, ${theme.primary}30 0%, transparent 30%)`
                      }}
                    />
                  </div>

                  {/* Floating badge */}
                  <motion.div
                    className="absolute -top-3 -right-3 md:-top-4 md:-right-4 px-3 py-1.5 md:px-4 md:py-2 rounded-full font-bold text-xs md:text-sm shadow-lg"
                    style={{
                      background: `linear-gradient(135deg, ${theme.accent} 0%, ${theme.primary} 100%)`,
                      color: 'black'
                    }}
                    animate={{
                      y: [0, -10, 0],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  >
                    <TrendingUp size={14} className="inline mr-1 md:w-4 md:h-4" />
                    Top Match
                  </motion.div>
                </motion.div>
              )}
            </motion.div>
          </div>
        </motion.div>
      </div>

      <style jsx>{`
        @keyframes gridMove {
          0% { transform: translate(0, 0); }
          100% { transform: translate(50px, 50px); }
        }
      `}</style>
    </div>
  );
}

export default ResultPage;