import { useState, useEffect } from "react";
import { useGame } from "../context/GameContext";
import { Plus, X, Clock, Edit2, Trash2 } from "lucide-react";
import DecryptText from "../components/DecryptText";

export default function TasksPage() {
  const { addPoints } = useGame();
  
  // --- DAILY QUEST LOGIC ---
  const [tasks, setTasks] = useState(() => {
    const savedData = localStorage.getItem("system_tasks_data");
    const today = new Date().toLocaleDateString();

    // Default Starter Quest
    const defaultTasks = [
      { 
        id: 1, 
        title: "16 Rounds Japa", 
        rank: "S", 
        completed: false, 
        selectedOption: null, 
        options: [
          { id: "o1", label: "12:00 PM", points: 100 },
          { id: "o2", label: "04:00 PM", points: 80 },
          { id: "o3", label: "07:00 PM", points: 60 },
        ]
      }
    ];

    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        
        // 1. If it's the old array format, convert it to new format and reset
        if (Array.isArray(parsed)) {
          return parsed.map(t => ({ ...t, completed: false, selectedOption: null }));
        }

        // 2. If it's new object format, check the date
        if (parsed.date === today) {
          // Same day: return status as is
          return parsed.tasks;
        } else {
          // New day: Reset completion status, but keep the quest list
          return parsed.tasks.map(t => ({ ...t, completed: false, selectedOption: null }));
        }
      } catch (e) {
        return defaultTasks;
      }
    }
    
    return defaultTasks;
  });

  const [activeModal, setActiveModal] = useState(null);
  const [pendingTier, setPendingTier] = useState(null);
  const [editingTask, setEditingTask] = useState(null);

  // Save tasks AND the current date whenever tasks change
  useEffect(() => {
    const today = new Date().toLocaleDateString();
    const payload = {
      date: today,
      tasks: tasks
    };
    localStorage.setItem("system_tasks_data", JSON.stringify(payload));
  }, [tasks]);

  const handleTaskClick = (task, tierOption) => {
    if (task.completed) return;
    setPendingTier(tierOption);
    setActiveModal(task);
  };

  const confirmCompletion = () => {
    if (!activeModal || !pendingTier) return;
    setTasks(prev => prev.map(t => t.id === activeModal.id ? { ...t, completed: true, selectedOption: pendingTier.id } : t));
    addPoints(pendingTier.points);
    setActiveModal(null);
    setPendingTier(null);
  };

  const saveEditedTask = (e) => {
    e.preventDefault();
    if (tasks.find(t => t.id === editingTask.id)) {
      setTasks(prev => prev.map(t => t.id === editingTask.id ? editingTask : t));
    } else {
      setTasks(prev => [...prev, { ...editingTask, id: Date.now() }]);
    }
    setEditingTask(null);
  };

  const addDeadlineOption = () => {
    const newOp = { id: `opt_${Date.now()}`, label: "00:00 AM", points: 50 };
    setEditingTask({ ...editingTask, options: [...editingTask.options, newOp] });
  };

  return (
    <div className="h-full overflow-y-auto pt-12 pb-32 px-5 scrollbar-cyan">
      <div className="max-w-xl mx-auto">
        
        {/* HEADER */}
        <div className="flex items-end justify-between mb-10 pl-4 border-l-4 border-cyan-500">
          <div>
            <h1 className="text-5xl font-extrabold tracking-widest text-cyan-400 text-glow animate-pulse">QUESTS</h1>
            <p className="text-cyan-500 text-xs tracking-[0.3em] mt-1 font-mono uppercase">
              <DecryptText text="DAILY QUESTS: RESET 00:00" />
            </p>
          </div>
          <button 
            onClick={() => setEditingTask({ title: "", rank: "E", completed: false, options: [{id: "1", label: "12:00 PM", points: 50}] })}
            className="p-2 border border-cyan-500/30 bg-cyan-950/20 text-cyan-400 hover:bg-cyan-400 hover:text-black shadow-neon-glow hover:scale-110 transition-all"
          >
            <Plus size={22} />
          </button>
        </div>

        {/* QUEST LIST */}
        <div className="space-y-6">
          {tasks.map((task) => (
            <div
              key={task.id}
              className={`sys-card p-5 relative overflow-hidden transition-all duration-300 rounded-xl
                ${task.completed ? 'opacity-30 grayscale border-slate-800' : 'hover:border-cyan-400/50 border-cyan-900/50 shadow-neon-glow hover:scale-[1.02]'} bg-gradient-to-tr from-slate-900/60 to-black/50`}
            >
              <button onClick={() => setEditingTask(task)} className="absolute top-3 right-3 text-slate-700 hover:text-cyan-400 opacity-0 group-hover:opacity-100 transition-all z-10">
                <Edit2 size={16} />
              </button>
              <div className="flex items-center gap-4 mb-4">
                <div className={`w-12 h-12 flex items-center justify-center font-bold text-xl border rounded-full ${task.rank === 'S' ? 'border-orange-500 text-orange-500 text-glow' : 'border-cyan-500 text-cyan-400'}`}>
                  {task.rank}
                </div>
                <div>
                  <h3 className={`text-lg font-bold tracking-wide ${task.completed ? 'text-slate-500 line-through' : 'text-white'}`}>{task.title}</h3>
                  <p className="text-[10px] text-cyan-800 font-mono tracking-widest mt-1 uppercase">OBJECTIVE_REWARDS_AVAILABLE</p>
                </div>
              </div>
              <div className="grid grid-cols-1 gap-2 border-t border-cyan-900/20 pt-4">
                {task.options?.map(opt => {
                  const isSel = task.completed && task.selectedOption === opt.id;
                  return (
                    <button
                      key={opt.id}
                      disabled={task.completed}
                      onClick={() => handleTaskClick(task, opt)}
                      className={`flex items-center justify-between px-4 py-3 border text-xs tracking-wider transition-all rounded-md
                        ${isSel 
                          ? "bg-cyan-400 text-black border-cyan-400 shadow-neon-glow font-bold" 
                          : task.completed 
                            ? "opacity-20 border-slate-900" 
                            : "bg-slate-950 border-slate-800 text-slate-400 hover:border-cyan-400 hover:text-cyan-400"}`}
                    >
                      <div className="flex items-center gap-2"><Clock size={14}/><span>{opt.label}</span></div>
                      <span className={isSel ? "text-black" : "text-cyan-400 font-bold"}>+{opt.points} XP</span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* EDIT MODAL */}
        {editingTask && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/95 backdrop-blur-lg">
            <form onSubmit={saveEditedTask} className="w-full max-w-sm bg-[#050914] border border-cyan-500 p-2 shadow-neon-glow rounded-xl overflow-y-auto max-h-[90vh]">
              <div className="bg-[#080c16] p-6 space-y-6">
                <div className="flex justify-between items-center border-b border-cyan-900 pb-3">
                  <span className="text-sm font-bold tracking-[.3em] text-cyan-400">QUEST_CONFIG</span>
                  <X className="text-slate-500 cursor-pointer hover:text-cyan-400" onClick={() => setEditingTask(null)} />
                </div>
                <input value={editingTask.title} onChange={e => setEditingTask({...editingTask, title: e.target.value})} placeholder="MISSION TITLE" className="w-full bg-slate-950 border-b border-cyan-900 p-3 text-white outline-none focus:border-cyan-400 font-mono" />
                <div className="grid grid-cols-2 gap-4">
                  <select value={editingTask.rank} onChange={e => setEditingTask({...editingTask, rank: e.target.value})} className="bg-slate-950 border-b border-cyan-900 text-cyan-400 p-2 font-mono text-xs">
                    {["S", "A", "B", "C", "D", "E"].map(r => <option key={r} value={r}>RANK {r}</option>)}
                  </select>
                  <span className="text-[10px] text-slate-500 self-center uppercase tracking-widest">Rank Difficulty</span>
                </div>
                <div className="space-y-3">
                  <p className="text-[10px] text-cyan-600 font-bold uppercase tracking-widest">Deadline Tiers</p>
                  {editingTask.options.map((opt, idx) => (
                    <div key={opt.id} className="flex gap-2">
                      <input value={opt.label} onChange={e => {
                        const newOps = [...editingTask.options];
                        newOps[idx].label = e.target.value;
                        setEditingTask({...editingTask, options: newOps});
                      }} className="flex-1 bg-slate-950 border border-cyan-900/30 p-2 text-xs text-white" />
                      <input type="number" value={opt.points} onChange={e => {
                        const newOps = [...editingTask.options];
                        newOps[idx].points = parseInt(e.target.value);
                        setEditingTask({...editingTask, options: newOps});
                      }} className="w-16 bg-slate-950 border border-cyan-900/30 p-2 text-xs text-cyan-400 text-center" />
                      <button type="button" onClick={() => setEditingTask({...editingTask, options: editingTask.options.filter((_, i) => i !== idx)})} className="text-red-900 hover:text-red-500"><Trash2 size={14}/></button>
                    </div>
                  ))}
                  <button type="button" onClick={addDeadlineOption} className="w-full py-2 border border-dashed border-cyan-900 text-cyan-900 hover:text-cyan-400 text-[10px] uppercase font-bold">+ Add Tier</button>
                </div>
                <div className="flex gap-2 pt-4">
                  <button type="submit" className="flex-1 py-4 bg-cyan-400 text-black font-black text-xs tracking-widest hover:bg-white shadow-neon-glow">INITIALIZE</button>
                  <button type="button" onClick={() => { if(confirm("Terminate Mission?")) setTasks(prev => prev.filter(t => t.id !== editingTask.id)); setEditingTask(null); }} className="px-4 border border-red-900 text-red-700 text-[10px] hover:animate-pulse">SCRAP</button>
                </div>
              </div>
            </form>
          </div>
        )}

        {/* COMPLETION MODAL */}
        {activeModal && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
            <div className="w-full max-w-sm bg-[#050914] border border-cyan-500 p-1 shadow-neon-glow rounded-xl">
              <div className="bg-[#080c16] p-8 text-center">
                <div className="flex items-center gap-3 mb-6 border-b border-cyan-900/50 pb-4">
                  <div className="w-10 h-10 border border-white/20 flex items-center justify-center bg-white/5 rounded-full"><span className="text-xl font-bold text-white">!</span></div>
                  <div className="text-sm font-bold text-white tracking-[0.3em] uppercase flex-1 text-left">NOTIFICATION</div>
                </div>
                <p className="text-slate-400 text-sm mb-2 uppercase">Requirements fulfilled for:</p>
                <p className="text-xl text-white font-bold text-glow mb-6">[{activeModal.title}]</p>
                <div className="bg-cyan-950/20 p-5 border border-cyan-900 mb-8 rounded-lg">
                  <p className="text-[10px] text-cyan-500 uppercase tracking-widest mb-1">XP_ACQUIRED</p>
                  <p className="text-4xl font-bold text-cyan-400">+{pendingTier?.points} XP</p>
                </div>
                <div className="flex gap-4">
                  <button onClick={confirmCompletion} className="flex-1 py-4 bg-cyan-400 text-black font-black tracking-widest hover:bg-white shadow-neon-glow">ACCEPT</button>
                  <button onClick={() => setActiveModal(null)} className="flex-1 py-4 border border-slate-700 text-slate-500 font-bold uppercase tracking-widest hover:bg-slate-800">DECLINE</button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
