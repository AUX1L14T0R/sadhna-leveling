import { useEffect } from "react";
import { motion, useMotionValue, useMotionTemplate } from "framer-motion";

export default function SystemBackground() {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  useEffect(() => {
    const handleMouseMove = ({ clientX, clientY }) => {
      mouseX.set(clientX);
      mouseY.set(clientY);
    };
    
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  // Dynamic flashlight effect
  const background = useMotionTemplate`radial-gradient(600px circle at ${mouseX}px ${mouseY}px, rgba(34, 211, 238, 0.15), transparent 80%)`;

  return (
    <div className="fixed inset-0 z-0 overflow-hidden bg-[#020617]">
      {/* 1. MOUSE FLASHLIGHT */}
      <motion.div 
        className="absolute inset-0 z-0 opacity-100 pointer-events-none"
        style={{ background }}
      />
      
      {/* 2. INFINITE MOVING GRID */}
      <div 
        className="absolute inset-0 opacity-30 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(0, 240, 255, 0.15) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 240, 255, 0.15) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
          transform: 'perspective(500px) rotateX(60deg) translateY(-100px) scale(3)',
          animation: 'gridMove 4s linear infinite'
        }}
      />

      {/* 3. FLOATING PARTICLES */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={`p-${i}`}
            initial={{ 
              y: Math.random() * window.innerHeight, 
              x: Math.random() * window.innerWidth,
              opacity: 0 
            }}
            animate={{ 
              y: [null, Math.random() * -100], 
              opacity: [0, 0.8, 0] 
            }}
            transition={{ 
              duration: Math.random() * 5 + 5, 
              repeat: Infinity,
              ease: "linear",
              delay: Math.random() * 5
            }}
            className="absolute w-1 h-1 bg-cyan-400 rounded-full blur-[1px]"
          />
        ))}
      </div>

      <style>{`
        @keyframes gridMove {
          0% { background-position: 0 0; }
          100% { background-position: 0 40px; }
        }
      `}</style>
    </div>
  );
}