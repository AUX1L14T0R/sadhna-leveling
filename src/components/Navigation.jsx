import { NavLink } from "react-router-dom";
import { User, Shield, Target } from "lucide-react";

export default function Navigation() {
  return (
    <nav className="fixed bottom-0 left-0 w-full bg-black/80 border-t border-cyan-900/50 backdrop-blur-lg pb-[env(safe-area-inset-bottom)] z-40">
      <div className="flex justify-around items-center h-16">
        
        {/* CLICKING THIS SHOULD SHOW STATUS PAGE */}
        <NavItem to="/" icon={<User size={24} />} label="STATUS" />
        
        {/* CLICKING THIS SHOULD SHOW QUALITIES PAGE */}
        <NavItem to="/qualities" icon={<Shield size={24} />} label="SKILLS" />
        
        {/* CLICKING THIS SHOULD SHOW TASKS PAGE */}
        <NavItem to="/tasks" icon={<Target size={24} />} label="QUESTS" />
        
      </div>
    </nav>
  );
}

const NavItem = ({ to, icon, label }) => (
  <NavLink 
    to={to} 
    className={({ isActive }) => `
      flex flex-col items-center justify-center w-full h-full space-y-1 transition-all
      ${isActive ? "text-cyan-400 text-glow" : "text-slate-600"}
    `}
  >
    {icon}
    <span className="text-[9px] font-bold tracking-widest uppercase">{label}</span>
  </NavLink>
);