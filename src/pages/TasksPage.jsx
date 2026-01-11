import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useGame } from "../context/GameContext";
import { Plus, X, AlertTriangle } from "lucide-react";
import DecryptText from "../components/DecryptText"; // <--- IMPORT THIS

const defaultTasks = [
  { id: 1, title: "Mangala Aarti", points: 100, completed: false },
  { id: 2, title: "16 Rounds Japa", points: 80, completed: false },
  { id: 3, title: "Scripture Study", points: 50, completed: false },
];

export default function TasksPage() {
  const { addPoints } = useGame();

  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem("system_tasks");
    return saved ? JSON.parse(saved) : defaultTasks;
  });

  const [isAdding, setIsAdding] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskPoints, setNewTaskPoints] = useState(50);

  useEffect(() => {
    localStorage.setItem("system_tasks", JSON.stringify(tasks));
  }, [tasks]);

  const completeTask = (id, points) => {
    setTasks((prev) => prev.map((t) => t.id === id ? { ...t, completed: true } : t));
    addPoints(points);
  };

  const addNewTask = (e) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    const newTask = { id: Date.now(), title: newTaskTitle, points: parseInt(newTaskPoints), completed: false };
    setTasks((prev) => [...prev, newTask]);
    setNewTaskTitle("");
    setNewTaskPoints(50);
    setIsAdding(false);
  };

  const deleteTask = (id) => setTasks((prev) => prev.filter((t) => t.id !== id));

  const getQuestRank = (pts) => {
    if (pts >= 100) return "S";
    if (pts >= 80) return "A";
    if (pts >= 50) return "B";
    if (pts >= 30) return "C";
    return "E";
  };

  const getRankColor = (rank) => {
    switch(rank) {
      case "S": return "text-orange-500 text-glow"; 
      case "A": return "text-red-500 text-glow";   
      case "B": return "text-cyan-400 text-glow";   
      default: return "text-slate-400";
    }
  };

  return (
    <div className="max-w-xl mx-auto px-5 pt-12 pb-32 min-h-screen bg-gradient-to-b from-black via-slate-900 to-black text-white">
      
      {/* HEADER */}
      <div className="flex items-end justify-between mb-8 pl-4 border-l-4 border-cyan-500">
        <div>
          <h1 className="text-4xl font-bold tracking-widest text-cyan-400 text-glow animate-fade-in">
            QUESTS
          </h1>
          <p className="text-cyan-500 text-xs tracking-[0.3em] mt-1 font-mono">
             {/* APPLIED DECRYPT EFFECT HERE */}
            <DecryptText text="ACTIVE OBJECTIVES" />
          </p>
        </div>

        {/* ADD BUTTON */}
        {!isAdding && (
          <button 
            onClick={() => setIsAdding(true)}
            className="border border-cyan-500/30 bg-cyan-950/20 hover:bg-cyan-500/20 text-cyan-400 p-2 transition-all group rounded-md shadow-md shadow-cyan-700/30"
          >
            <Plus size={20} className="group-hover:rotate-90 transition-transform" />
          </button>
        )}
      </div>

      {/* ADD FORM */}
      <AnimatePresence>
        {isAdding && (
          <motion.form
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            onSubmit={addNewTask}
            className="mb-8 bg-black/80 border border-cyan-500/50 p-4 relative shadow-[0_0_25px_rgba(6,182,212,0.25)] rounded-lg"
          >
            <button 
              type="button" 
              onClick={() => setIsAdding(false)}
              className="absolute top-2 right-2 text-slate-500 hover:text-red-500 transition-colors"
            >
              <X size={16} />
            </button>

            <div className="flex items-center gap-2 mb-4 text-cyan-400 animate-pulse">
              <AlertTriangle size={14} />
              <span className="text-[10px] tracking-widest font-bold">
                 <DecryptText text="NEW DIRECTIVE" />
              </span>
            </div>

            <div className="flex gap-4">
              <input
                type="text"
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                className="flex-1 bg-transparent border-b border-slate-700 py-1 text-sm text-white focus:border-cyan-400 outline-none font-mono placeholder:text-slate-700"
                placeholder="MISSION NAME"
                autoFocus
              />
              <input
                type="number"
                value={newTaskPoints}
                onChange={(e) => setNewTaskPoints(e.target.value)}
                className="w-16 bg-transparent border-b border-slate-700 py-1 text-sm text-cyan-400 focus:border-cyan-400 outline-none font-mono text-center"
              />
            </div>

            <button 
              type="submit"
              className="w-full bg-cyan-900/30 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 py-2 text-[10px] tracking-[0.2em] mt-4 transition-all rounded-md"
            >
              CONFIRM
            </button>
          </motion.form>
        )}
      </AnimatePresence>

      {/* QUEST TABLE */}
      <div className="sys-table-container overflow-hidden rounded-xl shadow-lg border border-cyan-900 bg-gradient-to-tr from-black/60 to-slate-900/60 backdrop-blur-sm">
        <table className="sys-table w-full border-collapse">
          <thead>
            <tr className="text-slate-500 text-[10px] font-mono tracking-widest uppercase border-b border-cyan-800">
              <th className="w-12 text-center">RNK</th>
              <th>OBJECTIVE</th>
              <th className="w-20 text-right">RWD</th>
              <th className="w-24 text-center">STS</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task, i) => {
              const rank = getQuestRank(task.points);
              const rankColor = getRankColor(rank);

              return (
                <motion.tr
                  key={task.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05, type: "spring", stiffness: 80 }}
                  className={`group rounded-lg transition-all duration-300
                    ${task.completed ? "opacity-50 grayscale" : "hover:bg-cyan-950/20 hover:scale-105"}`
                  }
                >
                  {/* RANK */}
                  <td className={`text-center font-bold text-lg ${rankColor}`}>
                    {rank}
                  </td>

                  {/* OBJECTIVE */}
                  <td className="relative">
                    <span className={`font-medium tracking-wide ${task.completed ? "line-through text-slate-600" : "text-slate-200"}`}>
                      {task.title}
                    </span>
                    <button 
                      onClick={(e) => { e.stopPropagation(); deleteTask(task.id); }}
                      className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 text-slate-700 hover:text-red-500 transition-all"
                    >
                      <X size={14} />
                    </button>
                  </td>

                  {/* REWARD */}
                  <td className="text-right font-mono text-cyan-400">
                    {task.points}XP
                  </td>

                  {/* STATUS */}
                  <td className="text-center p-0">
                    {!task.completed ? (
                      <motion.button
                        onClick={() => completeTask(task.id, task.points)}
                        whileTap={{ scale: 0.9 }}
                        className="w-full h-full py-3 text-[10px] tracking-wider text-cyan-400 hover:bg-cyan-500 hover:text-black transition-colors uppercase font-bold rounded-md"
                      >
                        CLEAR
                      </motion.button>
                    ) : (
                      <span className="text-[10px] tracking-wider text-slate-500">
                        DONE
                      </span>
                    )}
                  </td>
                </motion.tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {tasks.length === 0 && (
        <div className="mt-8 text-center text-slate-600 text-xs tracking-[0.2em]">
          NO ACTIVE MISSIONS
        </div>
      )}
    </div>
  );
}