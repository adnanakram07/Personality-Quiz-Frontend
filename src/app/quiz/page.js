"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";

// Simple loader component
function ThreeLoader({ onLoadComplete, minDuration = 1500 }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const startTime = Date.now();
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          const elapsed = Date.now() - startTime;
          const remaining = Math.max(0, minDuration - elapsed);
          setTimeout(() => {
            onLoadComplete();
          }, remaining);
          return 100;
        }
        return prev + 2;
      });
    }, 30);

    return () => clearInterval(interval);
  }, [onLoadComplete, minDuration]);

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-[#0a0a0a] via-[#121212] to-[#0a0a0a] flex items-center justify-center z-50">
      <div className="text-center">
        <motion.div
          className="w-20 h-20 border-4 border-[rgba(255,69,0,0.3)] border-t-[#ff4500] rounded-full mx-auto mb-8"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
        <motion.h2
          className="text-2xl font-bold text-[#f5f5f5] mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Loading Questions...
        </motion.h2>
        <div className="w-64 h-2 bg-[rgba(255,255,255,0.1)] rounded-full overflow-hidden mx-auto">
          <motion.div
            className="h-full bg-gradient-to-r from-[#ff4500] to-[#ff5722]"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
        <motion.p
          className="text-[rgba(255,255,255,0.5)] mt-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          {progress}%
        </motion.p>
      </div>
    </div>
  );
}

// Result Loader
function ResultLoader({ onLoadComplete }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const startTime = Date.now();
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          const elapsed = Date.now() - startTime;
          const remaining = Math.max(0, 2000 - elapsed);
          setTimeout(() => {
            onLoadComplete();
          }, remaining);
          return 100;
        }
        return prev + 1.5;
      });
    }, 30);

    return () => clearInterval(interval);
  }, [onLoadComplete]);

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-[#0a0a0a] via-[#121212] to-[#0a0a0a] flex items-center justify-center z-50">
      <div className="text-center">
        <motion.div
          className="w-20 h-20 border-4 border-[rgba(255,69,0,0.3)] border-t-[#ff4500] rounded-full mx-auto mb-8"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
        <motion.h2
          className="text-2xl font-bold text-[#f5f5f5] mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Analyzing Your Personality...
        </motion.h2>
        <div className="w-64 h-2 bg-[rgba(255,255,255,0.1)] rounded-full overflow-hidden mx-auto">
          <motion.div
            className="h-full bg-gradient-to-r from-[#ff4500] to-[#ff5722]"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
        <motion.p
          className="text-[rgba(255,255,255,0.5)] mt-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          {progress.toFixed(0)}%
        </motion.p>
      </div>
    </div>
  );
}

function QuestionCard({ 
  question, 
  index, 
  answers, 
  selectOption, 
  isTransitioning, 
  sectionProgress,
  containerVariants,
  itemVariants,
  cardVariants,
  optionVariants,
  isActive,
  isMobile
}) {
  const ref = useRef(null);
  const [isInView, setIsInView] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);
  const lastScrollY = useRef(0);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        const currentScrollY = window.scrollY;
        const isScrollingDown = currentScrollY > lastScrollY.current;
        
        if (entry.isIntersecting) {
          setIsInView(true);
          if (!isScrollingDown && hasAnimated) {
            setHasAnimated(false);
            setTimeout(() => setHasAnimated(true), 50);
          } else if (!hasAnimated) {
            setHasAnimated(true);
          }
        } else if (!entry.isIntersecting && entry.boundingClientRect.top < 0) {
          if (isScrollingDown) {
            setIsInView(false);
          }
        }
        
        lastScrollY.current = currentScrollY;
      },
      { 
        threshold: [0, 0.05, 0.1, 0.2, 0.3, 0.5, 0.7, 0.9],
        rootMargin: "-10% 0px -10% 0px"
      }
    );
    
    if (ref.current) {
      observer.observe(ref.current);
    }
    
    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [hasAnimated]);
  
  return (
    <div 
      ref={ref} 
      className={`min-h-screen flex items-center justify-center py-20 px-6 transition-all duration-700 ${
        isActive ? 'z-20' : 'z-10'
      }`}
    >
      <motion.div 
        className="max-w-4xl w-full"
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        variants={containerVariants}
        transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
      >
        <motion.div 
          className="bg-gradient-to-br from-[rgba(255,255,255,0.05)] to-[rgba(255,255,255,0.02)] backdrop-blur-md border border-[rgba(255,255,255,0.1)] rounded-2xl p-8 md:p-12 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] relative overflow-hidden"
          variants={cardVariants}
          style={{ 
            transformStyle: "preserve-3d",
            perspective: "1000px"
          }}
        >
          <motion.div 
            className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-[rgba(255,69,0,0.2)] to-transparent rounded-bl-full opacity-50"
            animate={{ 
              scale: isActive ? 1.05 : 1,
              opacity: isActive ? 0.6 : 0.5
            }}
            transition={{ duration: 0.7 }}
          />
          <motion.div 
            className="absolute bottom-0 left-0 w-40 h-40 bg-gradient-to-tr from-[rgba(120,69,255,0.2)] to-transparent rounded-tr-full opacity-50"
            animate={{ 
              scale: isActive ? 1.05 : 1,
              opacity: isActive ? 0.6 : 0.5
            }}
            transition={{ duration: 0.7 }}
          />
          
          <motion.div 
            className="inline-block px-4 py-2 bg-[rgba(255,69,0,0.2)] rounded-full text-sm font-medium text-[#ff4500] mb-6"
            variants={itemVariants}
            whileHover={{ scale: 1.05 }}
          >
            Question {index + 1} of {question.totalQuestions}
          </motion.div>
          
          <motion.h2 
            className={`${isMobile ? 'text-2xl' : 'text-3xl md:text-5xl'} font-bold text-[#f5f5f5] leading-tight mb-8`}
            variants={itemVariants}
          >
            {question.question_text}
          </motion.h2>
          
          <motion.div 
            className="w-full h-2 bg-[rgba(255,255,255,0.1)] rounded-full overflow-hidden mb-8"
            variants={itemVariants}
          >
            <motion.div 
              className="h-full bg-gradient-to-r from-[#ff4500] to-[#ff5722]"
              initial={{ width: 0 }}
              animate={{ width: `${sectionProgress[index] || 0}%` }}
              transition={{ duration: 0.1, ease: "linear" }}
            ></motion.div>
          </motion.div>
          
          <motion.div 
            className={`grid ${isMobile ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2'} gap-4`}
            variants={containerVariants}
          >
            {question.options.map((option, optionIndex) => (
              <motion.div
                key={option.id}
                custom={optionIndex}
                variants={optionVariants}
                whileHover={{ 
                  y: -5, 
                  scale: 1.02,
                  transition: { duration: 0.3, ease: "easeOut" }
                }}
                whileTap={{ scale: 0.98 }}
                className="relative"
              >
                <motion.button
                  id={`option-${option.id}`}
                  onClick={() => selectOption(question.id, option.id)}
                  disabled={isTransitioning}
                  className={`w-full h-full p-6 rounded-xl text-left transition-all duration-500 relative overflow-hidden group ${
                    answers[question.id] === option.id
                      ? "bg-gradient-to-r from-[#ff4500] to-[#ff5722] text-white scale-[1.02] shadow-[0_0_30px_rgba(255,69,0,0.3)] border-2 border-[#ff4500]"
                      : "bg-gradient-to-br from-[rgba(255,255,255,0.08)] to-[rgba(255,255,255,0.04)] backdrop-blur-sm border-2 border-[rgba(255,255,255,0.15)] hover:border-[rgba(255,69,0,0.5)] hover:shadow-[0_10px_30px_-10px_rgba(255,69,0,0.3)]"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <span className={`${isMobile ? 'text-base' : 'text-lg'} font-medium`}>{option.option_text}</span>
                    {answers[question.id] === option.id && (
                      <motion.div 
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ 
                          type: "spring", 
                          stiffness: 500, 
                          damping: 15,
                          duration: 0.6
                        }}
                      >
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                        </svg>
                      </motion.div>
                    )}
                  </div>
                  
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 -skew-x-12 -translate-x-full group-hover:translate-x-full group-hover:opacity-10 transition-all duration-1000"></div>
                  <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-transparent via-white to-transparent opacity-0 group-hover:opacity-5 transition-opacity duration-300 pointer-events-none"></div>
                </motion.button>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
}

// Result Page Component
function ResultPage({ user, result, onRetake }) {
  const { topPersonality, personalityScores } = result;
  
  const sortedScores = Object.entries(personalityScores || {})
    .sort(([, a], [, b]) => b - a);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a0a] via-[#121212] to-[#0a0a0a] text-[#f5f5f5] overflow-x-hidden relative">
      <motion.div 
        className="absolute inset-0 overflow-hidden pointer-events-none"
      >
        <motion.div 
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-[rgba(255,69,0,0.05)] rounded-full blur-3xl"
          animate={{ 
            scale: [1, 1.1, 1],
            opacity: [0.5, 0.7, 0.5]
          }}
          transition={{ 
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div 
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[rgba(255,69,0,0.05)] rounded-full blur-3xl"
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.5, 0.6, 0.5]
          }}
          transition={{ 
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
        />
      </motion.div>

      <div className="relative z-10 min-h-screen flex items-center justify-center p-8">
        <motion.div 
          className="max-w-4xl w-full"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.div 
            className="bg-gradient-to-br from-[rgba(255,255,255,0.05)] to-[rgba(255,255,255,0.02)] backdrop-blur-md border border-[rgba(255,255,255,0.1)] rounded-2xl p-8 md:p-12 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-[rgba(255,69,0,0.2)] to-transparent rounded-bl-full opacity-50"></div>
            <div className="absolute bottom-0 left-0 w-40 h-40 bg-gradient-to-tr from-[rgba(120,69,255,0.2)] to-transparent rounded-tr-full opacity-50"></div>
            
            <motion.div 
              className="text-center space-y-8 relative z-10"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <motion.h1 
                className="text-4xl md:text-5xl font-bold"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                Hey <span className="text-[#ff4500]">{user.name}</span>,
              </motion.h1>

              <motion.div 
                className="space-y-4"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <h2 className="text-2xl md:text-3xl text-[rgba(255,255,255,0.8)]">
                  your personality is
                </h2>
                <h3 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-[#ff4500] to-[#ff5722] bg-clip-text text-transparent">
                  {topPersonality.name}
                </h3>
              </motion.div>

              <motion.p 
                className="text-xl md:text-2xl text-[rgba(255,255,255,0.7)] max-w-2xl mx-auto"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                {topPersonality.description}
              </motion.p>

              {/* Personality Scores */}
              <motion.div 
                className="mt-12 space-y-4"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.7 }}
              >
                <h4 className="text-xl font-semibold text-[rgba(255,255,255,0.9)] mb-6">
                  Your Personality Breakdown
                </h4>
                <div className="grid gap-4">
                  {sortedScores.map(([type, score], index) => (
                    <motion.div 
                      key={type}
                      className="bg-[rgba(255,255,255,0.05)] rounded-xl p-4"
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.8 + index * 0.1 }}
                    >
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-lg font-medium">{type}</span>
                        <span className="text-[#ff4500] font-semibold">{score}</span>
                      </div>
                      <div className="w-full h-2 bg-[rgba(255,255,255,0.1)] rounded-full overflow-hidden">
                        <motion.div 
                          className="h-full bg-gradient-to-r from-[#ff4500] to-[#ff5722]"
                          initial={{ width: 0 }}
                          animate={{ width: `${Math.max(0, (score + 50))}%` }}
                          transition={{ duration: 1, delay: 0.8 + index * 0.1 }}
                        />
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              <motion.button
                onClick={onRetake}
                className="mt-12 px-12 py-4 text-lg font-semibold rounded-xl bg-gradient-to-r from-[#ff4500] to-[#ff5722] text-white shadow-[0_0_40px_rgba(255,69,0,0.4)] relative overflow-hidden group"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 1 }}
              >
                <span className="relative z-10">RETAKE QUIZ</span>
                <motion.div 
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 -skew-x-12"
                  initial={{ x: "-100%" }}
                  whileHover={{ 
                    x: "100%", 
                    opacity: 0.2,
                    transition: { duration: 0.6 }
                  }}
                />
              </motion.button>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}

export default function QuizPage() {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [questionsLoaded, setQuestionsLoaded] = useState(false);
  const [currentSection, setCurrentSection] = useState("");
  const [progress, setProgress] = useState(0);
  const [sectionProgress, setSectionProgress] = useState({});
  const [hoveredNav, setHoveredNav] = useState(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState(null);
  const [user, setUser] = useState({ name: "Stranger", age: 25, email: "stranger@example.com" });
  const [apiError, setApiError] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const [isClient, setIsClient] = useState(false);
  
  const sectionsRef = useRef([]);
  const progressTrackRef = useRef(null);
  const containerRef = useRef(null);
  const lastScrollY = useRef(0);
  const [trackRotation, setTrackRotation] = useState({ rotateY: 30, rotateX: 10 });
  
  const { scrollYProgress } = useScroll();
  const backgroundY = useTransform(scrollYProgress, [0, 1], [0, -150]);
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 400, damping: 40 });
  
  // Ensure we're on the client side
  useEffect(() => {
    setIsClient(true);
  }, []);
  
  // Detect mobile device
  useEffect(() => {
    if (!isClient) return;
    
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, [isClient]);
  
  // Fetch questions from API
  useEffect(() => {
    if (!isClient) return;
    
    const fetchQuestions = async () => {
      try {
        console.log("🔄 Fetching questions from API...");
        const response = await fetch("https://personalityquizbackend.vercel.app/questions");
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log("✅ Questions fetched:", data);
        
        const questionsWithTotal = data.map(q => ({ ...q, totalQuestions: data.length }));
        setQuestions(questionsWithTotal);
        
        const initialProgress = {};
        data.forEach((_, i) => {
          initialProgress[i] = 0;
        });
        setSectionProgress(initialProgress);
        setQuestionsLoaded(true);
        setApiError(null);
      } catch (error) {
        console.error("❌ Error fetching questions:", error);
        setApiError("Failed to load questions. Please check if the API is running.");
        setQuestionsLoaded(true);
      }
    };

    fetchQuestions();
  }, [isClient]);

  useEffect(() => {
    if (questions.length === 0) return;

    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrollPos = window.scrollY;
          const windowHeight = window.innerHeight;
          const docHeight = document.documentElement.scrollHeight;
          const maxScroll = docHeight - windowHeight;
          const totalProgress = Math.min(100, (scrollPos / maxScroll) * 100);
          setProgress(totalProgress);

          sectionsRef.current.forEach((section, index) => {
            if (!section) return;
            
            const rect = section.getBoundingClientRect();
            const centerVisible = rect.top <= windowHeight / 2 && rect.bottom >= windowHeight / 2;

            if (centerVisible) {
              const questionText = questions[index].question_text;
              setCurrentSection(questionText.length > 40 ? questionText.slice(0, 40) + "..." : questionText);
              
              const scrollStart = scrollPos + rect.top - windowHeight;
              const scrollEnd = scrollStart + rect.height + windowHeight;
              const sectionProg = ((scrollPos - scrollStart) / (scrollEnd - scrollStart)) * 100;
              const clampedProgress = Math.max(0, Math.min(100, sectionProg));
              
              setSectionProgress(prev => {
                const newProgress = { ...prev };
                questions.forEach((_, i) => {
                  if (i === index) {
                    newProgress[i] = clampedProgress;
                  } else if (i < index) {
                    newProgress[i] = 100;
                  } else {
                    newProgress[i] = 0;
                  }
                });
                return newProgress;
              });
            }
          });

          ticking = false;
        });

        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [questions]);

  const selectOption = useCallback((questionId, optionId) => {
    setIsTransitioning(true);
    
    setTimeout(() => {
      setAnswers(prev => ({
        ...prev,
        [questionId]: optionId
      }));
      setIsTransitioning(false);
    }, 100);
  }, []);

  const handleSubmit = async () => {
    if (Object.keys(answers).length !== questions.length) {
      alert("Please answer all questions");
      return;
    }

    setIsSubmitting(true);

    const payload = {
      name: user.name,
      age: Number(user.age),
      email: user.email,
      answers: Object.entries(answers).map(([questionId, optionId]) => ({
        optionId: Number(optionId),
      })),
    };

    console.log("📦 SUBMIT PAYLOAD:", payload);

    try {
      const response = await fetch("https://personalityquizbackend.vercel.app/quiz/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("✅ SUBMIT RESPONSE:", data);
      
      setResult(data);
      setShowResult(true);
    } catch (error) {
      console.error("❌ SUBMIT ERROR:", error);
      alert("Failed to submit quiz. Please check if the API is running and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRetake = () => {
    setShowResult(false);
    setAnswers({});
    setResult(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToQuestion = useCallback((index) => {
    sectionsRef.current[index]?.scrollIntoView({ 
      behavior: "smooth",
      block: "center",
      inline: "nearest"
    });
  }, []);

  const handleMouseMove = (e) => {
    if (!progressTrackRef.current) return;
    const rect = progressTrackRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    setTrackRotation({
      rotateY: 30 + x * 0.02,
      rotateX: 10 + y * -0.02
    });
  };

  const handleMouseLeave = () => {
    setTrackRotation({ rotateY: 30, rotateX: 10 });
  };

  const handleLoaderComplete = () => {
    setIsLoading(false);
  };

  const isActive = useCallback((index) => {
    const questionText = questions[index]?.question_text || "";
    return currentSection.includes(questionText.slice(0, 20));
  }, [currentSection, questions]);

  // Show loader while questions are loading
  if (isLoading || !questionsLoaded) {
    return <ThreeLoader onLoadComplete={handleLoaderComplete} minDuration={1500} />;
  }

  // Show API error
  if (apiError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0a0a0a] via-[#121212] to-[#0a0a0a] text-[#f5f5f5] flex items-center justify-center p-8">
        <div className="max-w-md w-full bg-[rgba(255,255,255,0.05)] backdrop-blur-md border border-[rgba(255,255,255,0.1)] rounded-2xl p-8 text-center">
          <div className="text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold mb-4">Error Loading Questions</h2>
          <p className="text-[rgba(255,255,255,0.7)] mb-6">{apiError}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-8 py-3 bg-gradient-to-r from-[#ff4500] to-[#ff5722] text-white font-semibold rounded-xl hover:scale-105 transition-transform"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Show result loader while submitting
  if (isSubmitting) {
    return <ResultLoader onLoadComplete={() => {}} />;
  }

  // Show result page
  if (showResult && result) {
    return <ResultPage user={user} result={result} onRetake={handleRetake} />;
  }

  if (questions.length === 0) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-[#f5f5f5] flex items-center justify-center">
        <div className="text-2xl">No questions available...</div>
      </div>
    );
  }

  const containerVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.25, 0.1, 0.25, 1],
        staggerChildren: 0.15,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: [0.25, 0.1, 0.25, 1]
      }
    }
  };

  const cardVariants = {
    hidden: { 
      opacity: 0, 
      rotateY: -10, 
      scale: 0.98,
      y: 40,
      filter: "blur(5px)"
    },
    visible: {
      opacity: 1, 
      rotateY: 0, 
      scale: 1,
      y: 0,
      filter: "blur(0px)",
      transition: {
        duration: 0.8,
        ease: [0.25, 0.1, 0.25, 1]
      }
    }
  };

  const optionVariants = {
    hidden: { opacity: 0, x: -20, y: 10 },
    visible: (i) => ({
      opacity: 1, 
      x: 0,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
        ease: [0.25, 0.1, 0.25, 1]
      }
    })
  };

  // Don't render anything until we're on the client
  if (!isClient) {
    return null;
  }

  return (
    <div ref={containerRef} className="min-h-screen bg-gradient-to-br from-[#0a0a0a] via-[#121212] to-[#0a0a0a] text-[#f5f5f5] overflow-x-hidden relative scroll-smooth">
      <motion.div 
        className="absolute inset-0 overflow-hidden pointer-events-none"
        style={{ y: backgroundY }}
      >
        <motion.div 
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-[rgba(255,69,0,0.05)] rounded-full blur-3xl"
          animate={{ 
            scale: [1, 1.1, 1],
            opacity: [0.5, 0.7, 0.5]
          }}
          transition={{ 
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div 
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[rgba(255,69,0,0.05)] rounded-full blur-3xl"
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.5, 0.6, 0.5]
          }}
          transition={{ 
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
        />
        <motion.div 
          className="absolute top-1/2 right-1/3 w-[500px] h-[500px] bg-[rgba(120,69,255,0.05)] rounded-full blur-3xl"
          animate={{ 
            x: [0, 50, 0],
            y: [0, -50, 0]
          }}
          transition={{ 
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </motion.div>

      {/* Mobile Progress Bar - Only visible on mobile */}
      {isMobile && (
        <div className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-b from-black to-transparent p-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-[rgba(255,255,255,0.7)]">
                Question {Math.floor(progress * questions.length / 100) + 1} of {questions.length}
              </span>
              <span className="text-sm text-[#ff4500] font-semibold">
                {Math.round(progress)}%
              </span>
            </div>
            <div className="w-full h-2 bg-[rgba(255,255,255,0.1)] rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-gradient-to-r from-[#ff4500] to-[#ff5722]"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Desktop Progress Navigation - Hidden on mobile */}
      {!isMobile && (
        <div 
          className="fixed left-20 top-1/2 -translate-y-1/2 z-50 hidden lg:block"
          style={{ perspective: "1000px" }}
        >
          <div 
            ref={progressTrackRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className="relative transition-all duration-500 ease-out"
            style={{ 
              transformStyle: "preserve-3d",
              transform: `rotateY(${trackRotation.rotateY}deg) rotateX(${trackRotation.rotateX}deg)`
            }}
          >
            <div 
              className="w-80 p-5 bg-[rgba(255,69,0,0.1)] backdrop-blur-md rounded-xl mb-8 flex items-center justify-between shadow-[0_0_30px_rgba(255,69,0,0.1)]"
              style={{ transform: "translateZ(50px)" }}
            >
              <span className="text-sm font-medium truncate max-w-[140px]">
                {currentSection || "Start"}
              </span>
              <span className="text-[#ff4500] font-semibold text-sm">
                {Math.round(progress)}%
              </span>
            </div>

            <div className="flex flex-col gap-5" style={{ transformStyle: "preserve-3d" }}>
              {questions.map((question, index) => {
                const active = isActive(index);
                const hovered = hoveredNav === index;
                
                return (
                  <div
                    key={question.id}
                    onClick={() => scrollToQuestion(index)}
                    onMouseEnter={() => setHoveredNav(index)}
                    onMouseLeave={() => setHoveredNav(null)}
                    className="relative w-80 h-18 p-5 bg-[rgba(255,255,255,0.03)] rounded-xl cursor-pointer overflow-hidden shadow-[0_0_20px_rgba(0,0,0,0.2)] transition-all duration-300"
                    style={{
                      transformStyle: "preserve-3d",
                      transform: `translateZ(${active ? '30px' : hovered ? '40px' : '0px'})`,
                      background: active ? "rgba(255, 69, 0, 0.1)" : "rgba(255, 255, 255, 0.03)",
                    }}
                  >
                    <div 
                      className="absolute inset-0 bg-[rgba(255,69,0,0.1)]"
                      style={{ 
                        width: `${sectionProgress[index] || 0}%`,
                        transition: "width 0.1s linear"
                      }}
                    />
                    
                    <div className="relative z-10 flex justify-between items-center" style={{ transformStyle: "preserve-3d" }}>
                      <span className={`text-sm font-medium transition-colors duration-300 ${
                        active || hovered ? "text-[#f5f5f5]" : "text-[rgba(255,255,255,0.7)]"
                      }`}>
                        {question.question_text.slice(0, 35)}...
                      </span>
                      <span className={`text-xs text-[#ff4500] transition-opacity duration-300 ${
                        active || hovered ? "opacity-100" : "opacity-0"
                      }`}>
                        {String(index + 1).padStart(2, "0")}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      <div className={`w-full relative z-10 ${isMobile ? 'pt-20' : ''}`}>
        {questions.map((question, index) => (
          <div key={question.id} ref={el => sectionsRef.current[index] = el}>
            <QuestionCard
              question={question}
              index={index}
              answers={answers}
              selectOption={selectOption}
              isTransitioning={isTransitioning}
              sectionProgress={sectionProgress}
              containerVariants={containerVariants}
              itemVariants={itemVariants}
              cardVariants={cardVariants}
              optionVariants={optionVariants}
              isActive={isActive(index)}
              isMobile={isMobile}
            />
          </div>
        ))}

        <div className={`min-h-screen flex items-center justify-center ${isMobile ? 'py-10 px-4' : 'py-20 px-6'}`}>
          <motion.div 
            className="max-w-4xl w-full"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.3 }}
            variants={containerVariants}
          >
            <motion.div 
              className="bg-gradient-to-br from-[rgba(255,255,255,0.05)] to-[rgba(255,255,255,0.02)] backdrop-blur-md border border-[rgba(255,255,255,0.1)] rounded-2xl p-8 md:p-12 text-center shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] relative overflow-hidden"
              variants={cardVariants}
            >
              <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-[rgba(255,69,0,0.2)] to-transparent rounded-bl-full opacity-50"></div>
              <div className="absolute bottom-0 left-0 w-40 h-40 bg-gradient-to-tr from-[rgba(120,69,255,0.2)] to-transparent rounded-tr-full opacity-50"></div>
              
              <motion.h2 
                className={`${isMobile ? 'text-3xl' : 'text-4xl md:text-6xl'} font-bold bg-gradient-to-r from-[#f5f5f5] to-[#ff4500] bg-clip-text text-transparent mb-6`}
                variants={itemVariants}
              >
                Ready to see your results?
              </motion.h2>
              
              <motion.p 
                className={`${isMobile ? 'text-lg' : 'text-xl'} text-[rgba(255,255,255,0.7)] mb-8`}
                variants={itemVariants}
              >
                You've answered {Object.keys(answers).length} of {questions.length} questions
              </motion.p>
              
              <motion.div variants={itemVariants}>
                <motion.button
                  onClick={handleSubmit}
                  disabled={Object.keys(answers).length !== questions.length}
                  className={`${isMobile ? 'px-8 py-3 text-base' : 'px-12 py-4 text-lg'} font-semibold rounded-xl transition-all duration-300 relative overflow-hidden group ${
                    Object.keys(answers).length === questions.length
                      ? "bg-gradient-to-r from-[#ff4500] to-[#ff5722] text-white shadow-[0_0_40px_rgba(255,69,0,0.4)]"
                      : "bg-[rgba(255,255,255,0.1)] text-[rgba(255,255,255,0.3)] cursor-not-allowed"
                  }`}
                  whileHover={Object.keys(answers).length === questions.length ? { scale: 1.05 } : {}}
                  whileTap={Object.keys(answers).length === questions.length ? { scale: 0.98 } : {}}
                >
                  <span className="relative z-10">SUBMIT QUIZ</span>
                  
                  {Object.keys(answers).length === questions.length && (
                    <motion.div 
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 -skew-x-12"
                      initial={{ x: "-100%" }}
                      whileHover={{ 
                        x: "100%", 
                        opacity: 0.2,
                        transition: { duration: 0.6 }
                      }}
                    />
                  )}
                </motion.button>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}