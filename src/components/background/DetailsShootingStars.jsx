// "use client";

// import { useEffect } from "react";
// import gsap from "gsap";

// export default function DetailsShootingStars() {
//   useEffect(() => {
//     gsap.to(".shooting-star", {
//       opacity: 0,
//       repeat: -1,
//       duration: 1,
//       ease: "none",
//     });

//     gsap.to(".pos-1", { x: 500, y: 400, repeat: -1, duration: 1 });
//     gsap.to(".pos-2", { x: 250, y: 700, repeat: -1, delay: 2, duration: 1 });
//     gsap.to(".pos-3", { x: -500, y: 600, repeat: -1, duration: 1 });
//     gsap.to(".pos-4", { y: 200, repeat: -1, duration: 1 });
//     gsap.to(".pos-5", { y: 500, repeat: -1, duration: 1 });
//     gsap.to(".pos-6", { y: 300, repeat: -1, duration: 1 });
//     gsap.to(".pos-7", {
//       y: 300,
//       repeat: -1,
//       yoyo: true,
//       duration: 0.5,
//     });
//   }, []);

//   return (
//     <div className="shooting-stars-wrapper">
//       {Array.from({ length: 7 }).map((_, i) => (
//         <div
//           key={i}
//           className={`shooting-star pos-${i + 1}`}
//         />
//       ))}
//     </div>
//   );
// }
