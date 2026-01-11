import { Activity } from "lucide-react";
import { useGame } from "../context/GameContext";
import DecryptText from "../components/DecryptText"; // <--- IMPORT THIS
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid
} from "recharts";

export default function StatsPage() {
  const { xp, level, rank, getMonthlyData } = useGame();
  const monthlyData = getMonthlyData();

  // Calculate progress to next level
  const nextLevelXp = level * 100;
  const progressPercent = Math.min((xp / nextLevelXp) * 100, 100).toFixed(1);

  return (
    <div className="max-w-xl mx-auto px-5 pt-12 pb-32">
      
      {/* TITLE */}
      <div className="mb-8 pl-4 border-l-4 border-cyan-500">
        <h1 className="text-3xl font-bold text-white tracking-widest text-glow">
          STATUS
        </h1>
        <p className="text-cyan-500 text-xs tracking-[0.3em] mt-1">
           {/* APPLIED DECRYPT EFFECT HERE */}
          <DecryptText text="PLAYER INFORMATION" />
        </p>
      </div>

      {/* THE SYSTEM TABLE: ATTRIBUTES */}
      <div className="sys-table-container mb-8">
        <table className="sys-table">
          <thead>
            <tr>
              <th width="40%">ATTRIBUTE</th>
              <th>VALUE</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="text-cyan-400 font-bold">NAME</td>
              <td>PLAYER</td>
            </tr>
            <tr>
              <td className="text-cyan-400 font-bold">JOB</td>
              <td>SADHAKA</td>
            </tr>
            <tr>
              <td className="text-cyan-400 font-bold">TITLE</td>
              <td>WOLF SLAYER (None)</td>
            </tr>
            <tr>
              <td className="text-cyan-400 font-bold">LEVEL</td>
              <td className="text-xl text-white font-bold">{level}</td>
            </tr>
            <tr>
              <td className="text-cyan-400 font-bold">RANK</td>
              <td className="text-xl text-cyan-400 font-bold text-glow">{rank}</td>
            </tr>
            <tr>
              <td className="text-cyan-400 font-bold">EXPERIENCE</td>
              <td>
                <div className="flex items-center gap-3">
                  <span>{xp} / {nextLevelXp}</span>
                  <div className="h-1.5 w-24 bg-slate-800 relative overflow-hidden">
                    <div 
                      style={{ width: `${progressPercent}%` }} 
                      className="absolute inset-0 bg-cyan-500 shadow-[0_0_10px_#06b6d4]" 
                    />
                  </div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* GRAPH CARD */}
      <div className="sys-card p-4">
        <div className="flex items-center justify-between mb-4 border-b border-cyan-500/20 pb-2">
          <span className="text-xs text-cyan-400 tracking-widest font-bold">
             <DecryptText text="GROWTH CHART" />
          </span>
          <Activity size={14} className="text-cyan-400" />
        </div>

        <div style={{ width: "100%", height: 200 }}>
          <ResponsiveContainer>
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
              <XAxis 
                dataKey="day" 
                tick={{ fill: "#64748b", fontSize: 10, fontFamily: 'Jura' }} 
                axisLine={false} tickLine={false} 
              />
              <YAxis 
                tick={{ fill: "#64748b", fontSize: 10, fontFamily: 'Jura' }} 
                axisLine={false} tickLine={false} width={30} 
              />
              <Tooltip
                contentStyle={{
                  background: "rgba(2, 6, 23, 0.9)",
                  border: "1px solid #06b6d4",
                  color: "#fff",
                  fontSize: "12px",
                  fontFamily: "Jura"
                }}
              />
              <Line 
                type="step" 
                dataKey="xp" 
                stroke="#22d3ee" 
                strokeWidth={2} 
                dot={false} 
                activeDot={{ r: 4, fill: "#fff", stroke: "#22d3ee" }} 
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* RESET BUTTON */}
      <button 
        onClick={() => {
          if(confirm("SYSTEM WARNING: This will wipe all player data. Confirm?")) {
            localStorage.clear();
            window.location.reload();
          }
        }}
        className="mt-8 w-full border border-red-900/50 text-red-700 py-3 text-xs tracking-widest hover:bg-red-950/30 hover:text-red-500 hover:border-red-500 transition opacity-50 hover:opacity-100"
      >
        ⚠ FACTORY RESET SYSTEM
      </button>
    </div>
  );
}