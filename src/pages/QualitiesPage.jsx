import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { nectarQualities } from "../data/nectarData";
import { useGame } from "../context/GameContext";
import { Check, Lock } from "lucide-react";
import DecryptText from "../components/DecryptText";

export default function QualitiesPage() {
  const { addPoints } = useGame();

  /* LOAD DAILY STATE */
  const [checkedState, setCheckedState] = useState(() => {
    const saved = localStorage.getItem("daily_qualities");
    if (saved) {
      const { date, items } = JSON.parse(saved);
      const today = new Date().toLocaleDateString();
      if (date === today) return items;
    }
    return {};
  });

  /* SAVE DAILY STATE */
  useEffect(() => {
    const today = new Date().toLocaleDateString();
    localStorage.setItem(
      "daily_qualities",
      JSON.stringify({ date: today, items: checkedState })
    );
  }, [checkedState]);

  const toggle = (id, points) => {
    const next = !checkedState[id];
    setCheckedState(prev => ({ ...prev, [id]: next }));
    addPoints(next ? points : -points);
  };

  const getTypeLabel = (type) => {
    switch (type) {
      case "control": return "CTRL";
      case "avoid": return "AVOID";
      case "adopt": return "ADOPT";
      case "exchange": return "EXCH";
      default: return "MISC";
    }
  };

  return (
    <div className="flex flex-col h-full min-h-0 max-w-xl mx-auto">
      <div className="flex-1 overflow-y-auto pt-8 pb-24 px-5 scrollbar-cyan">

        {/* HEADER */}
        <div className="mb-10 pl-4 border-l-4 border-[#38bdf8]">
          <h1 className="text-4xl font-bold tracking-widest text-[#7dd3fc] text-glow">
            ATTRIBUTES
          </h1>
          <p className="text-[#94a3b8] text-xs tracking-[0.3em] mt-1 font-mono">
            <DecryptText text="PASSIVE SKILLS DATABASE" />
          </p>
        </div>

        {/* TABLE */}
        <div className="overflow-x-auto rounded-xl border border-[#1e293b]
                        bg-gradient-to-tr from-[#020617]/80 to-[#0b1220]/80
                        backdrop-blur-sm shadow-lg">
          <table className="w-full sys-table">
            <thead>
              <tr className="text-[#64748b] text-[10px] font-mono tracking-widest uppercase
                             border-b border-[#1e293b]">
                <th className="w-10 py-2">ID</th>
                <th className="w-16">TYPE</th>
                <th>SKILL NAME</th>
                <th className="w-16 text-right">RWD</th>
                <th className="w-12 text-center">✔</th>
              </tr>
            </thead>

            <tbody>
              {nectarQualities.map((q, i) => {
                const isActive = checkedState[q.id] || false;

                return (
                  <motion.tr
                    key={q.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.03, type: "spring", stiffness: 80 }}
                    onClick={() => toggle(q.id, q.points)}
                    className={`cursor-pointer group transition-all duration-300
                      ${
                        isActive
                          ? "bg-[#0ea5e9]/10 shadow-[inset_0_0_10px_rgba(56,189,248,0.12)]"
                          : "hover:bg-[#0b1220]/60 hover:shadow-[0_0_10px_rgba(56,189,248,0.25)]"
                      }`}
                  >
                    {/* ID */}
                    <td className="font-mono text-[#64748b] text-[10px] pl-3 opacity-60">
                      {String(i + 1).padStart(2, "0")}
                    </td>

                    {/* TYPE */}
                    <td className="font-mono text-[10px] text-[#38bdf8] tracking-wider">
                      [{getTypeLabel(q.type)}]
                    </td>

                    {/* NAME */}
                    <td className="py-3">
                      <div
                        className={`font-semibold text-sm tracking-wide transition-all
                          ${
                            isActive
                              ? "text-[#7dd3fc] text-glow pl-2"
                              : "text-[#cbd5f5] group-hover:text-white"
                          }`}
                      >
                        {q.text}
                      </div>
                    </td>

                    {/* POINTS */}
                    <td className="text-right font-mono text-[10px] pr-3">
                      {isActive ? (
                        <span className="text-[#38bdf8] font-bold">
                          ACQUIRED
                        </span>
                      ) : (
                        <span className="text-[#94a3b8]">
                          +{q.points} XP
                        </span>
                      )}
                    </td>

                    {/* CHECK */}
                    <td className="text-center pr-2">
                      <motion.div
                        whileTap={{ scale: 0.9 }}
                        className={`mx-auto w-5 h-5 border flex items-center justify-center rounded-sm transition-colors
                          ${
                            isActive
                              ? "border-[#38bdf8] bg-[#38bdf8]/20 shadow-[0_0_8px_rgba(56,189,248,0.6)]"
                              : "border-[#334155] bg-[#020617] group-hover:border-[#64748b]"
                          }`}
                      >
                        {isActive && (
                          <Check size={14} className="text-[#38bdf8]" />
                        )}
                      </motion.div>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* FOOTER */}
        <div className="mt-6 text-center">
          <p className="text-[10px] text-[#64748b] font-mono tracking-widest uppercase
                        flex items-center justify-center gap-2">
            <Lock size={10} />
            System Resets at Midnight (00:00)
          </p>
        </div>

      </div>
    </div>
  );
}
