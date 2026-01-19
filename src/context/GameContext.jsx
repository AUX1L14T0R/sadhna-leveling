import { createContext, useContext, useEffect, useState } from "react";

const GameContext = createContext();

// ===============================
// PROGRESSION CONFIG (SOURCE OF TRUTH)
// ===============================
const BASE_XP = 1000;        // XP for level 0 → 1
const XP_DIFFERENCE = 375;   // Increment per level (balanced)
const MAX_LEVEL = 10000;

export function GameProvider({ children }) {

  // ===============================
  // DATA RESET FOR NEW LOGIC
  // ===============================
  useEffect(() => {
    const version = localStorage.getItem("system_version");
    if (version !== "v3_balanced_progression") {
      localStorage.clear();
      localStorage.setItem("system_version", "v3_balanced_progression");
      window.location.reload();
    }
  }, []);

  // ===============================
  // STATE
  // ===============================
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

  // ===============================
  // LEVEL + RANK LOGIC
  // ===============================
  useEffect(() => {
    let currentLvl = 0;
    let cost = BASE_XP;
    let accumulated = 0;

    while (
      currentLvl < MAX_LEVEL &&
      xp >= accumulated + cost
    ) {
      accumulated += cost;
      currentLvl++;
      cost += XP_DIFFERENCE;
    }

    setLevel(currentLvl);
    localStorage.setItem("system_xp", xp);

    // -------- RANK LOGIC --------
    if (currentLvl >= 200) setRank("SSS");
    else if (currentLvl >= 170) setRank("SS");
    else if (currentLvl >= 150) setRank("S");
    else if (currentLvl >= 142) setRank("Conqueror'A+'");
    else if (currentLvl >= 137) setRank("Crown'A+'");
    else if (currentLvl >= 130) setRank("Ace'A+'");
    else if (currentLvl >= 122) setRank("A+");
    else if (currentLvl >= 115) setRank("Diamond 'A'");
    else if (currentLvl >= 107) setRank("Platinum 'A'");
    else if (currentLvl >= 100) setRank("A");
    else if (currentLvl >= 92) setRank("Gold 'B'");
    else if (currentLvl >= 85) setRank("Silver 'B'");
    else if (currentLvl >= 77) setsetRank("Bronze 'B'");
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

  // ===============================
  // PERSIST DAILY LOG
  // ===============================
  useEffect(() => {
    localStorage.setItem("system_log", JSON.stringify(dailyXpLog));
  }, [dailyXpLog]);

  // ===============================
  // ADD XP
  // ===============================
  const addPoints = (amount) => {
    if (!amount) return;

    setXp((prev) => prev + amount);

    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    const key = `${year}-${month}-${day}`;

    setDailyXpLog((prev) => ({
      ...prev,
      [key]: (prev[key] || 0) + amount,
    }));
  };

  // ===============================
  // MONTHLY GRAPH DATA
  // ===============================
  const getMonthlyData = () => {
    const date = new Date();
    const year = date.getFullYear();
    const month = date.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const data = [];
    for (let day = 1; day <= daysInMonth; day++) {
      const dayStr = String(day).padStart(2, "0");
      const monthStr = String(month + 1).padStart(2, "0");
      const key = `${year}-${monthStr}-${dayStr}`;

      const label = new Date(year, month, day).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });

      data.push({
        day,
        label,
        xp: dailyXpLog[key] || 0,
      });
    }
    return data;
  };

  // ===============================
  // PROVIDER
  // ===============================
  return (
    <GameContext.Provider
      value={{
        xp,
        level,
        rank,
        addPoints,
        dailyXpLog,
        getMonthlyData,
      }}
    >
      {children}
    </GameContext.Provider>
  );
}

export const useGame = () => useContext(GameContext);
