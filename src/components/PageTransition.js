"use client";

import { useEffect, useRef, useState } from "react";

export default function PageTransition({ isTransitioning, onTransitionComplete }) {
  const pathRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile device
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (!isTransitioning) return;

    // Show the component first
    setIsVisible(true);

    // For mobile, use a simpler transition
    if (isMobile) {
      // Complete transition after shorter time for mobile
      const timer = setTimeout(() => {
        if (onTransitionComplete) {
          onTransitionComplete();
        }
      }, 600);
      
      return () => clearTimeout(timer);
    }

    // Original desktop animation logic
    // Small delay to ensure DOM is ready
    setTimeout(() => {
      if (!pathRef.current) return;

      const path = pathRef.current;
      const start = "M 0 100 V 50 Q 50 0 100 50 V 100 z";
      const end = "M 0 100 V 0 Q 50 0 100 0 V 100 z";

      // First animation - wave rises from bottom
      setTimeout(() => {
        path.setAttribute("d", start);
      }, 50);

      // Second animation - wave fills screen
      setTimeout(() => {
        path.setAttribute("d", end);
      }, 900);

      // Complete transition
      setTimeout(() => {
        if (onTransitionComplete) {
          onTransitionComplete();
        }
      }, 1700);
    }, 50);
  }, [isTransitioning, onTransitionComplete, isMobile]);

  if (!isVisible) return null;

  // Use simple fade transition for mobile
  if (isMobile) {
    return (
      <div className={`fixed inset-0 z-[9999] transition-opacity duration-300 ${
        isTransitioning ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}>
        <div className="flex items-center justify-center h-full">
          <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  // Original SVG animation for desktop
  return (
    <div className="fixed inset-0 z-[9999] pointer-events-none">
      <svg 
        className="w-full h-full" 
        viewBox="0 0 100 100" 
        preserveAspectRatio="xMidYMin slice"
      >
        <defs>
          <linearGradient id="grad" x1="0" y1="0" x2="99" y2="99" gradientUnits="userSpaceOnUse">
            <stop offset="0.2" stopColor="#160118" />
            <stop offset="0.8" stopColor="#4b0f0f" />
          </linearGradient>
          {/*  */}
        </defs>
        <path 
          ref={pathRef}
          stroke="url(#grad)" 
          fill="url(#grad)" 
          strokeWidth="2px" 
          vectorEffect="non-scaling-stroke" 
          d="M 0 100 V 100 Q 50 100 100 100 V 100 z"
          style={{
            transition: "d 0.8s cubic-bezier(0.65, 0, 0.35, 1)"
          }}
        />
      </svg>
    </div>
  );
}