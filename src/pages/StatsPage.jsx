import { useState } from "react";
import { Activity, Download, Upload, Copy, Check } from "lucide-react";
import { useGame } from "../context/GameContext";
import DecryptText from "../components/DecryptText";
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid
} from "recharts";

export default function StatsPage() {
  const { xp, level, rank, getMonthlyData } = useGame();
  const monthlyData = getMonthlyData();

  // --- LOGIC: PROGRESSIVE XP CALCULATION ---
  let lvlIterator = 0;       
  let costIterator = 1000;   
  let accumulatedXp = 0;     

  while (lvlIterator < level) {
    accumulatedXp += costIterator;
    costIterator += 375;    
    lvlIterator++;
  }

  const xpInCurrentLevel = Math.max(0, xp - accumulatedXp);
  const xpRequiredForNextLevel = costIterator;
  const rawPercent = (xpInCurrentLevel / xpRequiredForNextLevel) * 100;
  const progressPercent = Math.min(Math.max(rawPercent, 0), 100).toFixed(1);
  // ----------------------------------------

  // --- BACKUP SYSTEM LOGIC ---
  const [showImport, setShowImport] = useState(false);
  const [importString, setImportString] = useState("");
  const [copySuccess, setCopySuccess] = useState(false);

  const handleExport = () => {
    const backup = {
      xp: localStorage.getItem("system_xp"),
      log: localStorage.getItem("system_log"),
      tasks: localStorage.getItem("system_tasks_data"),
      qualities: localStorage.getItem("daily_qualities"),
      version: localStorage.getItem("system_version")
    };
    
    const dataString = btoa(JSON.stringify(backup)); 
    navigator.clipboard.writeText(dataString).then(() => {
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
      alert("SYSTEM DATA COPIED TO CLIPBOARD.");
    });
  };

  const handleImport = () => {
    try {
      const decoded = atob(importString);
      const data = JSON.parse(decoded);

      if (confirm("WARNING: Overwrite current data with this backup?")) {
        if (data.xp) localStorage.setItem("system_xp", data.xp);
        if (data.log) localStorage.setItem("system_log", data.log);
        if (data.tasks) localStorage.setItem("system_tasks_data", data.tasks);
        if (data.qualities) localStorage.setItem("daily_qualities", data.qualities);
        if (data.version) localStorage.setItem("system_version", data.version);
        
        alert("SYSTEM RESTORE SUCCESSFUL. REBOOTING...");
        window.location.reload();
      }
    } catch (e) {
      alert("ERROR: INVALID SYSTEM CODE.");
    }
  };
  // ---------------------------

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
                      <span className="text-cyan-400"> PP {progressPercent}%</span>
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
                
                {/* FIX: Ensure "label" is used and avoid overlap */}
                <XAxis
                  dataKey="label"
                  tick={{ fill: "#64748b", fontSize: 10 }}
                  axisLine={false} 
                  tickLine={false}
                  minTickGap={15} 
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

        {/* DATA MANAGEMENT */}
        <div className="mb-8 space-y-3">
          <p className="text-[10px] text-cyan-600 font-bold uppercase tracking-widest pl-1">Data Management</p>
          
          <div className="flex gap-3">
            <button 
              onClick={handleExport}
              className="flex-1 flex items-center justify-center gap-2 py-3 bg-cyan-950/30 border border-cyan-500/30 text-cyan-400 text-[10px] font-bold tracking-widest hover:bg-cyan-400 hover:text-black transition-all"
            >
              {copySuccess ? <Check size={14} /> : <Download size={14} />}
              {copySuccess ? "COPIED!" : "EXPORT DATA"}
            </button>

            <button 
              onClick={() => setShowImport(!showImport)}
              className="flex-1 flex items-center justify-center gap-2 py-3 bg-slate-900/50 border border-slate-700 text-slate-400 text-[10px] font-bold tracking-widest hover:bg-slate-800 hover:text-white transition-all"
            >
              <Upload size={14} />
              IMPORT DATA
            </button>
          </div>

          {showImport && (
            <div className="animate-fade-in space-y-2 bg-black/50 p-3 rounded border border-slate-800">
              <p className="text-[10px] text-slate-500 uppercase">Paste System Code Below:</p>
              <textarea 
                value={importString}
                onChange={(e) => setImportString(e.target.value)}
                className="w-full h-20 bg-slate-950 border border-cyan-900/50 text-cyan-400 text-[10px] font-mono p-2 focus:outline-none focus:border-cyan-400 rounded"
                placeholder="Paste code here..."
              />
              <button 
                onClick={handleImport}
                className="w-full py-2 bg-cyan-600 text-black text-[10px] font-bold tracking-widest hover:bg-white"
              >
                CONFIRM RESTORE
              </button>
            </div>
          )}
        </div>

        {/* FACTORY RESET */}
        <button
          onClick={() => {
            if (confirm("SYSTEM WARNING: This will wipe all player data permanently. Confirm?")) {
              localStorage.clear();
              window.location.reload();
            }
          }}
          className="w-full border border-red-900/30 text-red-900 py-3 text-[10px] font-bold tracking-[0.3em] hover:bg-red-950/20 hover:text-red-500 hover:border-red-500 transition-all opacity-40 hover:opacity-100 uppercase mb-8"
        >
          ⚠ Factory Reset System
        </button>
      </div>
    </div>
  );
}
