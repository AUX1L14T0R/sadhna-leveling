import { BrowserRouter, Routes, Route } from "react-router-dom";
import { GameProvider } from "./context/GameContext";
import SystemBackground from "./components/SystemBackground";
import Navigation from "./components/Navigation";

import QualitiesPage from "./pages/QualitiesPage";
import TasksPage from "./pages/TasksPage";
import StatsPage from "./pages/StatsPage";

export default function App() {
  return (
    <GameProvider>
      <BrowserRouter>
        <SystemBackground />
        <div className="relative z-10 min-h-screen pb-24 text-white">
          <Routes>
            <Route path="/" element={<QualitiesPage />} />
            <Route path="/tasks" element={<TasksPage />} />
            <Route path="/stats" element={<StatsPage />} />
          </Routes>
          <Navigation />
        </div>
      </BrowserRouter>
    </GameProvider>
  );
}
