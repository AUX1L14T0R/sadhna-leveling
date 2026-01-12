import { useEffect } from "react";
import { motion, useMotionValue, useMotionTemplate } from "framer-motion";

export default function SystemBackground() {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  useEffect(() => {
    const handleMove = (e) => {
      const x = e.touches ? e.touches[0].clientX : e.clientX;
      const y = e.touches ? e.touches[0].clientY : e.clientY;
      mouseX.set(x);
      mouseY.set(y);
    };

    window.addEventListener("mousemove", handleMove);
    window.addEventListener("touchmove", handleMove, { passive: true });

    return () => {
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("touchmove", handleMove);
    };
  }, [mouseX, mouseY]);

  /* 🎯 LAYER 1 — CURSOR AURA */
  const spotlight = useMotionTemplate`
    radial-gradient(
      500px circle at ${mouseX}px ${mouseY}px,
      rgba(34,211,238,0.18),
      transparent 75%
    )
  `;

  return (
    <div className="fixed inset-0 z-[-1] pointer-events-none overflow-hidden bg-[#020617]">

      {/* 🌊 LAYER 2 — AMBIENT GRADIENT FLOW */}
      <motion.div
        className="absolute inset-0"
        animate={{ backgroundPosition: ["0% 0%", "100% 100%"] }}
        transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
        style={{
          backgroundImage: `
            radial-gradient(circle at 20% 20%, rgba(6,182,212,0.08), transparent 40%),
            radial-gradient(circle at 80% 30%, rgba(56,189,248,0.06), transparent 45%),
            radial-gradient(circle at 50% 80%, rgba(14,165,233,0.05), transparent 40%)
          `,
          backgroundSize: "200% 200%",
        }}
      />

      {/* 🔦 LAYER 3 — INTERACTIVE SPOTLIGHT */}
      <motion.div
        className="absolute inset-0"
        style={{ background: spotlight }}
      />

      {/* 🧬 LAYER 4 — PERSPECTIVE GRID */}
      <div
        className="absolute inset-0 opacity-[0.18]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(0,240,255,0.15) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,240,255,0.15) 1px, transparent 1px)
          `,
          backgroundSize: "40px 40px",
          transform: "perspective(1000px) rotateX(60deg) scale(2.4)",
          transformOrigin: "center bottom",
          animation: "gridMove 10s linear infinite",
        }}
      />

      {/* ✨ LAYER 5 — FLOATING PARTICLES */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(18)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 rounded-full bg-cyan-400/70 blur-[1px]"
            initial={{
              x: `${Math.random() * 100}%`,
              y: `${100 + Math.random() * 50}%`,
              opacity: 0,
            }}
            animate={{
              y: "-10%",
              opacity: [0, 0.6, 0],
            }}
            transition={{
              duration: 10 + Math.random() * 8,
              repeat: Infinity,
              delay: Math.random() * 6,
              ease: "linear",
            }}
          />
        ))}
      </div>

      {/* 🎞 GRID ANIMATION */}
      <style>{`
        @keyframes gridMove {
          from { background-position: 0 0; }
          to { background-position: 0 40px; }
        }
      `}</style>
    </div>
  );
}
