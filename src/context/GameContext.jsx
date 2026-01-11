import { createContext, useContext, useEffect, useState } from "react";

const GameContext = createContext();

export function GameProvider({ children }) {
  const [xp, setXp] = useState(() => {
    const saved = localStorage.getItem("system_xp");
    return saved ? parseInt(saved, 10) : 0;
  });

  const [level, setLevel] = useState(1);
  const [rank, setRank] = useState("E");
  
  const [dailyXpLog, setDailyXpLog] = useState(() => {
    const saved = localStorage.getItem("system_log");
    return saved ? JSON.parse(saved) : {};
  });

  useEffect(() => {
    // Rank Logic
    setLevel(Math.floor(xp / 100) + 1);
    if (xp >= 5000) setRank("S");
    else if (xp >= 2000) setRank("A");
    else if (xp >= 1200) setRank("B");
    else if (xp >= 600) setRank("C");
    else if (xp >= 200) setRank("D");
    else setRank("E");

    localStorage.setItem("system_xp", xp);
  }, [xp]);

  useEffect(() => {
    localStorage.setItem("system_log", JSON.stringify(dailyXpLog));
  }, [dailyXpLog]);

  const addPoints = (amount) => {
    if (!amount) return;
    setXp((prev) => prev + amount);
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