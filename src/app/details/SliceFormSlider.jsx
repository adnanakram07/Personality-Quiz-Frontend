"use client";

import { useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { useQuiz } from "@/context/QuizContext";
import PageTransition from "@/components/PageTransition";

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
    // On mobile, wait for a brief animation then navigate
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

  /* ---------- BLOCK NUMBER ARROWS ---------- */

  const blockArrowKeys = (e) => {
    if (["ArrowUp", "ArrowDown"].includes(e.key)) {
      e.preventDefault();
    }
  };

  /* ---------- HANDLE NAME ENTER ---------- */

  const handleNameEnter = () => {
    if (validateName()) {
      nextSlide();
    } else if (nameShaken) {
      // If already shaken once, allow moving forward
      nextSlide();
    }
  };

  /* ---------- DEFAULT NAME ---------- */

  useEffect(() => {
    if (!user.name?.trim()) {
      setUser((prev) => ({ ...prev, name: "Stranger" }));
    }
  }, []);

  return (
    <>
      <main className="slides">

        {/* SLIDE 1 — NAME */}
        <section className={`slide ${index === 0 ? 'is-active' : ''}`}>
          <div className="slide__content">
            <header className="slide__header">
              <h2 className="slide__title">
                <span className="title-line"><span>Name,</span></span>
                <span className="title-line">
                  <span>
                    <input
                      ref={nameRef}
                      className="slice-input"
                      placeholder="Type here"
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
                  </span>
                </span>
              </h2>

              <span className="jump-hint clickable" onClick={jumpRightIn}>
                Jump right in.
              </span>
              
              {/* Mobile Next Button */}
              {isMobile && (
                <button 
                  className="mobile-next-btn"
                  onClick={handleNameEnter}
                >
                  Next
                </button>
              )}
            </header>
          </div>
        </section>

        {/* SLIDE 2 — AGE */}
        <section className={`slide ${index === 1 ? 'is-active' : ''}`}>
          <div className="slide__content">
            <header className="slide__header">
              <h2 className="slide__title">
                <span className="title-line"><span>Age,</span></span>
                <span className="title-line">
                  <span>
                    <input
                      ref={ageRef}
                      className="slice-input"
                      type="number"
                      placeholder="Type here"
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
                  </span>
                </span>
              </h2>

              {ageError ? (
                <p className="validation-error">{ageError}</p>
              ) : (
                <span className="jump-hint clickable" onClick={jumpRightIn}>
                  Jump right in.
                </span>
              )}
              
              {/* Mobile Next Button */}
              {isMobile && (
                <button 
                  className="mobile-next-btn"
                  onClick={() => {
                    if (validateAge()) {
                      nextSlide();
                    } else {
                      triggerShake(ageRef);
                    }
                  }}
                >
                  Next
                </button>
              )}
            </header>
          </div>
        </section>

        {/* SLIDE 3 — EMAIL */}
        <section className={`slide ${index === 2 ? 'is-active' : ''}`}>
          <div className="slide__content">
            <header className="slide__header">
              <h2 className="slide__title">
                <span className="title-line"><span>Email,</span></span>
                <span className="title-line">
                  <span>
                    <input
                      ref={emailRef}
                      className="slice-input"
                      type="email"
                      placeholder="Type here"
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
                  </span>
                </span>
              </h2>

              {emailError ? (
                <p className="validation-error">{emailError}</p>
              ) : (
                <span className="jump-hint clickable" onClick={jumpRightIn}>
                  Jump right in.
                </span>
              )}

              <button
                className="continue-btn"
                onClick={() => {
                  console.log("Continue clicked, current age:", user.age);
                  
                  // First validate age
                  const age = Number(user.age);
                  const ageValid = age > 0 && age <= 100;
                  const emailValid = validateEmail();
                  
                  console.log("Age valid:", ageValid, "Email valid:", emailValid);
                  
                  if (!ageValid) {
                    console.log("Age invalid, going back to age slide");
                    setAgeError("Please enter a valid age");
                    // Go back to age slide (index 1)
                    goToSlide(1);
                    setTimeout(() => {
                      ageRef.current?.focus();
                      triggerShake(ageRef);
                    }, 950);
                  } else if (emailValid) {
                    console.log("All valid, navigating to quiz");
                    navigateToQuiz();
                  }
                }}
              >
                CONTINUE
              </button>
            </header>
          </div>
        </section>

      </main>

      {/* Page Transition - Simple version for mobile */}
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