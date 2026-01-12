"use client";

export default function BrandTags() {
  return (
    <>
     
      <div className="fixed top-4 left-4 sm:top-6 sm:left-6 lg:top-8 lg:left-8 z-50">
        <div className="relative w-16 h-16 sm:w-20 sm:h-20 lg:w-28 lg:h-28 animate-spin-slow">
          <svg className="w-full h-full" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="48" fill="none" stroke="white" strokeWidth="0.5" />
            <circle cx="50" cy="50" r="38" fill="none" stroke="white" strokeWidth="0.5" />
            
            <defs>
              <path id="circlePath" d="M 50, 50 m -42, 0 a 42,42 0 1,1 84,0 a 42,42 0 1,1 -84,0" />
            </defs>
            
            <text className="text-[6px] fill-white tracking-widest" style={{ fontFamily: 'Orbitron, Arial, sans-serif' }}>
              <textPath href="#circlePath" startOffset="0%">
                PARADOX • PERSONALITY • QUIZ •  
              </textPath>
            </text>
            
            <g transform="translate(50, 50)">
              <circle cx="0" cy="0" r="3" fill="white" />
              <circle cx="0" cy="-12" r="2" fill="white" />
              <circle cx="12" cy="0" r="2" fill="white" />
              <circle cx="0" cy="12" r="2" fill="white" />
              <circle cx="-12" cy="0" r="2" fill="white" />
              <circle cx="8" cy="-8" r="1.5" fill="white" />
              <circle cx="8" cy="8" r="1.5" fill="white" />
              <circle cx="-8" cy="8" r="1.5" fill="white" />
              <circle cx="-8" cy="-8" r="1.5" fill="white" />
            </g>
          </svg>
        </div>
      </div>

      
      <div className="fixed left-0 z-50" style={{ bottom: '20%' }}>
        <div 
          className="bg-white text-black"
          style={{
            writingMode: 'vertical-rl',
            textOrientation: 'mixed',
            fontFamily: "'Orbitron', sans-serif",
            fontSize: 'clamp(10px, 2vw, 14px)',
            fontWeight: '800',
            letterSpacing: '0.15em',
            width: 'clamp(28px, 5vw, 48px)',
            padding: 'clamp(1rem, 3vw, 2rem) clamp(0.5rem, 1vw, 0.75rem)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <span style={{ transform: 'rotate(180deg)' }}>PARADOX</span>
        </div>
      </div>

      
      <style jsx global>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 20s linear infinite;
        }
      `}</style>
    </>
  );
}