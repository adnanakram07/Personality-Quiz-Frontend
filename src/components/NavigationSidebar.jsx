"use client";

import { useState, useEffect } from "react";

export default function NavigationSidebar() {
  const [hoveredItem, setHoveredItem] = useState(null);
  const [clickedItem, setClickedItem] = useState(null);
  const [isMobile, setIsMobile] = useState(false);

  
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024); 
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const items = [
    { 
      name: "ABOUT", 
      title: "About Us",
      content: "Paradox is a personal development platform that helps individuals build essential power skills like confidence, productivity, and leadership through science-backed programs."
    },
    { 
      name: "QUIZ", 
      title: "Personality Quiz",
      content: "Discover your unique personality type through our innovative quiz experience. Unlock insights about your strengths and potential."
    },
    { 
      name: "WorkFlow", 
      title: "How It Works",
      content: "Answer a few questions and get matched to the personality type that fits you best using smart scoring."
    }
  ];

  const handleItemClick = (index) => {
    if (isMobile) {
      
      setClickedItem(clickedItem === index ? null : index);
    }
  };

  const handleItemHover = (index) => {
    if (!isMobile) {
      setHoveredItem(index);
    }
  };

  const handleItemLeave = () => {
    if (!isMobile) {
      setHoveredItem(null);
    }
  };

  const activeItem = isMobile ? clickedItem : hoveredItem;

  return (
    <>
      <nav className="h-full flex items-center justify-center relative">
        <ul className="flex flex-col items-center justify-center gap-20 rotate-180">
          {items.map((item, index) => (
            <li
              key={item.name}
              className="rotate-90 text-xs tracking-widest text-gray-400 cursor-pointer transition-all duration-200 hover:line-through hover:text-white relative"
              onMouseEnter={() => handleItemHover(index)}
              onMouseLeave={handleItemLeave}
              onClick={() => handleItemClick(index)}
            >
              {item.name}
              
              {activeItem === index && !isMobile && (
                <div 
                  className="fixed pointer-events-none"
                  style={{
                    top: '-1000%',
                    left: '10px',
                    transform: 'translateY(-50%) rotate(90deg)',
                    transformOrigin: 'center center',
                    zIndex: 100
                  }}
                >
                  <div
                    className="animate-fade-in"
                    style={{
                      background: 'rgba(255, 255, 255, 0.03)',
                      backdropFilter: 'blur(20px)',
                      WebkitBackdropFilter: 'blur(20px)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '12px',
                      padding: '2rem',
                      width: '350px',
                      height: 'auto',
                      minHeight: '200px',
                      maxHeight: '400px',
                      boxShadow: '0 0 30px rgba(255, 255, 255, 0.1), inset 0 0 20px rgba(255, 255, 255, 0.02)',
                      animation: 'glow 2s ease-in-out infinite alternate',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center'
                    }}
                  >
                    <h3 
                      className="text-white font-semibold mb-4 tracking-wide"
                      style={{
                        fontFamily: "'Orbitron', sans-serif",
                        fontSize: '1.2rem',
                        letterSpacing: '0.1em'
                      }}
                    >
                      {item.title}
                    </h3>
                    <p 
                      className="text-gray-300 leading-relaxed"
                      style={{
                        fontSize: '0.9rem',
                        lineHeight: '1.7'
                      }}
                    >
                      {item.content}
                    </p>
                    
                    <div style={{
                      position: 'absolute',
                      top: '8px',
                      right: '8px',
                      width: '20px',
                      height: '20px',
                      borderTop: '2px solid rgba(255, 255, 255, 0.3)',
                      borderRight: '2px solid rgba(255, 255, 255, 0.3)',
                    }} />
                    <div style={{
                      position: 'absolute',
                      bottom: '8px',
                      left: '8px',
                      width: '20px',
                      height: '20px',
                      borderBottom: '2px solid rgba(255, 255, 255, 0.3)',
                      borderLeft: '2px solid rgba(255, 255, 255, 0.3)',
                    }} />
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>

        <style jsx>{`
          @keyframes glow {
            0% {
              box-shadow: 0 0 20px rgba(255, 255, 255, 0.1), 
                          inset 0 0 20px rgba(255, 255, 255, 0.02),
                          0 0 40px rgba(150, 150, 255, 0.1);
            }
            100% {
              box-shadow: 0 0 30px rgba(255, 255, 255, 0.2), 
                          inset 0 0 30px rgba(255, 255, 255, 0.05),
                          0 0 60px rgba(150, 150, 255, 0.2);
            }
          }

          @keyframes fade-in {
            from {
              opacity: 0;
              transform: translateY(-50%) translateX(20px) rotate(90deg);
            }
            to {
              opacity: 1;
              transform: translateY(-50%) translateX(0) rotate(90deg);
            }
          }

          .animate-fade-in {
            animation: fade-in 0.3s cubic-bezier(0.4, 0, 0.2, 1) forwards;
          }
        `}</style>
      </nav>

      
      {isMobile && clickedItem !== null && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4"
          style={{ zIndex: 1000 }}
          onClick={() => setClickedItem(null)}
        >
          <div
            className="animate-fade-in-mobile"
            style={{
              background: 'rgba(255, 255, 255, 0.03)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '12px',
              padding: '2rem',
              width: '100%',
              maxWidth: '350px',
              boxShadow: '0 0 30px rgba(255, 255, 255, 0.1), inset 0 0 20px rgba(255, 255, 255, 0.02)',
              animation: 'glow 2s ease-in-out infinite alternate',
              position: 'relative'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-4 right-4 text-white text-2xl font-light hover:text-gray-300 transition-colors"
              onClick={() => setClickedItem(null)}
            >
              ×
            </button>
            
            <h3 
              className="text-white font-semibold mb-4 tracking-wide pr-8"
              style={{
                fontFamily: "'Orbitron', sans-serif",
                fontSize: '1.2rem',
                letterSpacing: '0.1em'
              }}
            >
              {items[clickedItem].title}
            </h3>
            <p 
              className="text-gray-300 leading-relaxed"
              style={{
                fontSize: '0.9rem',
                lineHeight: '1.7'
              }}
            >
              {items[clickedItem].content}
            </p>
            
            <div style={{
              position: 'absolute',
              top: '8px',
              right: '8px',
              width: '20px',
              height: '20px',
              borderTop: '2px solid rgba(255, 255, 255, 0.3)',
              borderRight: '2px solid rgba(255, 255, 255, 0.3)',
            }} />
            <div style={{
              position: 'absolute',
              bottom: '8px',
              left: '8px',
              width: '20px',
              height: '20px',
              borderBottom: '2px solid rgba(255, 255, 255, 0.3)',
              borderLeft: '2px solid rgba(255, 255, 255, 0.3)',
            }} />
          </div>

          <style jsx>{`
            @keyframes fade-in-mobile {
              from {
                opacity: 0;
                transform: scale(0.9);
              }
              to {
                opacity: 1;
                transform: scale(1);
              }
            }

            .animate-fade-in-mobile {
              animation: fade-in-mobile 0.3s cubic-bezier(0.4, 0, 0.2, 1) forwards;
            }
          `}</style>
        </div>
      )}
    </>
  );
}