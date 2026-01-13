import { Activity } from "lucide-react";
import { useGame } from "../context/GameContext";
import DecryptText from "../components/DecryptText";
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid
} from "recharts";

export default function StatsPage() {
  const { xp, level, rank, getMonthlyData } = useGame();
  const monthlyData = getMonthlyData();

  // --- LOGIC: PROGRESSIVE XP CALCULATION (Synced with GameContext) ---
  let lvlIterator = 0;       // Start matching at Level 0
  let costIterator = 1000;   // Cost to clear Level 0
  let accumulatedXp = 0;     // Total XP required for previous levels

  // Loop until we reach the CURRENT level to find the "Base XP"
  while (lvlIterator < level) {
    accumulatedXp += costIterator;
    costIterator += 1500;    // Increase difficulty
    lvlIterator++;
  }

  // XP gained ONLY within the current level
  const xpInCurrentLevel = xp - accumulatedXp;
  
  // Total XP needed to finish THIS specific level
  const xpRequiredForNextLevel = costIterator;

  // Calculate Percentage (Clamp between 0 and 100 to prevent visual bugs)
  const rawPercent = (xpInCurrentLevel / xpRequiredForNextLevel) * 100;
  const progressPercent = Math.min(Math.max(rawPercent, 0), 100).toFixed(1);
  // ------------------------------------------------------------------

  return (
    <div className="h-full flex flex-col pt-8 pb-10 px-5 overflow-hidden">

      {/* 1. FIXED HEADER */}
      <div className="max-w-xl mx-auto w-full mb-8 pl-4 border-l-4 border-cyan-500 shrink-0">
        <h1 className="text-3xl font-bold text-white tracking-widest text-glow uppercase">
          STATUS
        </h1>
        <p className="text-cyan-500 text-xs tracking-[0.3em] mt-1">
          <DecryptText text="PLAYER INFORMATION" />
        </p>
      </div>

      {/* 2. SCROLLABLE CONTENT */}
      <div className="flex-1 overflow-y-auto w-full max-w-xl mx-auto scrollbar-cyan pr-2">

        {/* ATTRIBUTE TABLE */}
        <div className="sys-table-container mb-8 rounded-lg overflow-hidden border border-cyan-900/30 bg-slate-900/40">
          <table className="sys-table w-full">
            <thead>
              <tr className="bg-cyan-950/20">
                <th width="40%" className="text-left p-3 text-[10px] text-cyan-500">ATTRIBUTE</th>
                <th className="text-left p-3 text-[10px] text-cyan-500">VALUE</th>
              </tr>
            </thead>
            <tbody>
              {/* STAT ROWS */}
              <tr className="border-b border-slate-800/50">
                <td className="p-3 text-cyan-400 font-bold text-xs">NAME</td>
                <td className="p-3 text-white text-xs">PLAYER</td>
              </tr>
              <tr className="border-b border-slate-800/50">
                <td className="p-3 text-cyan-400 font-bold text-xs">JOB</td>
                <td className="p-3 text-white text-xs">SADHAKA</td>
              </tr>
              <tr className="border-b border-slate-800/50">
                <td className="p-3 text-cyan-400 font-bold text-xs">LEVEL</td>
                <td className="p-3 text-xl text-white font-bold">{level}</td>
              </tr>
              <tr className="border-b border-slate-800/50">
                <td className="p-3 text-cyan-400 font-bold text-xs">RANK</td>
                <td className="p-3 text-xl text-cyan-400 font-bold text-glow">{rank}</td>
              </tr>
              
              {/* EXPERIENCE ROW */}
              <tr>
                <td className="p-3 text-cyan-400 font-bold text-xs align-top pt-4">EXPERIENCE</td>
                <td className="p-3">
                  <div className="flex flex-col gap-2">
                    {/* XP Numbers */}
                    <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                      <span>{xpInCurrentLevel} / {xpRequiredForNextLevel}</span>
                      <span className="text-cyan-400">{progressPercent}%</span>
                    </div>
                    {/* Progress Bar */}
                    <div className="h-1.5 w-full bg-slate-800 relative overflow-hidden rounded-full">
                      <div
                        style={{ width: `${progressPercent}%` }}
                        className="absolute inset-0 bg-cyan-500 shadow-[0_0_10px_#06b6d4] transition-all duration-500"
                      />
                    </div>
                  </div>
                </td>
              </tr>

            </tbody>
          </table>
        </div>

        {/* GRAPH CARD */}
        <div className="sys-card p-4 rounded-lg bg-slate-900/40 border border-cyan-900/30 mb-8">
          <div className="flex items-center justify-between mb-4 border-b border-cyan-500/20 pb-2">
            <span className="text-[10px] text-cyan-400 tracking-widest font-bold uppercase">
              <DecryptText text="GROWTH CHART" />
            </span>
            <Activity size={14} className="text-cyan-400" />
          </div>

          <div style={{ width: "100%", height: 180 }}>
            <ResponsiveContainer>
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis
                  dataKey="day"
                  tick={{ fill: "#64748b", fontSize: 10 }}
                  axisLine={false} tickLine={false}
                />
                <YAxis
                  tick={{ fill: "#64748b", fontSize: 10 }}
                  axisLine={false} tickLine={false} width={25}
                />
                <Tooltip
                  contentStyle={{
                    background: "rgba(2, 6, 23, 0.95)",
                    border: "1px solid #06b6d4",
                    color: "#fff",
                    fontSize: "10px",
                    borderRadius: "4px"
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
            if (confirm("SYSTEM WARNING: This will wipe all player data. Confirm?")) {
              localStorage.clear();
              window.location.reload();
            }
          }}
          className="w-full border border-red-900/30 text-red-900 py-3 text-[10px] font-bold tracking-[0.3em] hover:bg-red-950/20 hover:text-red-500 hover:border-red-500 transition-all opacity-60 hover:opacity-100 uppercase mb-8"
        >
          ⚠ Factory Reset System
        </button>
      </div>
    </div>
  );
              }        </h1>
        <p className="text-cyan-500 text-xs tracking-[0.3em] mt-1">
          <DecryptText text="PLAYER INFORMATION" />
        </p>
      </div>

      {/* 2. SCROLLABLE CONTENT */}
      <div className="flex-1 overflow-y-auto w-full max-w-xl mx-auto scrollbar-cyan pr-2">

        {/* ATTRIBUTE TABLE */}
        <div className="sys-table-container mb-8 rounded-lg overflow-hidden border border-cyan-900/30 bg-slate-900/40">
          <table className="sys-table w-full">
            <thead>
              <tr className="bg-cyan-950/20">
                <th width="40%" className="text-left p-3 text-[10px] text-cyan-500">ATTRIBUTE</th>
                <th className="text-left p-3 text-[10px] text-cyan-500">VALUE</th>
              </tr>
            </thead>
            <tbody>
              {/* STANDARD ROWS */}
              <tr className="border-b border-slate-800/50">
                <td className="p-3 text-cyan-400 font-bold text-xs">NAME</td>
                <td className="p-3 text-white text-xs">PLAYER</td>
              </tr>
              <tr className="border-b border-slate-800/50">
                <td className="p-3 text-cyan-400 font-bold text-xs">JOB</td>
                <td className="p-3 text-white text-xs">SADHAKA</td>
              </tr>
              <tr className="border-b border-slate-800/50">
                <td className="p-3 text-cyan-400 font-bold text-xs">LEVEL</td>
                <td className="p-3 text-xl text-white font-bold">{level}</td>
              </tr>
              <tr className="border-b border-slate-800/50">
                <td className="p-3 text-cyan-400 font-bold text-xs">RANK</td>
                <td className="p-3 text-xl text-cyan-400 font-bold text-glow">{rank}</td>
              </tr>
              
              {/* FIXED ROW: Progress Bar is now INSIDE the 'td' */}
              <tr>
                <td className="p-3 text-cyan-400 font-bold text-xs align-top pt-4">EXPERIENCE</td>
                <td className="p-3">
                  <div className="flex flex-col gap-2">
                    {/* XP Numbers */}
                    <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                      <span>{xpInCurrentLevel} / {xpRequiredForNextLevel}</span>
                      <span className="text-cyan-400"> Progress={progressPercent}%</span>
                    </div>
                    {/* Progress Bar Container */}
                    <div className="h-1.5 w-full bg-slate-800 relative overflow-hidden rounded-full">
                      <div
                        style={{ width: `${progressPercent}%` }}
                        className="absolute inset-0 bg-cyan-500 shadow-[0_0_10px_#06b6d4] transition-all duration-500"
                      />
                    </div>
                  </div>
                </td>
              </tr>

            </tbody>
          </table>
        </div>

        {/* GRAPH CARD */}
        <div className="sys-card p-4 rounded-lg bg-slate-900/40 border border-cyan-900/30 mb-8">
          <div className="flex items-center justify-between mb-4 border-b border-cyan-500/20 pb-2">
            <span className="text-[10px] text-cyan-400 tracking-widest font-bold uppercase">
              <DecryptText text="GROWTH CHART" />
            </span>
            <Activity size={14} className="text-cyan-400" />
          </div>

          <div style={{ width: "100%", height: 180 }}>
            <ResponsiveContainer>
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis
                  dataKey="day"
                  tick={{ fill: "#64748b", fontSize: 10 }}
                  axisLine={false} tickLine={false}
                />
                <YAxis
                  tick={{ fill: "#64748b", fontSize: 10 }}
                  axisLine={false} tickLine={false} width={25}
                />
                <Tooltip
                  contentStyle={{
                    background: "rgba(2, 6, 23, 0.95)",
                    border: "1px solid #06b6d4",
                    color: "#fff",
                    fontSize: "10px",
                    borderRadius: "4px"
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
            if (confirm("SYSTEM WARNING: This will wipe all player data. Confirm?")) {
              localStorage.clear();
              window.location.reload();
            }
          }}
          className="w-full border border-red-900/30 text-red-900 py-3 text-[10px] font-bold tracking-[0.3em] hover:bg-red-950/20 hover:text-red-500 hover:border-red-500 transition-all opacity-60 hover:opacity-100 uppercase mb-8"
        >
          ⚠ Factory Reset System
        </button>
      </div>
    </div>
  );
}  
