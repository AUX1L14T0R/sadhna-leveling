import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { GameProvider } from './context/GameContext';
import { Capacitor } from '@capacitor/core';
import { App as CapacitorApp } from '@capacitor/app'; 

import Navigation from './components/Navigation';
import StatsPage from './pages/StatsPage';
import QualitiesPage from './pages/QualitiesPage';
import TasksPage from './pages/TasksPage';
import SystemBackground from './components/SystemBackground';

const BackButtonHandler = () => {
  const navigate = useNavigate(); 
  const location = useLocation();

  useEffect(() => {
    if (Capacitor.isNativePlatform()) {
      CapacitorApp.addListener('backButton', () => {
        if (location.pathname === '/' || location.pathname === '/stats') {
          CapacitorApp.exitApp();
        } else {
          navigate(-1);
        }
      });
    }
    return () => CapacitorApp.removeAllListeners();
  }, [navigate, location]);

  return null;
};

export default function App() {
  return (
    <Router>
      <GameProvider>
        <BackButtonHandler />
        <div className="h-screen w-full flex flex-col overflow-hidden bg-[#020617] relative font-sans">
          <SystemBackground />

          {/* 🔴 FIX IS HERE */}
          <main className="flex-1 relative z-10 min-h-0">
            <Routes>
              <Route path="/" element={<StatsPage />} />
              <Route path="/qualities" element={<QualitiesPage />} />
              <Route path="/tasks" element={<TasksPage />} />
            </Routes>
          </main>

          <Navigation />
        </div>
      </GameProvider>
    </Router>
  );
}
