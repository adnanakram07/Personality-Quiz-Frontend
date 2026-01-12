"use client";

import { useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { useQuiz } from "@/context/QuizContext";
import PageTransition from "@/components/PageTransition";
import { motion, AnimatePresence } from "framer-motion";

// TypingText component for the typing effect
const TypingText = ({ text, delay = 0, speed = 100 }) => {
  const [displayedText, setDisplayedText] = useState("");
  const [isTyping, setIsTyping] = useState(true);
  
  useEffect(() => {
    const words = text.split(" ");
    let currentWordIndex = 0;
    let currentCharIndex = 0;
    let currentWord = "";
    
    const typeTimer = setTimeout(() => {
      const typeInterval = setInterval(() => {
        if (currentWordIndex < words.length) {
          if (currentCharIndex < words[currentWordIndex].length) {
            currentWord += words[currentWordIndex][currentCharIndex];
            currentCharIndex++;
            
            // Add the word to displayed text with a space if it's not the last word
            setDisplayedText(
              words.slice(0, currentWordIndex).join(" ") + 
              (currentWordIndex > 0 ? " " : "") + 
              currentWord
            );
          } else {
            // Move to the next word
            currentWordIndex++;
            currentCharIndex = 0;
            currentWord = "";
            
            // Add a space between words
            if (currentWordIndex < words.length) {
              setDisplayedText(words.slice(0, currentWordIndex).join(" ") + " ");
            }
          }
        } else {
          clearInterval(typeInterval);
          setIsTyping(false);
        }
      }, speed);
      
      return () => clearInterval(typeInterval);
    }, delay);
    
    return () => clearTimeout(typeTimer);
  }, [text, delay, speed]);
  
  return (
    <span className={isTyping ? "typing-text" : ""}>
      {displayedText}
      {isTyping && <span className="typing-cursor">|</span>}
    </span>
  );
};

export default function SliceFormSlider({ sliderControls }) {
  const router = useRouter();
  const { user, setUser } = useQuiz();
  const { nextSlide, prevSlide, setValidation, goToSlide, index } = sliderControls;

  const [ageError, setAgeError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [nameShaken, setNameShaken] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const nameRef = useRef(null);
  const ageRef = useRef(null);
  const emailRef = useRef(null);

  // Detect mobile device
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  /* ---------- VALIDATIONS ---------- */

  const validateName = () => {
    if (!user.name?.trim() || user.name === "Stranger") {
      triggerShake(nameRef);
      setNameShaken(true);
      return false;
    }
    return true;
  };

  const validateAge = () => {
    const age = Number(user.age);
    if (!age || age <= 0 || age > 100) {
      setAgeError("Please enter a valid age");
      triggerShake(ageRef);
      return false;
    }
    setAgeError("");
    return true;
  };

  const validateEmail = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(user.email)) {
      setEmailError("Please enter a valid email");
      triggerShake(emailRef);
      return false;
    }
    setEmailError("");
    return true;
  };

  const triggerShake = (ref) => {
    if (!ref.current) return;
    ref.current.classList.remove("shake");
    void ref.current.offsetWidth;
    ref.current.classList.add("shake");
  };

  /* ---------- SET VALIDATION FOR AGE SLIDE ---------- */
  
  useEffect(() => {
    setValidation(() => {
      return () => {
        const age = Number(user.age);
        if (age > 100 || age <= 0 || !age) {
          setAgeError("Please enter a valid age");
          triggerShake(ageRef);
          return false;
        }
        setAgeError("");
        return true;
      };
    });
  }, [user.age, setValidation]);

  /* ---------- NAVIGATE WITH TRANSITION ---------- */

  const navigateToQuiz = () => {
    setIsTransitioning(true);
  };

  const handleTransitionComplete = () => {
    router.push("/quiz");
  };

  /* ---------- HANDLE MOBILE NAVIGATION ---------- */

  useEffect(() => {
    if (isTransitioning && isMobile) {
      const timer = setTimeout(() => {
        handleTransitionComplete();
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [isTransitioning, isMobile]);

  /* ---------- JUMP RIGHT IN ---------- */

  const jumpRightIn = () => {
    setUser({
      name: user.name?.trim() || "Stranger",
      age: user.age || 1,
      email: user.email?.trim() || "stranger@gmail.com",
    });

    navigateToQuiz();
  };



  const blockArrowKeys = (e) => {
    if (["ArrowUp", "ArrowDown"].includes(e.key)) {
      e.preventDefault();
    }
  };


  const handleNameEnter = () => {
    if (validateName()) {
      nextSlide();
    } else if (nameShaken) {
      nextSlide();
    }
  };


  useEffect(() => {
    if (!user.name?.trim()) {
      setUser((prev) => ({ ...prev, name: "Stranger" }));
    }
  }, []);



  const slideVariants = {
    enter: (direction) => ({
      y: direction > 0 ? 100 : -100,
      opacity: 0
    }),
    center: {
      y: 0,
      opacity: 1
    },
    exit: (direction) => ({
      y: direction < 0 ? 100 : -100,
      opacity: 0
    })
  };

  const textVariants = {
    hidden: { y: 100, opacity: 0 },
    visible: (i) => ({
      y: 0,
      opacity: 1,
      transition: {
        delay: i * 0.1,
        duration: 0.8,
        ease: [0.6, 0.05, 0.01, 0.9]
      }
    })
  };

  const inputVariants = {
    hidden: { width: 0, opacity: 0 },
    visible: {
      width: "100%",
      opacity: 1,
      transition: {
        delay: 0.3,
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  return (
    <>
      <main className="slides">

        {/* SLIDE 1 — NAME */}
        <AnimatePresence mode="wait">
          {index === 0 && (
            <motion.section
              key="name-slide"
              className="slide is-active"
              initial="enter"
              animate="center"
              exit="exit"
              variants={slideVariants}
              custom={1}
              transition={{ duration: 0.6, ease: [0.6, 0.05, 0.01, 0.9] }}
            >
              <div className="slide__content">
                <header className="slide__header">
                  <h2 className="slide__title">
                    <div className="title-line">
                      <motion.span
                        custom={0}
                        initial="hidden"
                        animate="visible"
                        variants={textVariants}
                      >
                        <TypingText text="What's your name?" delay={300} speed={80} />
                      </motion.span>
                    </div>
                    <div className="title-line">
                      <motion.span
                        initial="hidden"
                        animate="visible"
                        variants={inputVariants}
                      >
                        <input
                          ref={nameRef}
                          className="slice-input"
                          placeholder="Enter your name"
                          autoFocus
                          value={user.name === "Stranger" ? "" : user.name}
                          onChange={(e) =>
                            setUser({ ...user, name: e.target.value })
                          }
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              handleNameEnter();
                            }
                          }}
                        />
                      </motion.span>
                    </div>
                  </h2>

                  <motion.span
                    className="jump-hint clickable"
                    onClick={jumpRightIn}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6, duration: 0.5 }}
                  >
                    Jump right in.
                  </motion.span>
                  
                  {isMobile && (
                    <motion.button
                      className="mobile-next-btn"
                      onClick={handleNameEnter}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.7, duration: 0.5 }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Next
                    </motion.button>
                  )}
                </header>
              </div>
            </motion.section>
          )}
        </AnimatePresence>

        {/* SLIDE 2 — AGE */}
        <AnimatePresence mode="wait">
          {index === 1 && (
            <motion.section
              key="age-slide"
              className="slide is-active"
              initial="enter"
              animate="center"
              exit="exit"
              variants={slideVariants}
              custom={1}
              transition={{ duration: 0.6, ease: [0.6, 0.05, 0.01, 0.9] }}
            >
              <div className="slide__content">
                <header className="slide__header">
                  <h2 className="slide__title">
                    <div className="title-line">
                      <motion.span
                        custom={0}
                        initial="hidden"
                        animate="visible"
                        variants={textVariants}
                      >
                        <TypingText text="How old are you?" delay={300} speed={80} />
                      </motion.span>
                    </div>
                    <div className="title-line">
                      <motion.span
                        initial="hidden"
                        animate="visible"
                        variants={inputVariants}
                      >
                        <input
                          ref={ageRef}
                          className="slice-input"
                          type="number"
                          placeholder="Enter your age"
                          value={user.age}
                          onWheel={(e) => e.target.blur()}
                          onKeyDown={(e) => {
                            blockArrowKeys(e);
                            if (e.key === "Enter") {
                              if (validateAge()) {
                                nextSlide();
                              } else {
                                triggerShake(ageRef);
                              }
                            }
                          }}
                          onChange={(e) => {
                            const value = e.target.value;
                            setUser({ ...user, age: value });
                            
                            if (Number(value) > 100) {
                              setAgeError("Please enter a valid age");
                            } else {
                              setAgeError("");
                            }
                          }}
                        />
                      </motion.span>
                    </div>
                  </h2>

                  <AnimatePresence mode="wait">
                    {ageError ? (
                      <motion.p
                        key="age-error"
                        className="validation-error"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3 }}
                      >
                        {ageError}
                      </motion.p>
                    ) : (
                      <motion.span
                        key="age-hint"
                        className="jump-hint clickable"
                        onClick={jumpRightIn}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ delay: 0.6, duration: 0.5 }}
                      >
                        Jump right in.
                      </motion.span>
                    )}
                  </AnimatePresence>
                  
                  {isMobile && (
                    <motion.button
                      className="mobile-next-btn"
                      onClick={() => {
                        if (validateAge()) {
                          nextSlide();
                        } else {
                          triggerShake(ageRef);
                        }
                      }}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.7, duration: 0.5 }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Next
                    </motion.button>
                  )}
                </header>
              </div>
            </motion.section>
          )}
        </AnimatePresence>

        {/* SLIDE 3 — EMAIL */}
        <AnimatePresence mode="wait">
          {index === 2 && (
            <motion.section
              key="email-slide"
              className="slide is-active"
              initial="enter"
              animate="center"
              exit="exit"
              variants={slideVariants}
              custom={1}
              transition={{ duration: 0.6, ease: [0.6, 0.05, 0.01, 0.9] }}
            >
              <div className="slide__content">
                <header className="slide__header">
                  <h2 className="slide__title">
                    <div className="title-line">
                      <motion.span
                        custom={0}
                        initial="hidden"
                        animate="visible"
                        variants={textVariants}
                      >
                        <TypingText text="What is your email?" delay={300} speed={80} />
                      </motion.span>
                    </div>
                    <div className="title-line">
                      <motion.span
                        initial="hidden"
                        animate="visible"
                        variants={inputVariants}
                      >
                        <input
                          ref={emailRef}
                          className="slice-input"
                          type="email"
                          placeholder="Enter your email"
                          value={user.email}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" && validateEmail()) {
                              navigateToQuiz();
                            }
                          }}
                          onChange={(e) => {
                            setUser({ ...user, email: e.target.value });
                            setEmailError("");
                          }}
                        />
                      </motion.span>
                    </div>
                  </h2>

                  <AnimatePresence mode="wait">
                    {emailError ? (
                      <motion.p
                        key="email-error"
                        className="validation-error"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3 }}
                      >
                        {emailError}
                      </motion.p>
                    ) : (
                      <motion.span
                        key="email-hint"
                        className="jump-hint clickable"
                        onClick={jumpRightIn}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ delay: 0.6, duration: 0.5 }}
                      >
                        Jump right in.
                      </motion.span>
                    )}
                  </AnimatePresence>

                  <motion.button
                    className="continue-btn"
                    onClick={() => {
                      const age = Number(user.age);
                      const ageValid = age > 0 && age <= 100;
                      const emailValid = validateEmail();
                      
                      if (!ageValid) {
                        setAgeError("Please enter a valid age");
                        goToSlide(1);
                        setTimeout(() => {
                          ageRef.current?.focus();
                          triggerShake(ageRef);
                        }, 950);
                      } else if (emailValid) {
                        navigateToQuiz();
                      }
                    }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8, duration: 0.5 }}
                    whileHover={{ scale: 1.05, backgroundColor: "#f2f2f2", color: "#000" }}
                    whileTap={{ scale: 0.95 }}
                  >
                    CONTINUE
                  </motion.button>
                </header>
              </div>
            </motion.section>
          )}
        </AnimatePresence>

      </main>

      {isMobile ? (
        <div className={`simple-loader ${isTransitioning ? 'active' : ''}`}></div>
      ) : (
        <PageTransition 
          isTransitioning={isTransitioning}
          onTransitionComplete={handleTransitionComplete}
        />
      )}
    </>
  );
}