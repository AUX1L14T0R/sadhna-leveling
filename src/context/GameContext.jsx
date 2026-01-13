import { createContext, useContext, useEffect, useState } from "react";

const GameContext = createContext();

export function GameProvider({ children }) {
  // 1. DATA VERSION CONTROL (Fixes "Starting at Grade E" bug)
  // If we don't clear old data, 5000 XP from the old system breaks the new math.
  useEffect(() => {
    const version = localStorage.getItem("system_version");
    if (version !== "v2_progressive") {
      console.log("System Update: Resetting stats for new progressive logic...");
      localStorage.clear();
      localStorage.setItem("system_version", "v2_progressive");
      window.location.reload();
    }
  }, []);

  const [xp, setXp] = useState(() => {
    const saved = localStorage.getItem("system_xp");
    return saved && !isNaN(saved) ? parseInt(saved, 10) : 0;
  });

  // Start at Level 0 as requested
  const [level, setLevel] = useState(0); 
  const [rank, setRank] = useState("F");
  
  const [dailyXpLog, setDailyXpLog] = useState(() => {
    const saved = localStorage.getItem("system_log");
    return saved ? JSON.parse(saved) : {};
  });

  useEffect(() => {
    // --- NEW LEVEL LOGIC (Starts at 0) ---
    // Lvl 0 -> 1: Needs 1000 XP
    // Lvl 1 -> 2: Needs 2500 XP (+1500 increase)
    // Lvl 2 -> 3: Needs 4000 XP (+1500 increase)

    let currentLvl = 0;      // Start at Level 0 (Rank F)
    let cost = 1000;         // Cost to clear Level 0
    let accumulated = 0;     // Total XP spent to reach current level

    // While we have enough XP to pay for the next level...
    while (xp >= accumulated + cost) {
      accumulated += cost;   // Pay the cost
      currentLvl++;          // Level Up
      cost += 1500;          // Next level is harder
    }

    setLevel(currentLvl);
    localStorage.setItem("system_xp", xp);

    // --- NEW RANK LOGIC (Your Exact Request) ---
    if (currentLvl >= 200) setRank("SSS");
    else if (currentLvl >= 150) setRank("SS");
    else if (currentLvl >= 120) setRank("S");
    else if (currentLvl >= 100) setRank("A+");
    else if (currentLvl >= 85) setRank("A");
    else if (currentLvl >= 70) setRank("B+");
    else if (currentLvl >= 60) setRank("B");
    else if (currentLvl >= 49) setRank("C+");
    else if (currentLvl >= 39) setRank("C");
    else if (currentLvl >= 32) setRank("D+");
    else if (currentLvl >= 25) setRank("D");
    else if (currentLvl >= 18) setRank("E+");
    else if (currentLvl >= 12) setRank("E");
    else if (currentLvl >= 5) setRank("F+");
    else setRank("F"); // Level 0-4 is F

  }, [xp]);

  useEffect(() => {
    localStorage.setItem("system_log", JSON.stringify(dailyXpLog));
  }, [dailyXpLog]);

  const addPoints = (amount) => {
    if (!amount) return;
    // Prevent XP from going below 0 to avoid calculation errors
    setXp((prev) => Math.max(0, prev + amount));
    
    const today = new Date().toISOString().slice(0, 10);
    setDailyXpLog((prev) => ({
      ...prev,
      [today]: (prev[today] || 0) + amount,
    }));
  };

  const getMonthlyData = () => {
    const date = new Date();
    const year = date.getFullYear();
    const month = date.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    const data = [];
    for (let day = 1; day <= daysInMonth; day++) {
      const dayStr = day < 10 ? `0${day}` : day;
      const key = `${year}-${(month + 1).toString().padStart(2, '0')}-${dayStr}`;
      data.push({
        day: day,
        xp: dailyXpLog[key] || 0
      });
    }
    return data;
  };

  return (
    <GameContext.Provider
      value={{ xp, level, rank, addPoints, dailyXpLog, getMonthlyData }}
    >
      {children}
    </GameContext.Provider>
  );
}

export const useGame = () => useContext(GameContext);
