"use client";

import { useState } from "react";

const MENU_ITEMS = [
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

export default function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const handleItemClick = (index) => {
    setSelectedItem(index);
  };

  return (
    <>
      {/* Hamburger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-6 right-6 z-50 flex flex-col justify-center items-center w-10 h-10 lg:hidden"
        aria-label="Toggle menu"
      >
        <span
          className={`block w-6 h-0.5 bg-white transition-all duration-300 ${
            isOpen ? "rotate-45 translate-y-1.5" : ""
          }`}
        />
        <span
          className={`block w-6 h-0.5 bg-white my-1 transition-all duration-300 ${
            isOpen ? "opacity-0" : ""
          }`}
        />
        <span
          className={`block w-6 h-0.5 bg-white transition-all duration-300 ${
            isOpen ? "-rotate-45 -translate-y-1.5" : ""
          }`}
        />
      </button>

      {/* Menu Overlay - slides from top */}
      <div
        className={`fixed inset-x-0 top-0 z-40 lg:hidden transition-all duration-500 ease-out ${
          isOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
      >
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        />

        {/* Menu Panel - Top sliding with glassmorphism */}
        <nav
          className={`relative w-full transition-all duration-500 ease-out ${
            isOpen ? "translate-y-0" : "-translate-y-full"
          }`}
          style={{
            background: "linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            borderBottom: "1px solid rgba(255,255,255,0.15)",
            boxShadow: "0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.1)",
          }}
        >
          <ul className="flex flex-col items-center py-20 gap-6">
            {MENU_ITEMS.map((item, index) => (
              <li
                key={item.name}
                className="text-sm tracking-[0.3em] text-gray-200 cursor-pointer transition-all duration-300 hover:text-white hover:tracking-[0.4em] py-2"
                onClick={() => handleItemClick(index)}
              >
                {item.name}
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* Card Modal */}
      {selectedItem !== null && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          onClick={() => setSelectedItem(null)}
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
              onClick={() => setSelectedItem(null)}
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
              {MENU_ITEMS[selectedItem].title}
            </h3>
            <p 
              className="text-gray-300 leading-relaxed"
              style={{
                fontSize: '0.9rem',
                lineHeight: '1.7'
              }}
            >
              {MENU_ITEMS[selectedItem].content}
            </p>
            
            {/* Corner Decorations */}
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