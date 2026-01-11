import { useGame } from "../context/GameContext";

export default function StatusBar() {
  const { xp, level, rank } = useGame();
  const progress = xp % 100;

  return (
    <div className="hud-card p-4 mb-6">
      <p className="text-xs tracking-widest text-cyan-400">PLAYER STATUS</p>

      <div className="flex justify-between mt-2">
        <span>LEVEL {level}</span>
        <span className="text-red-400">RANK {rank}</span>
      </div>

      <div className="h-2 bg-slate-800 mt-3">
        <div
          className="h-full bg-cyan-500 shadow-[0_0_15px_#00f0ff]"
          style={{ width: `${progress}%` }}
        />
      </div>

      <p className="text-[10px] text-right mt-1">{xp} XP</p>
    </div>
  );
}
