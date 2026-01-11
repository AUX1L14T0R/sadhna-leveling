import { useState } from "react";
import { motion } from "framer-motion";
import { nectarQualities } from "../data/nectarData";
import { useGame } from "../context/GameContext";
import { Check } from "lucide-react";
import DecryptText from "../components/DecryptText";

export default function QualitiesPage() {
  const { addPoints } = useGame();
  const [checked, setChecked] = useState({});

  const toggle = (id, points) => {
    const isNowChecked = !checked[id];
    setChecked((p) => ({ ...p, [id]: isNowChecked }));
    addPoints(isNowChecked ? points : -points);
  };

  const getTypeLabel = (type) => {
    switch(type) {
      case "control": return "CTRL";
      case "avoid": return "AVOID";
      case "adopt": return "ADOPT";
      case "exchange": return "EXCH";
      default: return "MISC";
    }
  };

  return (
    <div className="max-w-xl mx-auto px-5 pt-12 pb-32 bg-gradient-to-b from-black via-slate-900 to-black min-h-screen text-white">
      
      {/* HEADER */}
      <div className="mb-10 pl-4 border-l-4 border-cyan-500">
        <h1 className="text-4xl font-bold tracking-widest text-cyan-400 text-glow animate-fade-in">
          ATTRIBUTES
        </h1>
        <p className="text-cyan-500 text-xs tracking-[0.3em] mt-1 font-mono">
          <DecryptText text="PASSIVE SKILLS DATABASE" />
        </p>
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto rounded-xl shadow-lg border border-cyan-900 bg-gradient-to-tr from-black/60 to-slate-900/60 backdrop-blur-sm">
        <table className="w-full sys-table border-collapse">
          <thead>
            <tr className="text-slate-500 text-[10px] font-mono tracking-widest uppercase border-b border-cyan-800">
              <th className="w-10 py-2">ID</th>
              <th className="w-16">TYPE</th>
              <th>SKILL NAME</th>
              <th className="w-16 text-right">RWD</th>
              <th className="w-12 text-center">✔</th>
            </tr>
          </thead>
          <tbody>
            {nectarQualities.map((q, i) => {
              const isActive = checked[q.id];
              return (
                <motion.tr
                  key={q.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.03, type: "spring", stiffness: 80 }}
                  onClick={() => toggle(q.id, q.points)}
                  className={`cursor-pointer group transition-all duration-300 rounded-lg
                    ${isActive 
                      ? "bg-cyan-900/40 shadow-neon-glow" 
                      : "hover:bg-slate-800/40 hover:scale-105"}`
                  }
                >
                  {/* ID */}
                  <td className="font-mono text-slate-400 text-[10px] pl-2">
                    {String(i + 1).padStart(2, "0")}
                  </td>

                  {/* TYPE */}
                  <td className="font-mono text-[10px] text-cyan-400 tracking-wider">
                    [{getTypeLabel(q.type)}]
                  </td>

                  {/* NAME */}
                  <td>
                    <div className={`font-semibold transition-all duration-300 
                      ${isActive 
                        ? "text-cyan-400 text-glow animate-pulse pl-2" 
                        : "text-slate-300 group-hover:text-cyan-300"}`
                    }>
                      {q.text}
                    </div>
                  </td>

                  {/* POINTS */}
                  <td className="text-right font-mono text-[10px] text-slate-500 pr-2">
                    +{q.points}
                  </td>

                  {/* CHECKBOX */}
                  <td className="text-center align-middle">
                    <motion.div
                      className={`mx-auto w-5 h-5 border flex items-center justify-center rounded-md
                        ${isActive
                          ? "border-cyan-400 bg-cyan-400/20 shadow-[0_0_12px_rgba(34,211,238,0.6)]" 
                          : "border-slate-700 group-hover:border-cyan-400"}`
                      }
                      whileTap={{ scale: 0.9 }}
                      initial={{ scale: 0 }}
                      animate={{ scale: isActive ? 1 : 0 }}
                      transition={{ type: "spring", stiffness: 200, damping: 20 }}
                    >
                      {isActive && <Check size={14} className="text-cyan-400" />}
                    </motion.div>
                  </td>
                </motion.tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
