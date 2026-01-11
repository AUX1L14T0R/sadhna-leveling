import { NavLink } from "react-router-dom";
import { Shield, Flame, BarChart3 } from "lucide-react";

const tabs = [
  { to: "/", icon: Shield, label: "STATUS" },
  { to: "/tasks", icon: Flame, label: "QUESTS" },
  { to: "/stats", icon: BarChart3, label: "METRICS" },
];

export default function Navigation() {
  return (
    <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-md">
      <div className="flex justify-around items-center px-2 py-3 rounded-xl 
        bg-[#020617]/90 backdrop-blur-md border border-cyan-500/30 
        shadow-[0_0_20px_rgba(6,182,212,0.2)]"
      >
        {tabs.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `relative flex flex-col items-center group transition-all duration-300
              ${isActive ? "scale-110" : "opacity-60 hover:opacity-100"}`
            }
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <div className="absolute -inset-3 bg-cyan-500/20 blur-lg rounded-full" />
                )}
                <Icon 
                  size={22} 
                  className={`relative z-10 mb-1 transition-colors
                    ${isActive ? "text-cyan-400 drop-shadow-[0_0_5px_rgba(34,211,238,0.8)]" : "text-slate-400"}
                  `} 
                />
                <span className={`text-[10px] tracking-[0.2em] font-bold relative z-10
                  ${isActive ? "text-white text-shadow-sm" : "text-slate-500"}
                `}>
                  {label}
                </span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}