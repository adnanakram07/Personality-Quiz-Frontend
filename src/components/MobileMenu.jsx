"use client";

import { useState } from "react";

const MENU_ITEMS = ["ABOUT", "DETAILS", "QUIZ", "RESULT", "CONTACT"];

export default function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false);

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
            {MENU_ITEMS.map((item) => (
              <li
                key={item}
                className="text-sm tracking-[0.3em] text-gray-200 cursor-pointer transition-all duration-300 hover:text-white hover:tracking-[0.4em] py-2"
                onClick={() => setIsOpen(false)}
              >
                {item}
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </>
  );
}
