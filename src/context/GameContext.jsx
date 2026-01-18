import { createContext, useContext, useEffect, useState } from "react";

const GameContext = createContext();

export function GameProvider({ children }) {
  // 1. DATA RESET FOR NEW LOGIC
  useEffect(() => {
    const version = localStorage.getItem("system_version");
    if (version !== "v2_progressive_fixed_dates") { // Updated Version Tag
      localStorage.clear();
      localStorage.setItem("system_version", "v2_progressive_fixed_dates");
      window.location.reload();
    }
  }, []);

  const [xp, setXp] = useState(() => {
    const saved = localStorage.getItem("system_xp");
    return saved ? parseInt(saved, 10) : 0;
  });

  const [level, setLevel] = useState(0); 
  const [rank, setRank] = useState("F");
  
  const [dailyXpLog, setDailyXpLog] = useState(() => {
    const saved = localStorage.getItem("system_log");
    return saved ? JSON.parse(saved) : {};
  });

  useEffect(() => {
    // --- LEVEL LOGIC ---
    let currentLvl = 0;
    let cost = 1000;
    let accumulated = 0;

    while (xp >= accumulated + cost) {
      accumulated += cost;
      currentLvl++;
      cost += 375;
    }

    setLevel(currentLvl);
    localStorage.setItem("system_xp", xp);

    // --- RANK LOGIC ---
    if (currentLvl >= 200) setRank("SSS");
    else if (currentLvl >= 150) setRank("SS");
    else if (currentLvl >= 120) setRank("S");  
    else if (currentLvl >= 100) setRank("A+");
    else if (currentLvl >= 85) setRank("A");
    else if (currentLvl >= 70) setRank("B+");
    else if (currentLvl >= 60) setRank("B");
    else if (currentLvl >= 50) setRank("C+");
    else if (currentLvl >= 40) setRank("C");
    else if (currentLvl >= 35) setRank("D+");
    else if (currentLvl >= 30) setRank("D");
    else if (currentLvl >= 25) setRank("E+");
    else if (currentLvl >= 20) setRank("E");
    else if (currentLvl >= 15) setRank("F+");
    else if (currentLvl >= 10) setRank("F");
    else if (currentLvl >= 5) setRank("Noob");
    else setRank("Beginner"); 

  }, [xp]);

  useEffect(() => {
    localStorage.setItem("system_log", JSON.stringify(dailyXpLog));
  }, [dailyXpLog]);

  const addPoints = (amount) => {
    if (!amount) return;
    setXp((prev) => prev + amount);
    
    // FIX: Use LOCAL time for keys to match the Graph
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const localKey = `${year}-${month}-${day}`;

    setDailyXpLog((prev) => ({
      ...prev,
      [localKey]: (prev[localKey] || 0) + amount,
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
      const monthStr = (month + 1).toString().padStart(2, '0');
      const key = `${year}-${monthStr}-${dayStr}`;
      
      // Create Label: "Jan 1"
      const dateObj = new Date(year, month, day);
      const label = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

      data.push({
        day: day,
        label: label, 
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
