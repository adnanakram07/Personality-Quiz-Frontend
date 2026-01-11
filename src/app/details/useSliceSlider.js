"use client";

import { useEffect, useRef, useState, useCallback } from "react";

export default function useSliceSlider() {
  const [index, setIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const isAnimating = useRef(false);
  const validationCallback = useRef(null);
  const touchStartY = useRef(0);

  // Detect mobile device
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const showSlide = useCallback((nextIndex) => {
    const slides = document.querySelectorAll(".slide");
    if (!slides.length || isAnimating.current) return;

    isAnimating.current = true;

    slides.forEach((slide, i) => {
      slide.classList.toggle("is-active", i === nextIndex);
    });

    setIndex(nextIndex);

    setTimeout(() => {
      isAnimating.current = false;
    }, 900);
  }, []);

  const nextSlide = useCallback(() => {
    if (isAnimating.current) return;
    
    const currentIndex = index;
    
    // If on Age slide (index 1), validate before proceeding
    if (currentIndex === 1 && validationCallback.current) {
      const canProceed = validationCallback.current();
      if (!canProceed) {
        return; // Block navigation
      }
    }
    
    const newIndex = Math.min(currentIndex + 1, 2);
    if (newIndex !== currentIndex) {
      showSlide(newIndex);
      setIndex(newIndex);
    }
  }, [showSlide, index]);

  const prevSlide = useCallback(() => {
    if (isAnimating.current) return;
    
    const currentIndex = index;
    const newIndex = Math.max(currentIndex - 1, 0);
    if (newIndex !== currentIndex) {
      showSlide(newIndex);
      setIndex(newIndex);
    }
  }, [showSlide, index]);

  const setValidation = useCallback((callback) => {
    validationCallback.current = callback;
  }, []);

  const goToSlide = useCallback((slideIndex) => {
    if (isAnimating.current) return;
    showSlide(slideIndex);
    setIndex(slideIndex);
  }, [showSlide]);

  useEffect(() => {
    const onWheel = (e) => {
      if (isAnimating.current || isMobile) return; // Disable wheel on mobile
      
      if (e.deltaY > 0) {
        nextSlide();
      } else {
        prevSlide();
      }
    };

    const onKey = (e) => {
      if (isAnimating.current) return;

      const isInputFocused = document.activeElement?.tagName === "INPUT";
      
      if (!isInputFocused) {
        if (["ArrowDown", "ArrowRight"].includes(e.key)) {
          nextSlide();
        }
        if (["ArrowUp", "ArrowLeft"].includes(e.key)) {
          prevSlide();
        }
      }
    };
    
    // Touch events for mobile
    const onTouchStart = (e) => {
      touchStartY.current = e.touches[0].clientY;
    };
    
    const onTouchEnd = (e) => {
      if (isAnimating.current || !isMobile) return;
      
      const touchEndY = e.changedTouches[0].clientY;
      const diff = touchStartY.current - touchEndY;
      
      // Minimum distance to trigger slide change
      if (Math.abs(diff) > 50) {
        if (diff > 0) {
          nextSlide();
        } else {
          prevSlide();
        }
      }
    };

    window.addEventListener("wheel", onWheel, { passive: true });
    window.addEventListener("keydown", onKey);
    
    if (isMobile) {
      window.addEventListener("touchstart", onTouchStart, { passive: true });
      window.addEventListener("touchend", onTouchEnd, { passive: true });
    }

    showSlide(0);

    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchend", onTouchEnd);
    };
  }, [nextSlide, prevSlide, showSlide, isMobile]);

  return {
    index,
    total: 3,
    nextSlide,
    prevSlide,
    setValidation,
    goToSlide,
  };
}